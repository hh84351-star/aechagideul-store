import { saveProduct, deleteProduct, uploadProductImage, supabase, signInAdmin, isShopAdmin } from '../lib/supabase';
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, ShieldCheck, RefreshCw, 
  MessageSquare, Tag, Eye, Lock, Star, Check
} from 'lucide-react';

export default function AdminPage({ 
  products,
  productsLoading,
  productsError,
  setProducts, 
  inquiries, 
  setInquiries, 
  characters,
  onResetData,
  onNavigateToShop
}) {
  // Password lock state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'keyring',
    characterId: 'dungdung',
    price: 15000,
    originalPrice: 18000,
    rating: 5.0,
    reviewsCount: 0,
    isBest: false,
    isNew: true,
    image: '/assets/goods/k_키링_둥둥1.jpg',
    hoverImage: '/assets/goods/k_키링_둥둥2.jpg',
    description: '',
    options: ['기본형']
  });

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let revision = 0;
    const verify = async session => {
      const current = ++revision;
      if (active) setIsAuthenticated(false);
      if (!session?.user) return;
      try {
        const allowed = await isShopAdmin(session.user.id);
        if (active && current === revision) setIsAuthenticated(allowed);
      } catch (error) {
        if (active && current === revision) setPasswordError(error.message);
      }
    };
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) { if (active) setPasswordError(error.message); return; }
      verify(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer database calls until the auth callback releases its lock.
      setTimeout(() => { if (active) verify(session); }, 0);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    if (isSigningIn) return;
    setIsSigningIn(true); setPasswordError('');
    try { await signInAdmin(emailInput, passwordInput); setIsAuthenticated(true); setPasswordInput(''); }
    catch (error) { setPasswordError(error.message); }
    finally { setIsSigningIn(false); }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) { setSaveError('로그아웃 실패: ' + error.message); return; }
    setIsAuthenticated(false); setEditingProduct(null); setIsAddModalOpen(false);
  };

  const persistProduct = async (product, adding = false) => {
    setIsSaving(true); setSaveError('');
    try {
      const saved = await saveProduct(product);
      setProducts(prev => adding ? [saved, ...prev] : prev.map(p => p.id === saved.id ? saved : p));
      setEditingProduct(null); setIsAddModalOpen(false);
      alert('상품이 서버에 저장되었습니다. 스토어에 반영됩니다.');
    } catch (error) { setSaveError(error.message); }
    finally { setIsSaving(false); }
  };
  const handleSaveProduct = e => {
    e.preventDefault();
    if (!isSaving && !isUploading && !productsLoading) persistProduct(editingProduct);
  };
  const handleAddProduct = e => {
    e.preventDefault();
    if (isSaving || isUploading || productsLoading) return;
    if (!newProduct.name || Number(newProduct.price) < 0) { setSaveError('상품명과 올바른 가격을 입력해주세요.'); return; }
    persistProduct({ ...newProduct, id: 'prod-' + Date.now() }, true);
  };
  const handleDeleteProduct = async id => {
    if (isSaving || productsLoading || !window.confirm('정말 이 상품을 삭제하시겠습니까?')) return;
    setIsSaving(true); setSaveError('');
    try { await deleteProduct(id); setProducts(prev => prev.filter(p => p.id !== id)); }
    catch (error) { setSaveError(error.message); }
    finally { setIsSaving(false); }
  };
  const handleImageUpload = async (event, field, editing) => {
    const file = event.target.files?.[0]; if (!file) return;
    setIsUploading(true); setSaveError('');
    try {
      const url = await uploadProductImage(file);
      (editing ? setEditingProduct : setNewProduct)(prev => prev ? { ...prev, [field]: url } : prev);
    } catch (error) { setSaveError(error.message); }
    finally { setIsUploading(false); }
    event.target.value = '';
  };
  const imageInput = (product, field, editing) => (
    <div className="space-y-2 mt-2">
      {product[field] && <img src={product[field]} alt="이미지 미리보기" className="w-24 h-24 rounded-xl object-contain border" />}
      <input aria-label={field === 'image' ? '메인 이미지 업로드' : '호버 이미지 업로드'} type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={isUploading || isSaving} onChange={e => handleImageUpload(e, field, editing)} className="w-full text-xs" />
      <p className="text-xs text-slate-500">JPG, PNG, WebP, GIF · 최대 5MB. 선택 후 상품을 저장해주세요.</p>
    </div>
  );

  // PASSWORD LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F8FAFC]">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-sky-100 shadow-xl max-w-sm w-full text-center space-y-5">
          <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">어드민 보안 로그인</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              등록된 관리자 이메일과 비밀번호로 로그인해주세요.
            </p>
          </div>

          {!supabase && <p role="alert" className="text-xs text-rose-600">서버 연결 설정이 없습니다. 배포 환경 변수를 확인해주세요.</p>}
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input type="email" aria-label="관리자 이메일" placeholder="관리자 이메일" autoComplete="username" required value={emailInput} onChange={e => setEmailInput(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs" />
            <input
              type="password"
              aria-label="관리자 비밀번호"
              autoComplete="current-password"
              required
              placeholder="비밀번호 입력"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-medium text-center focus:outline-none focus:border-sky-400"
            />

            {passwordError && (
              <p className="text-xs text-rose-500 font-bold">{passwordError}</p>
            )}

            <button
              disabled={isSigningIn || !supabase}
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              {isSigningIn ? '로그인 확인 중…' : '어드민 로그인'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 bg-[#F8FAFC]">
      {!supabase && <p role="alert" className="p-4 bg-amber-50 text-amber-900 rounded-xl text-sm">서버 연결 설정이 없어 상품 저장과 이미지 업로드를 사용할 수 없습니다.</p>}
      {productsError && <p role="alert" className="text-rose-600">{productsError} 새로고침 후 다시 시도해주세요.</p>}
      {productsLoading && !productsError && <p role="status">상품을 불러오는 중입니다.</p>}
      {saveError && <p role="alert" className="p-3 bg-rose-50 text-rose-700 rounded-xl text-sm">{saveError}</p>}
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-[10px] uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Admin Management System</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1">
            애차기들 어드민 관리자 센터
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            상품 가격, 상세 내용, 썸네일, 카테고리, 뱃지, 별점/리뷰 및 고객 문의를 실시간으로 관리하세요.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button onClick={handleLogout} disabled={isSaving || isUploading} className="px-3 py-2 text-xs bg-slate-800 rounded-xl">로그아웃</button>
          <button
            onClick={onResetData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            title="초기 데이터 복원"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span>기본 데이터 리셋</span>
          </button>
          <button
            onClick={onNavigateToShop}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>실제 스토어 보기</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-sky-50'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>상품 관리 ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
            activeTab === 'inquiries'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-sky-50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>고객 문의 ({inquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT TABLE */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">등록된 굿즈 목록</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>새 상품 등록</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">썸네일</th>
                    <th className="py-3 px-4">상품명</th>
                    <th className="py-3 px-4">카테고리</th>
                    <th className="py-3 px-4">캐릭터</th>
                    <th className="py-3 px-4">판매가 (₩)</th>
                    <th className="py-3 px-4">별점 / 리뷰</th>
                    <th className="py-3 px-4">뱃지</th>
                    <th className="py-3 px-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {products.map((p) => {
                    const char = characters.find((c) => c.id === p.characterId);
                    return (
                      <tr key={p.id} className="hover:bg-sky-50/30 transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                            />
                            {p.hoverImage && (
                              <img
                                src={p.hoverImage}
                                alt="hover"
                                className="w-7 h-7 object-cover rounded border border-slate-200 opacity-60"
                                title="호버 이미지"
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 max-w-xs">
                          {p.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">
                          {char ? char.name : '공통'}
                        </td>
                        <td className="py-2.5 px-4 font-black text-slate-900">
                          ₩ {p.price.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          ⭐ {p.rating || 5.0} ({p.reviewsCount || 0})
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex gap-1">
                            {p.isBest && <span className="px-1.5 py-0.5 bg-sky-100 text-sky-700 text-[9px] font-bold rounded">BEST</span>}
                            {p.isNew && <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded">NEW</span>}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => setEditingProduct({ ...p })}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="수정하기"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="삭제하기"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900">접수된 고객 문의 ({inquiries.length})</h2>
          {inquiries.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium">
              접수된 문의 내역이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{inq.name}</span>
                      <span className="text-[11px] text-slate-400">({inq.email})</span>
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[9px] font-bold rounded-full">
                        {inq.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{inq.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {inq.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-slate-900">상품 상세 정보 수정</h3>
              <button disabled={isSaving || isUploading} onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3"><fieldset disabled={isSaving || isUploading || productsLoading} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">상품명</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">카테고리</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  >
                    <option value="keyring">키링</option>
                    <option value="tshirt">티셔츠</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">캐릭터</label>
                  <select
                    value={editingProduct.characterId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, characterId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  >
                    <option value="dungdung">둥둥</option>
                    <option value="pbijju">삐쭈</option>
                    <option value="hamjwi">햄쥐</option>
                    <option value="dodo">도도</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">판매가 (₩)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">정가 (₩)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">별점 (0.0~5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.rating}
                    onChange={(e) => setEditingProduct({ ...editingProduct, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">리뷰 수</label>
                  <input
                    type="number"
                    value={editingProduct.reviewsCount}
                    onChange={(e) => setEditingProduct({ ...editingProduct, reviewsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">메인 썸네일 경로</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                />
                {imageInput(editingProduct, 'image', true)}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">호버 썸네일 경로</label>
                <input
                  type="text"
                  value={editingProduct.hoverImage || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, hoverImage: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                />
                {imageInput(editingProduct, 'hoverImage', true)}
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBest}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBest: e.target.checked })}
                    className="rounded text-sky-500"
                  />
                  BEST 뱃지
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNew}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                    className="rounded text-sky-500"
                  />
                  NEW 뱃지
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {isUploading ? '이미지 업로드 중…' : isSaving ? '서버에 저장 중…' : '저장하기'}
                </button>
              </div>
            {saveError && <p role="alert" className="text-xs text-rose-600">{saveError}</p>}</fieldset></form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-slate-900">새 굿즈 상품 등록</h3>
              <button disabled={isSaving || isUploading} onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3"><fieldset disabled={isSaving || isUploading || productsLoading} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">상품명</label>
                <input
                  type="text"
                  placeholder="예) 둥둥이 미니 쿠션"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">카테고리</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  >
                    <option value="keyring">키링</option>
                    <option value="tshirt">티셔츠</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">캐릭터</label>
                  <select
                    value={newProduct.characterId}
                    onChange={(e) => setNewProduct({ ...newProduct, characterId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  >
                    <option value="dungdung">둥둥</option>
                    <option value="pbijju">삐쭈</option>
                    <option value="hamjwi">햄쥐</option>
                    <option value="dodo">도도</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">판매가 (₩)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">정가 (₩)</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">메인 썸네일 경로</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                />
                {imageInput(newProduct, 'image', false)}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {isUploading ? '이미지 업로드 중…' : isSaving ? '서버에 저장 중…' : '상품 등록하기'}
                </button>
              </div>
            {saveError && <p role="alert" className="text-xs text-rose-600">{saveError}</p>}</fieldset></form>
          </div>
        </div>
      )}
    </div>
  );
}
