/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          sky: "#F0F7FF",       // 메인 파스텔 하늘 배경
          skyLight: "#E6F2FE",  // 연한 파스텔 하늘
          skyBorder: "#BAE6FD", // 파스텔 테두리
          skyPrimary: "#0284C7",// 강조 스카이블루
          skyHover: "#0369A1",  // 호버 스카이블루
          textDark: "#0F172A",  // 가시성 높은 텍스트
          textMuted: "#64748B"  // 서브 텍스트
        },
        character: {
          dungdung: "#E08D45",
          pbijju: "#F5C242",
          hamjwi: "#9B72CF",
          dodo: "#4A6B82"
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
