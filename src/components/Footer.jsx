import React from 'react';
import { Heart, Instagram, Mail } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          
          {/* Brand Philosophy */}
          <div className="space-y-2.5 max-w-sm">
            <div className="flex items-center gap-2 text-white font-black text-lg">
              <span>애차기들</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              &lt;사랑하고 싶은 우리들의 관계 관찰 프로젝트&gt;<br />
              유형을 찾는 것 뿐 아니라 유형 속에서 나를 찾아가는 여정.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex gap-10">
            <div>
              <h4 className="text-white font-bold text-xs mb-2.5 tracking-wider uppercase">NAVIGATION</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => onNavigate('shop')} className="hover:text-sky-400 transition-colors">
                    SHOP (굿즈 스토어)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('about')} className="hover:text-sky-400 transition-colors">
                    ABOUT (어바웃 브랜드 스토리)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="hover:text-sky-400 transition-colors">
                    CONTACT (문의 및 안내)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs mb-2.5 tracking-wider uppercase">SOCIAL & CONTACT</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-sky-400" />
                  <a 
                    href="https://www.instagram.com/aechagideul?stkn=MW5oOTh5cG1ucjdlYw%3D%3D&utm_source=qr" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:text-white transition-colors"
                  >
                    @aechagideul
                  </a>
                </li>
                <li className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>aechagideul@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-500">
          <p>© 2026 애차기들 Project Team. All Rights Reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-sky-400 fill-sky-400 inline" />
            <span>for Relationship Observation Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
