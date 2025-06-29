export const typographyMap = {
  RegularBig: 'font-pretendard text-[24px] font-normal',
  RegularSmall: 'font-pretendard text-[15px] font-normal',
  MediumBig: 'font-pretendard text-[24px] font-medium',
  MediumSmall: 'font-pretendard text-[15px] font-medium',
  SemiBoldBig: 'font-pretendard text-[24px] font-semibold',
  SemiBoldSmall: 'font-pretendard text-[15px] font-semibold',
  BoldBig: 'font-pretendard text-[24px] font-bold',
  BoldSmall: 'font-pretendard text-[15px] font-bold',
} as const;

export type TypographyType = keyof typeof typographyMap;
