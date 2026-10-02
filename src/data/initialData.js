export const INITIAL_CHARACTERS = [
  {
    id: "dungdung",
    name: "둥둥",
    species: "카피바라",
    type: "안정형",
    typeCode: "자기긍정 / 타인긍정",
    belief: "사랑 받고 싶고 사랑 주고 싶어",
    color: "#E08D45",
    bgColor: "bg-amber-50/70",
    borderColor: "border-amber-200/60",
    badgeColor: "bg-amber-100/80 text-amber-900 border border-amber-200/50",
    image: "/assets/characters/둥둥.png",
    description: "가까워지는 게 편하고 혼자 있는 시간도 괜찮아요. 갈등이 생기면 대화로 차분하게 해결방법을 찾습니다."
  },
  {
    id: "pbijju",
    name: "삐쭈",
    species: "병아리",
    type: "불안형",
    typeCode: "자기부정 / 타인긍정",
    belief: "사랑할 때 불안해서 확인해야해",
    color: "#F5C242",
    bgColor: "bg-yellow-50/70",
    borderColor: "border-yellow-200/60",
    badgeColor: "bg-yellow-100/80 text-yellow-900 border border-yellow-200/50",
    image: "/assets/characters/삐쭈.png",
    description: "상대의 일사분란한 반응에 민감해요. 답장이 늦으면 걱정하지만 그만큼 상대방을 아주 소중하게 생각해요."
  },
  {
    id: "hamjwi",
    name: "햄쥐",
    species: "햄스터",
    type: "혼란형 (불안-회피)",
    typeCode: "자기부정 / 타인부정",
    belief: "사랑할 때 다가가고 싶기도 멀어지고 싶기도해",
    color: "#9B72CF",
    bgColor: "bg-purple-50/70",
    borderColor: "border-purple-200/60",
    badgeColor: "bg-purple-100/80 text-purple-900 border border-purple-200/50",
    image: "/assets/characters/햄쥐.png",
    description: "가까워지고 싶으면서도 지나친 친밀함은 부담스러워 다가갔다 거리를 두지만, 진심어린 공감을 깊게 나눕니다."
  },
  {
    id: "dodo",
    name: "도도",
    species: "고양이",
    type: "회피형",
    typeCode: "자기긍정 / 타인부정",
    belief: "사랑 할 때 너무 가까이 하고 싶진 않아",
    color: "#4A6B82",
    bgColor: "bg-slate-50/70",
    borderColor: "border-slate-200/60",
    badgeColor: "bg-slate-100/80 text-slate-900 border border-slate-200/50",
    image: "/assets/characters/도도.png",
    description: "혼자만의 공간과 시간이 반드시 필요한 타입. 감정적으로 가까워지면 적당한 거리감을 유지하며 편안함을 느낍니다."
  }
];

export const INITIAL_BANNERS = [
  {
    id: 1,
    title: "애차기들 뽀작 봉제 인형 키링 4종 런칭!",
    subtitle: "둥둥 · 삐쭈 · 햄쥐 · 도도 내 가방 속 내 감정 짝꿍",
    tag: "BEST MERCH",
    buttonText: "키링 바로가기",
    image: "/assets/images/배너_1.png",
    categoryFilter: "keyring"
  },
  {
    id: 2,
    title: "관계 관찰 시그니처 라이프웨어 반팔 티셔츠",
    subtitle: "100% 프리미엄 코튼 | 매일 입고 싶은 포근함",
    tag: "NEW APPAREL",
    buttonText: "티셔츠 바로가기",
    image: "/assets/images/배너_2.jpg",
    categoryFilter: "tshirt"
  }
];

export const INITIAL_PRODUCTS = [
  // 1. 키링 시리즈 (마우스 호버 시 1->2 이미지 전환)
  {
    id: "k-dungdung",
    name: "둥둥이 뽀작 봉제 키링 (안정형)",
    category: "keyring",
    characterId: "dungdung",
    price: 15000,
    originalPrice: 18000,
    rating: 4.9,
    reviewsCount: 128,
    isBest: true,
    isNew: false,
    image: "/assets/goods/k_둥둥키링1.png",
    hoverImage: "/assets/goods/k_둥둥키링2.png",
    description: "어화둥둥 마음을 따뜻하게 안아주는 둥둥이 카피바라 키링. 부드러운 극세사 모찌 원단과 탄탄한 가방 고리가 포함되어 있습니다.",
    options: ["기본형 (카피바라 둥둥)"]
  },
  {
    id: "k-pbijju",
    name: "삐쭈 뽀작 봉제 키링 (불안형)",
    category: "keyring",
    characterId: "pbijju",
    price: 15000,
    originalPrice: 18000,
    rating: 4.9,
    reviewsCount: 94,
    isBest: true,
    isNew: false,
    image: "/assets/goods/k_삐쭈키링1.png",
    hoverImage: "/assets/goods/k_삐쭈키링2.png",
    description: "잘 삐지지만 제일 아껴주고 싶은 병아리 삐쭈 키링. 토실토실한 볼터치와 앙증맞은 미니 날개가 포인트입니다.",
    options: ["기본형 (병아리 삐쭈)"]
  },
  {
    id: "k-hamjwi",
    name: "햄쥐 뽀작 봉제 키링 (혼란형)",
    category: "keyring",
    characterId: "hamjwi",
    price: 15000,
    originalPrice: 18000,
    rating: 4.8,
    reviewsCount: 82,
    isBest: false,
    isNew: true,
    image: "/assets/goods/k_햄쥐키링1.png",
    hoverImage: "/assets/goods/k_햄쥐키링2.png",
    description: "다가갈까 멀어질까 고민하는 햄스터 햄쥐 키링. 가방이나 키홀더에 달면 은은한 보랏빛 다정함을 더해줍니다.",
    options: ["기본형 (햄스터 햄쥐)"]
  },
  {
    id: "k-dodo",
    name: "도도 뽀작 봉제 키링 (회피형)",
    category: "keyring",
    characterId: "dodo",
    price: 15000,
    originalPrice: 18000,
    rating: 4.9,
    reviewsCount: 115,
    isBest: true,
    isNew: false,
    image: "/assets/goods/k_도도키링1.png",
    hoverImage: "/assets/goods/k_도도키링2.png",
    description: "나만의 고유한 영역을 아끼는 시크한 고양이 도도 키링. 톡톡 튀는 그레이 파스텔 톤과 입체적인 귀 모형이 실물 매력 폭발!",
    options: ["기본형 (고양이 도도)"]
  },

  // 2. 티셔츠 라이프웨어 시리즈
  {
    id: "t-shirt-1",
    name: "애차기들 포근 라이프웨어 티셔츠 Vol.1",
    category: "tshirt",
    characterId: "dungdung",
    price: 32000,
    originalPrice: 38000,
    rating: 5.0,
    reviewsCount: 46,
    isBest: true,
    isNew: true,
    image: "/assets/goods/t_티셔츠1.jpg",
    hoverImage: "/assets/goods/t_티셔츠2.jpg",
    description: "관계 관찰 프로젝트 100% 덤블 워싱 코튼 티셔츠. 비침 없이 짱짱하고 유니섹스 세미 오버핏으로 남녀 모두 감성 착용 가능.",
    options: ["S", "M", "L", "XL"]
  },
  {
    id: "t-shirt-2",
    name: "애차기들 시그니처 그래픽 티셔츠 Vol.2",
    category: "tshirt",
    characterId: "pbijju",
    price: 32000,
    originalPrice: 38000,
    rating: 4.8,
    reviewsCount: 38,
    isBest: false,
    isNew: true,
    image: "/assets/goods/t_티셔츠3.jpg",
    hoverImage: "/assets/goods/t_티셔츠4.jpg",
    description: "트렌디한 실루엣과 감각적인 애차기들 4종 그래픽이 백프린팅된 시그니처 티셔츠.",
    options: ["S", "M", "L", "XL"]
  },
  {
    id: "t-shirt-3",
    name: "애차기들 스튜디오 루즈핏 티셔츠 Vol.3",
    category: "tshirt",
    characterId: "hamjwi",
    price: 32000,
    originalPrice: 38000,
    rating: 4.9,
    reviewsCount: 29,
    isBest: false,
    isNew: false,
    image: "/assets/goods/t_티셔츠5.jpg",
    hoverImage: "/assets/goods/t_티셔츠6.jpg",
    description: "어떤 바지와도 어울리는 포근한 데일리 베이직 티셔츠. 세탁 후 변형 없는 프리미엄 봉제 마감.",
    options: ["S", "M", "L", "XL"]
  },
  {
    id: "t-shirt-4",
    name: "애차기들 스트릿 그래픽 워싱 티셔츠 Vol.4",
    category: "tshirt",
    characterId: "dodo",
    price: 34000,
    originalPrice: 40000,
    rating: 4.7,
    reviewsCount: 21,
    isBest: false,
    isNew: true,
    image: "/assets/goods/t_티셔츠7.jpg",
    hoverImage: "/assets/goods/t_티셔츠8.jpg",
    description: "시크한 도도 고양이 아트워크 포인트의 스트릿 무드 코튼 티셔츠.",
    options: ["S", "M", "L", "XL"]
  },
  {
    id: "t-shirt-5",
    name: "애차기들 브랜드 에디션 티셔츠 Vol.5",
    category: "tshirt",
    characterId: "dungdung",
    price: 34000,
    originalPrice: 40000,
    rating: 5.0,
    reviewsCount: 65,
    isBest: true,
    isNew: false,
    image: "/assets/goods/t_티셔츠9.jpg",
    hoverImage: "/assets/goods/t_티셔츠1.jpg",
    description: "애차기들 브랜드 슬로건이 심플하고 명확하게 노출된 리미티드 에디션.",
    options: ["S", "M", "L", "XL"]
  }
];

export const INITIAL_INQUIRIES = [
  {
    id: 1,
    name: "김민지",
    email: "minji@example.com",
    type: "주문/배송",
    message: "키링 4종 세트로 구매하려고 하는데 재입고 시점이 언제쯤일까요? 너무 귀여워요!",
    createdAt: "2026-10-03 14:20",
    isRead: false
  }
];
