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
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to LocalStorage', e);
    }
  }
  const saved = localStorage.getItem('aechagi_products');
  return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
}

export async function saveProductsToStorage(products) {
  localStorage.setItem('aechagi_products', JSON.stringify(products));
  if (supabase) {
    try {
      await supabase.from('products').upsert(products);
    } catch (e) {
      console.warn('Supabase upsert failed', e);
    }
  }
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
