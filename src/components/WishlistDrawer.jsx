import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({ 
  isOpen, 
  onClose, 
  wishlistItems, 
  onRemoveWishlist, 
  onAddToCart 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-lg font-black text-slate-900">찜 목록</h2>
              <span className="text-xs font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">
                {wishlistItems.length}개
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <Heart className="w-12 h-12 stroke-[1.5] mb-3 text-slate-300" />
                <p className="text-sm font-semibold">찜한 상품이 없습니다.</p>
                <p className="text-xs text-slate-400 mt-1">마음에 드는 상품의 하트 아이콘을 눌러 담아보세요!</p>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-2xl border border-sky-100 shadow-xs flex gap-4 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-100 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs font-black text-slate-900 block mt-1">
                      ₩ {item.price.toLocaleString()}
                    </span>

                    <button
                      onClick={() => {
                        onAddToCart(item);
                        onRemoveWishlist(item.id);
                      }}
                      className="mt-2 px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white font-bold text-[10px] rounded-lg shadow-xs transition-colors flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>장바구니 담기</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveWishlist(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="찜 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-100 text-center bg-slate-50 text-[11px] text-slate-400 font-medium">
            찜 목록에 담아둔 상품은 언제든 장바구니로 이동할 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
