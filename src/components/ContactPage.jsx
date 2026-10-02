import React, { useState } from 'react';
import { Mail, Instagram, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage({ onSendInquiry }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '주문/배송',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

    onSendInquiry({
      ...formData,
      id: Date.now(),
      createdAt: new Date().toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }),
      isRead: false
    });

    setSubmitted(true);
    setFormData({ name: '', email: '', type: '주문/배송', message: '' });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-12 pb-24 bg-[#F8FAFC]">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#F0F7FF] via-[#E6F2FE] to-[#F8FAFC] py-16 px-4 text-center border-b border-sky-100">
        <div className="max-w-3xl mx-auto space-y-2.5">
          <span className="inline-block px-3.5 py-1 bg-white text-sky-700 text-[10px] font-black tracking-widest uppercase rounded-full border border-sky-100 shadow-xs">
            ✦ GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-serif italic">
            Contact
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg mx-auto">
            주문 문의, 커스텀 제작, 브랜드 콜라보레이션 — 무엇이든 환영합니다.
          </p>
        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Instagram & Email Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">언제든지 연락주세요</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                키링 및 티셔츠 굿즈 문의부터 커스텀 상담까지 편하게 보내주세요. 보통 1~2일 내로 친절하게 답변드립니다.
              </p>
            </div>

            <div className="space-y-3">
              {/* Instagram Card */}
              <a
                href="https://www.instagram.com/aechagideul?stkn=MW5oOTh5cG1ucjdlYw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-white border border-sky-100 flex items-center gap-3.5 hover:border-sky-300 hover:shadow-xs transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-serif italic font-bold text-slate-900 text-sm">Instagram</span>
                  <span className="text-[11px] text-slate-400">@aechagideul</span>
                </div>
              </a>

              {/* Email Card */}
              <div className="p-4 rounded-2xl bg-white border border-sky-100 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-serif italic font-bold text-slate-900 text-sm">Email</span>
                  <span className="text-[11px] text-slate-400">aechagideul@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-[#EBF5FF] p-6 sm:p-8 rounded-3xl border border-sky-200/60 shadow-xs relative">
            <h2 className="text-xl font-black text-slate-900 font-serif italic mb-5">
              메시지 보내기
            </h2>

            {submitted && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>메시지가 성공적으로 전송되었습니다! 어드민 관리자에서 실시간으로 확인하실 수 있습니다.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-sky-900 tracking-wider uppercase mb-1">
                  NAME
                </label>
                <input
                  type="text"
                  placeholder="이름을 입력해주세요"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-sky-100 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sky-900 tracking-wider uppercase mb-1">
                  EMAIL
                </label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-sky-100 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sky-900 tracking-wider uppercase mb-1">
                  INQUIRY TYPE
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-sky-100 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-sky-400 transition-all"
                >
                  <option value="주문/배송">주문 / 배송 문의</option>
                  <option value="팝업/콜라보">팝업 스토어 / 브랜드 콜라보</option>
                  <option value="캐릭터기획">애차기 캐릭터 및 웹툰 문의</option>
                  <option value="기타">기타 자유 문의</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sky-900 tracking-wider uppercase mb-1">
                  MESSAGE
                </label>
                <textarea
                  rows="4"
                  placeholder="문의하실 내용을 자유롭게 작성해주세요"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-sky-100 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-400 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-sky-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>메시지 전송하기</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
