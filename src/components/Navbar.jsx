import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  cartItemsCount, 
  wishlistItemsCount, 
  openCart, 
  openWishlist 
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100/80 transition-all shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Image Logo (/assets/images/애차기들_로고.png) */}
        <button 
          onClick={() => setActiveTab('shop')} 
          className="flex items-center group text-left focus:outline-none"
        >
          <img
            src="/assets/images/애차기들_로고.png"
            alt="애차기들 로고"
            className="h-9 sm:h-10 object-contain group-hover:scale-105 transition-transform"
          />
        </button>

        {/* Center: Clean Minimalist Menu (ABOUT | SHOP | CONTACT) */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs font-extrabold tracking-widest text-slate-400">
          <button
            onClick={() => setActiveTab('about')}
            className={`transition-all hover:text-slate-900 ${
              activeTab === 'about'
                ? 'text-sky-600 font-black underline underline-offset-8 decoration-2 decoration-sky-400'
                : 'text-slate-500'
            }`}
          >
            ABOUT
          </button>

          <span className="text-slate-200 font-light">|</span>

          <button
            onClick={() => setActiveTab('shop')}
            className={`transition-all hover:text-slate-900 ${
              activeTab === 'shop'
                ? 'text-sky-600 font-black underline underline-offset-8 decoration-2 decoration-sky-400'
                : 'text-slate-500'
            }`}
          >
            SHOP
          </button>

          <span className="text-slate-200 font-light">|</span>

          <button
            onClick={() => setActiveTab('contact')}
            className={`transition-all hover:text-slate-900 ${
              activeTab === 'contact'
                ? 'text-sky-600 font-black underline underline-offset-8 decoration-2 decoration-sky-400'
                : 'text-slate-500'
            }`}
          >
            CONTACT
          </button>
        </nav>

        {/* Right: Wishlist Heart & Cart Buttons */}
        <div className="flex items-center gap-2">
          {/* Wishlist Heart Button */}
          <button
            onClick={openWishlist}
            className="relative p-2 text-slate-700 hover:text-rose-500 transition-colors"
            aria-label="찜 목록 보기"
            title="찜 목록"
          >
            <Heart className={`w-5 h-5 ${wishlistItemsCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {wishlistItemsCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {wishlistItemsCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative p-2 text-slate-700 hover:text-sky-600 transition-colors"
            aria-label="장바구니 보기"
            title="장바구니"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-sky-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
