import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

export default function AboutPage({ characters, onNavigateToShop }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  const aboutBanners = [
    '/assets/images/어바웃_배너_1.jpg',
    '/assets/images/어바웃_배너_2.png',
    '/assets/images/어바웃_배너_3.png',
    '/assets/images/어바웃_배너_4.png',
    '/assets/images/어바웃_배너_5.png'
  ];

  // Track scroll position for seamless stacked PNG banners 1~5
  useEffect(() => {
    const handleScroll = () => {
      const bannerSection = document.getElementById('stacked-banner-section');
      if (!bannerSection) return;

      const rect = bannerSection.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, totalHeight)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#F8FAFC] pb-32">
      {/* 1. STICKY HEADER & SEAMLESS OVERLAY PNG SCROLL BANNERS 1~5 */}
      <section id="stacked-banner-section" className="relative min-h-[300vh] bg-[#D6F4FF] border-b border-sky-200/60">
        
        {/* Sticky Container */}
        <div className="sticky top-16 sm:top-18 h-[calc(100vh-4.5rem)] flex flex-col items-center justify-start p-4 sm:p-8 overflow-hidden z-10">
          
          {/* Fixed Top Brand Copy Text */}
          <div className="max-w-3xl mx-auto text-center space-y-2 pt-2 z-20">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif italic">
              애차기들 브랜드 STORE
            </h1>
            <div className="space-y-0.5">
              <p className="text-sm sm:text-base font-bold text-slate-800">
                작은 것들에서 찾는 큰 행복
              </p>
              <p className="text-xs sm:text-sm font-black text-sky-600">
                &lt;사랑하고 싶은 우리들의 관계 관찰 프로젝트&gt;
              </p>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              유형을 찾는 것 뿐 아니라 유형 속에서 나를 찾아가는 여정
            </p>
          </div>

          {/* Seamless PNG Banner Overlay Area (NO WHITE BOX, NO CARDS, NO BORDER) */}
          <div className="flex-1 relative w-full max-w-4xl mx-auto mt-4 flex items-center justify-center">
            {aboutBanners.map((bannerUrl, idx) => {
              // Calculate layer activation threshold
              const stepThreshold = idx / (aboutBanners.length - 1);
              // Base image (idx === 0) is always fully visible; PNG layers 1~4 fade in as user scrolls
              const opacity = idx === 0 
                ? 1 
                : Math.max(0, Math.min(1, (scrollProgress - (stepThreshold - 0.25)) / 0.25));

              return (
                <img
                  key={idx}
                  src={bannerUrl}
                  alt={`어바웃 배너 ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ease-out"
                  style={{
                    zIndex: idx + 1,
                    opacity: opacity,
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. CARD 1: 01. PLANNING BACKGROUND (Title: 애차기들? + Circle Frame 어바웃_소개_1.jpg) */}
      <section id="section-story-1" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-200/60 pt-20">
        <div className="bg-white rounded-3xl border border-sky-100 shadow-xs p-8 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="md:col-span-7 space-y-3">
            <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase">
              01. PLANNING BACKGROUND
            </span>
            <h2 className="text-2xl font-black text-slate-900 leading-snug">
              애차기들?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium space-y-2">
              <span className="block">
                일상과 회사에서는 무던하고 안정적인 사람도, 연애나 특정 관계에서는 사소한 답장 속도에 마음이 오르내리곤 합니다.
              </span>
              <span className="block text-slate-500">
                관계와 상황마다 달라지는 내 모습에 혼란을 느낄 때, "나는 왜 이럴까?"라고 스스로를 자책하기보다 애착유형을 통해 "아, 나는 이럴 때 이렇게 반응하는 사람이구나"를 이해하게 됩니다.
              </span>
            </p>
          </div>

          {/* Right Circle Box Image (어바웃_소개_1.jpg) */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-sky-100 overflow-hidden shadow-md bg-sky-50">
              <img
                src="/assets/images/어바웃_소개_1.jpg"
                alt="어바웃 소개 1"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CARD 2: 02. CORE PHILOSOPHY (Title: '나'라는 사람의 이해 + Circle Frame 어바웃_소개_2.png) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200/60">
        <div className="bg-white rounded-3xl border border-sky-100 shadow-xs p-8 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Circle Box Image (어바웃_소개_2.png) */}
          <div className="md:col-span-5 order-2 md:order-1 flex justify-center">
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-sky-100 overflow-hidden shadow-md bg-sky-50">
              <img
                src="/assets/images/어바웃_소개_2.png"
                alt="어바웃 소개 2"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Text */}
          <div className="md:col-span-7 order-1 md:order-2 space-y-3">
            <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase">
              02. CORE PHILOSOPHY
            </span>
            <h2 className="text-2xl font-black text-slate-900 leading-snug">
              '나'라는 사람의 이해
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium space-y-2">
              <span className="block">
                애착과 감정은 반드시 없애거나 해결해야 하는 대상이 아닙니다. 자신에게 나타나는 여러 모습을 이해하고 때로는 달래며 함께 살아가는 방법을 알아갑니다.
              </span>
              <span className="block text-slate-500">
                나에 대한 이해는 타인과의 관계 방식으로 확장되어, 관계 속에서 이전과는 다른 새로운 대처와 대화를 시도해볼 수 있는 힘이 됩니다.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* 4. CARD 3: 03. CHARACTER DICTIONARY */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase">
            03. CHARACTER DICTIONARY
          </span>
          <h2 className="text-2xl font-black text-slate-900">❤️ 애차기 캐릭터 애착도감 ❤️</h2>
          <p className="text-xs text-slate-500">
            4가지 애착유형의 귀여운 캐릭터들을 만나보세요.
          </p>
        </div>

        {/* Character Cards */}
        <div className="space-y-8">
          {characters.map((char) => (
            <div
              key={char.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              {/* Nukki Transparent Image (NO badge overlays) */}
              <div className="md:col-span-4 aspect-square rounded-2xl bg-sky-50/60 p-4 border border-sky-100 flex items-center justify-center">
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Character Details (NO species subtext, NO '의미:' prefix) */}
              <div className="md:col-span-8 space-y-3">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{char.name}</h3>
                  <span className="text-xs font-extrabold text-sky-600 block mt-0.5">
                    [{char.typeCode}]
                  </span>
                </div>

                <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-xs font-bold text-sky-900">
                  "{char.belief}"
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {char.description}
                </p>

                <div className="pt-1">
                  <button
                    onClick={onNavigateToShop}
                    className="px-4 py-2 bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>{char.name} 전용 굿즈 보러가기</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
