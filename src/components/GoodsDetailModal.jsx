import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ChevronLeft, ChevronRight, Plus, Minus, ArrowRight } from 'lucide-react';

export default function GoodsDetailModal({ 
  product, 
  character, 
  isWishlisted,
  onToggleWishlist,
  onClose, 
  onAddToCart,
  onOpenCart
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(product.options ? product.options[0] : '기본');
  
  // Cart Confirmation Popup state
  const [showCartNoticeModal, setShowCartNoticeModal] = useState(false);

  if (!product) return null;

  const imageList = [product.image, product.hoverImage].filter(Boolean);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleAddToCartClick = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart({ ...product, selectedOption });
    }
    setShowCartNoticeModal(true);
  };

  const handleBuyNowClick = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart({ ...product, selectedOption });
    }
    onClose();
    onOpenCart(true); // Open cart drawer with checkout disabled mode
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Images area with faint left/right arrows */}
        <div className="md:w-1/2 bg-[#F8FAFC] p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-xs relative">
            <img
              src={imageList[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Faint Image Arrows */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/50 hover:bg-white text-slate-600 flex items-center justify-center transition-colors shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/50 hover:bg-white text-slate-600 flex items-center justify-center transition-colors shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Details & Order Buttons */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-4">
          <div className="space-y-3">
            {character && (
              <span className={`inline-block px-2.5 py-0.5 text-[10px] font-extrabold rounded-md ${character.badgeColor}`}>
                {character.name} ({character.type})
              </span>
            )}

            <h2 className="text-lg font-black text-slate-900 leading-snug">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 text-xs text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating || 5.0}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400 font-medium">리뷰 {product.reviewsCount || 0}개</span>
            </div>

            {/* Price */}
            <div className="py-2 border-y border-slate-100 flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">
                ₩ {product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₩ {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {product.description}
            </p>

            {/* Option Selector */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">옵션 선택</label>
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                >
                  {product.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity Controller */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">수량</label>
              <div className="flex items-center gap-3 bg-slate-100 w-fit px-3 py-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-600 font-bold hover:text-slate-900"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-slate-900 min-w-[18px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-slate-600 font-bold hover:text-slate-900"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons: Wishlist Heart + Cart + Buy Now (Darker Sky Blue) */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
            {/* Heart Wishlist Toggle Button */}
            <button
              onClick={() => onToggleWishlist(product)}
              className="p-3 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-500 rounded-2xl transition-all border border-slate-200 flex-shrink-0"
              title="찜하기"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>

            {/* Cart Button */}
            <button
              onClick={handleAddToCartClick}
              className="flex-1 py-3 bg-sky-400 hover:bg-sky-500 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>장바구니</span>
            </button>

            {/* Buy Now Button (Darker Sky Blue) */}
            <button
              onClick={handleBuyNowClick}
              className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>구매하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cart Confirmation Popup Notice */}
      {showCartNoticeModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">장바구니에 담겼습니다!</h3>
            <p className="text-xs text-slate-500 font-medium">
              다른 상품도 구경하시겠나요?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowCartNoticeModal(false);
                  onClose();
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                더 구경하기
              </button>
              <button
                onClick={() => {
                  setShowCartNoticeModal(false);
                  onClose();
                  onOpenCart(false);
                }}
                className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                장바구니 이동
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
