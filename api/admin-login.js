import { createClient } from '@supabase/supabase-js';

// The account email stays in the server environment, not in the public bundle.
export function createLoginHandler({ env = process.env, makeClient = createClient } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: '허용되지 않는 요청입니다.' });
    }
    let body;
    try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
    catch { return res.status(400).json({ error: '요청 형식이 올바르지 않습니다.' }); }
    if (typeof body?.username !== 'string' || typeof body?.password !== 'string'
      || !body.password || body.password.length > 1024) {
      return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
    }
    if (body.username.trim() !== 'tndtlf123') {
      return res.status(401).json({ error: '아이디 또는 비밀번호를 확인해주세요.' });
    }
    const url = env.VITE_SUPABASE_URL;
    const key = env.VITE_SUPABASE_ANON_KEY;
    const email = env.ADMIN_LOGIN_EMAIL;
    if (!url || !key || !email) {
      return res.status(503).json({ error: '관리자 로그인 연결 설정을 확인해주세요.' });
    }
    try {
      const client = makeClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data, error } = await client.auth.signInWithPassword({ email, password: body.password });
      if (error) return res.status(401).json({ error: '아이디 또는 비밀번호를 확인해주세요.' });
      const { data: admin, error: adminError } = await client.from('shop_admins')
        .select('user_id').eq('user_id', data.user.id).maybeSingle();
      if (adminError || !admin) {
        await client.auth.signOut();
        return res.status(403).json({ error: '이 계정에는 상품 관리 권한이 없습니다.' });
      }
      return res.status(200).json({ access_token: data.session.access_token, refresh_token: data.session.refresh_token });
    } catch {
      return res.status(503).json({ error: '로그인 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' });
    }
  };
}

export default createLoginHandler();
