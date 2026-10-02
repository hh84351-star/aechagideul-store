import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, ArrowRight, Star } from 'lucide-react';

export default function ShopPage({ 
  products, 
  banners, 
  characters, 
  wishlistIds,
  onToggleWishlist,
  onSelectProduct 
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCharacter, setSelectedCharacter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [bestSlideIndex, setBestSlideIndex] = useState(0);

  // Auto slide promo banner
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  // BEST Products List (Top Section)
  const bestProducts = products.filter((p) => p.isBest);
  const itemsPerPage = 2;
  const maxBestPages = Math.ceil(bestProducts.length / itemsPerPage);
  const currentBestItems = bestProducts.slice(
    bestSlideIndex * itemsPerPage,
    (bestSlideIndex + 1) * itemsPerPage
  );

  const handleNextBest = () => {
    setBestSlideIndex((prev) => (prev + 1) % maxBestPages);
  };

  const handlePrevBest = () => {
    setBestSlideIndex((prev) => (prev - 1 + maxBestPages) % maxBestPages);
  };

  // Category Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchCharacter = selectedCharacter === 'all' || p.characterId === selectedCharacter;
    return matchCategory && matchCharacter;
  }).sort((a, b) => {
    if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0;
  });

  const handleBannerClick = (categoryFilter) => {
    setSelectedCategory(categoryFilter);
    const catalogElem = document.getElementById('catalog-section');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 pb-24 bg-[#F8FAFC]">
      {/* 1. TOP 2 PROMO BANNERS (배너_1.png & 배너_2.jpg) */}
      {banners && banners.length > 0 && (
        <section className="relative overflow-hidden bg-white rounded-3xl border border-sky-100/80 shadow-xs mx-4 sm:mx-8 lg:mx-auto max-w-6xl mt-6">
          <div className="relative h-[300px] sm:h-[380px] w-full">
            {banners.slice(0, 2).map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent flex items-center">
                  <div className="px-6 sm:px-12 max-w-lg text-white space-y-3">
                    <span className="inline-block px-3 py-1 bg-sky-500 text-white text-[10px] font-black tracking-widest uppercase rounded-full shadow-xs">
                      {banner.tag}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                      {banner.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">
                      {banner.subtitle}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => handleBannerClick(banner.categoryFilter)}
                        className="px-6 py-2.5 bg-white text-slate-900 hover:bg-sky-500 hover:text-white font-bold text-xs rounded-full transition-all shadow-md flex items-center gap-2 group"
                      >
                        <span>{banner.buttonText}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-white transition-all flex items-center justify-center border border-sky-100 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-white transition-all flex items-center justify-center border border-sky-100 shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Banner Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {[0, 1].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-sky-500' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* 2. CHARACTER QUICK SHOWCASE (Transparent Nukki PNGs + Clean Names) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-sky-500 fill-sky-500" />
            <span>애차기 캐릭터별 굿즈 모아보기</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {characters.map((char) => {
            const isSelected = selectedCharacter === char.id;
            return (
              <button
                key={char.id}
                onClick={() => setSelectedCharacter(isSelected ? 'all' : char.id)}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center text-center space-y-2 ${
                  isSelected
                    ? 'border-sky-400 bg-sky-50/80 ring-2 ring-sky-200 shadow-xs'
                    : 'border-slate-100 bg-white hover:border-sky-200 hover:bg-sky-50/30'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-sky-50/60 p-2 flex items-center justify-center overflow-hidden border border-sky-100">
                  <img src={char.image} alt={char.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">
                    {char.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    전용 굿즈 보기
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. BEST PRODUCTS SHOWCASE (2 Items Per View + Sideways Slider) */}
      {selectedCategory === 'all' && selectedCharacter === 'all' && bestProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-sky-500 text-white text-[10px] font-black rounded-md">
                BEST
              </span>
              <h3 className="text-base font-black text-slate-900">
                인기 베스트 굿즈
              </h3>
            </div>

            {/* Sideways Navigation Buttons for BEST items (2 per slide) */}
            {maxBestPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-semibold">
                  {bestSlideIndex + 1} / {maxBestPages}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={handlePrevBest}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors shadow-xs"
                    title="이전 상품"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextBest}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors shadow-xs"
                    title="다음 상품"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2 Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentBestItems.map((product) => (
              <ProductCardItemNoAdd
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. MAIN CATEGORY CATALOG SECTION (ALL 5 Categories Maintained) */}
      <section id="catalog-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/60 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* All 5 Categories Maintained */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
            {[
              { id: 'all', label: '전체 굿즈' },
              { id: 'keyring', label: '🧸 뽀작 키링' },
              { id: 'tshirt', label: '👕 티셔츠' },
              { id: 'stationery', label: '📖 문구/다이어리' },
              { id: 'tech', label: '💡 무드등/테크' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] text-slate-400 font-semibold">총 {filteredProducts.length}개 상품</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:border-sky-400"
            >
              <option value="popular">인기순</option>
              <option value="newest">신상품순</option>
              <option value="price-low">낮은가격순</option>
              <option value="price-high">높은가격순</option>
            </select>
          </div>
        </div>

        {/* Product Catalog Grid OR "상품 준비중입니다." Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-2">
            <p className="text-slate-800 text-base font-bold">상품 준비중입니다.</p>
            <p className="text-slate-400 text-xs font-medium">더 예쁘고 포근한 굿즈로 준비하여 찾아뵙겠습니다!</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedCharacter('all'); }}
              className="mt-4 px-5 py-2 bg-sky-500 text-white text-xs font-bold rounded-full hover:bg-sky-600 transition-colors shadow-xs"
            >
              전체 굿즈 보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCardItemNoAdd
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Clean Product Card Component WITHOUT '담기' button in Grid
function ProductCardItemNoAdd({ 
  product, 
  isWishlisted, 
  onToggleWishlist, 
  onSelectProduct 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProduct(product)}
    >
      {/* Product Image Area with Hover Photo Toggle */}
      <div className="relative aspect-square bg-[#F8FAFC] overflow-hidden p-4 flex items-center justify-center">
        <img
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-2xl transition-all duration-500 group-hover:scale-105"
        />

        {/* Wishlist Heart Button on top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center shadow-xs hover:bg-white transition-all text-slate-600"
          title="찜하기"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
        </button>

        {/* BEST / NEW Badges on top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isBest && (
            <span className="px-2 py-0.5 bg-sky-500 text-white text-[9px] font-black rounded-md shadow-xs">
              BEST
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-md shadow-xs">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mb-1">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{product.rating || 5.0}</span>
            <span className="text-slate-400">({product.reviewsCount || 0})</span>
          </div>

          <h4 className="font-bold text-slate-900 text-xs leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">
            {product.name}
          </h4>
        </div>

        {/* Price Only (NO '담기' Button in Grid) */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-slate-400 line-through block">
                ₩ {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-sm font-black text-slate-900">
              ₩ {product.price.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-sky-600 font-bold group-hover:translate-x-1 transition-transform">
            상세보기 →
          </span>
        </div>
      </div>
    </div>
  );
}
