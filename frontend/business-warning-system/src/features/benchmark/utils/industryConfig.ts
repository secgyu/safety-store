/**
 * 업종 관련 설정 및 상수
 */

export interface Industry {
  value: string;
  label: string;
}

/**
 * 대분류 업종 목록
 */
export const industries: Industry[] = [
  { value: "restaurant", label: "음식점 (한식/양식/일식/중식 등)" },
  { value: "cafe", label: "카페/베이커리" },
  { value: "fastfood", label: "패스트푸드/치킨" },
  { value: "pub", label: "주점/술집" },
  { value: "retail", label: "식자재/편의점" },
  { value: "other", label: "기타" },
];

/**
 * 대분류별 세부 업종 목록
 */
export const subIndustries: Record<string, Industry[]> = {
  restaurant: [
    { value: "한식-육류/고기", label: "한식 - 육류/고기" },
    { value: "백반/가정식", label: "백반/가정식" },
    { value: "한식-단품요리일반", label: "한식 - 단품요리" },
    { value: "한식-해물/생선", label: "한식 - 해물/생선" },
    { value: "한식-국수/만두", label: "한식 - 국수/만두" },
    { value: "한식-국밥/설렁탕", label: "한식 - 국밥/설렁탕" },
    { value: "한식-찌개/전골", label: "한식 - 찌개/전골" },
    { value: "한식-냉면", label: "한식 - 냉면" },
    { value: "한식뷔페", label: "한식뷔페" },
    { value: "한식-감자탕", label: "한식 - 감자탕" },
    { value: "한식-죽", label: "한식 - 죽" },
    { value: "한정식", label: "한정식" },
    { value: "양식", label: "양식" },
    { value: "일식당", label: "일식당" },
    { value: "일식-덮밥/돈가스", label: "일식 - 덮밥/돈가스" },
    { value: "일식-우동/소바/라면", label: "일식 - 우동/소바/라면" },
    { value: "일식-초밥/롤", label: "일식 - 초밥/롤" },
    { value: "중식당", label: "중식당" },
    { value: "중식-훠궈/마라탕", label: "중식 - 훠궈/마라탕" },
    { value: "동남아/인도음식", label: "동남아/인도음식" },
    { value: "분식", label: "분식" },
    { value: "스테이크", label: "스테이크" },
  ],
  cafe: [
    { value: "카페", label: "카페" },
    { value: "커피전문점", label: "커피전문점" },
    { value: "베이커리", label: "베이커리" },
    { value: "아이스크림/빙수", label: "아이스크림/빙수" },
    { value: "도너츠", label: "도너츠" },
    { value: "마카롱", label: "마카롱" },
    { value: "테마카페", label: "테마카페" },
    { value: "와플/크로플", label: "와플/크로플" },
  ],
  fastfood: [
    { value: "치킨", label: "치킨" },
    { value: "피자", label: "피자" },
    { value: "햄버거", label: "햄버거" },
    { value: "샌드위치/토스트", label: "샌드위치/토스트" },
  ],
  pub: [
    { value: "호프/맥주", label: "호프/맥주" },
    { value: "요리주점", label: "요리주점" },
    { value: "일반 유흥주점", label: "일반 유흥주점" },
    { value: "이자카야", label: "이자카야" },
    { value: "와인바", label: "와인바" },
    { value: "포장마차", label: "포장마차" },
  ],
  retail: [
    { value: "축산물", label: "축산물" },
    { value: "식료품", label: "식료품" },
    { value: "농산물", label: "농산물" },
    { value: "청과물", label: "청과물" },
    { value: "수산물", label: "수산물" },
    { value: "주류", label: "주류" },
    { value: "반찬", label: "반찬" },
    { value: "떡/한과", label: "떡/한과" },
    { value: "건강식품", label: "건강식품" },
  ],
  other: [{ value: "식품 제조", label: "식품 제조" }],
};

/**
 * 업종 코드로 라벨 찾기
 */
export function getIndustryLabel(industryCode: string): string {
  // 대분류에서 찾기
  const mainIndustry = industries.find((ind) => ind.value === industryCode);
  if (mainIndustry) return mainIndustry.label;

  // 세부 업종에서 찾기
  for (const [, subs] of Object.entries(subIndustries)) {
    const subIndustry = subs.find((sub) => sub.value === industryCode);
    if (subIndustry) return subIndustry.label;
  }

  return industryCode;
}

/**
 * 업종이 대분류인지 확인
 */
export function isMainCategory(industryCode: string): boolean {
  return industries.some((ind) => ind.value === industryCode);
}

/**
 * 세부 업종의 대분류 찾기
 */
export function getMainCategoryForSub(subIndustryCode: string): string | null {
  for (const [mainCategory, subs] of Object.entries(subIndustries)) {
    if (subs.some((sub) => sub.value === subIndustryCode)) {
      return mainCategory;
    }
  }
  return null;
}

