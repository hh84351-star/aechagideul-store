import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS, INITIAL_INQUIRIES, INITIAL_BANNERS } from '../data/initialData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Hybrid Data Persistence Helper
export async function getProducts() {
  if (supabase) {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw new Error('상품 조회 실패: ' + error.message);
    return data;
  }
  try {
    const saved = JSON.parse(localStorage.getItem('aechagi_products'));
    return Array.isArray(saved) ? saved : INITIAL_PRODUCTS;
  } catch { return INITIAL_PRODUCTS; }
}

function requireSupabase() {
  if (!supabase) throw new Error('서버 연결 설정이 없습니다. Vercel의 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 확인하고 다시 배포해주세요.');
  return supabase;
}

export async function isShopAdmin(userId) {
  const { data, error } = await requireSupabase().from('shop_admins')
    .select('user_id').eq('user_id', userId).maybeSingle();
  if (error) throw new Error(`관리자 권한 확인 실패: ${error.message}`);
  return Boolean(data);
}

export async function signInAdmin(email, password) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw new Error('이메일 또는 비밀번호를 확인해주세요.');
  try {
    if (!await isShopAdmin(data.user.id)) throw new Error('이 계정에는 상품 관리 권한이 없습니다.');
    return data.user;
  } catch (error) {
    await client.auth.signOut();
    throw error;
  }
}

export async function saveProduct(product) {
  const { data, error } = await requireSupabase().from('products')
    .upsert(product, { onConflict: 'id' }).select().single();
  if (error) throw new Error(`상품 저장 실패: ${error.message}`);
  return data;
}

export async function deleteProduct(id) {
  const { data, error } = await requireSupabase().from('products').delete().eq('id', id).select('id');
  if (error) throw new Error(`상품 삭제 실패: ${error.message}`);
  if (!data?.length) throw new Error('상품이 삭제되지 않았습니다. 서버의 삭제 권한을 확인해주세요.');
}

export async function uploadProductImage(file) {
  const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
  if (!extensions[file.type]) throw new Error('JPG, PNG, WebP, GIF 이미지를 선택해주세요.');
  if (file.size > 5 * 1024 * 1024) throw new Error('이미지는 5MB 이하로 선택해주세요.');
  const client = requireSupabase();
  const bucket = import.meta.env.VITE_SUPABASE_IMAGE_BUCKET || 'product-images';
  const path = `products/${crypto.randomUUID()}.${extensions[file.type]}`;
  const { error } = await client.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function getInquiries() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('inquiries').select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase inquiries fetch failed', e);
    }
  }
  const saved = localStorage.getItem('aechagi_inquiries');
  return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
}

export async function saveInquiriesToStorage(inquiries) {
  localStorage.setItem('aechagi_inquiries', JSON.stringify(inquiries));
  if (supabase) {
    try {
      await supabase.from('inquiries').upsert(inquiries);
    } catch (e) {
      console.warn('Supabase inquiries upsert failed', e);
    }
  }
}
