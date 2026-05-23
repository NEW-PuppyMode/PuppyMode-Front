/* eslint-disable @typescript-eslint/no-require-imports */
// main_dog_[강아지종]_[성장단계]_[반응상태].gif
const puppyGifs = {
  bichon: {
    growth1: {
      normal: require('@/assets/videos/dogs/main_dog_bichon_lv1_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_bichon_lv1_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_bichon_lv1_heart.gif'),
    },
    growth2: {
      normal: require('@/assets/videos/dogs/main_dog_bichon_lv2_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_bichon_lv2_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_bichon_lv2_heart.gif'),
    },
    growth3: {
      normal: require('@/assets/videos/dogs/main_dog_bichon_lv3_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_bichon_lv3_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_bichon_lv3_heart.gif'),
    },
  },
  poodle: {
    growth1: {
      normal: require('@/assets/videos/dogs/main_dog_poodle_lv1_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_poodle_lv1_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_poodle_lv1_heart.gif'),
    },
    growth2: {
      normal: require('@/assets/videos/dogs/main_dog_poodle_lv2_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_poodle_lv2_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_poodle_lv2_heart.gif'),
    },
    growth3: {
      normal: require('@/assets/videos/dogs/main_dog_poodle_lv3_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_poodle_lv3_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_poodle_lv3_heart.gif'),
    },
  },
  shiba: {
    growth1: {
      normal: require('@/assets/videos/dogs/main_dog_shiba_lv1_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_shiba_lv1_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_shiba_lv1_heart.gif'),
    },
    growth2: {
      normal: require('@/assets/videos/dogs/main_dog_shiba_lv2_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_shiba_lv2_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_shiba_lv2_heart.gif'),
    },
    growth3: {
      normal: require('@/assets/videos/dogs/main_dog_shiba_lv3_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_shiba_lv3_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_shiba_lv3_heart.gif'),
    },
  },
  welshcorgi: {
    growth1: {
      normal: require('@/assets/videos/dogs/main_dog_welshcorgi_lv1_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_welshcorgi_lv1_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_welshcorgi_lv1_heart.gif'),
    },
    growth2: {
      normal: require('@/assets/videos/dogs/main_dog_welshcorgi_lv2_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_welshcorgi_lv2_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_welshcorgi_lv2_heart.gif'),
    },
    growth3: {
      normal: require('@/assets/videos/dogs/main_dog_welshcorgi_lv3_normal.gif'),
      angry: require('@/assets/videos/dogs/main_dog_welshcorgi_lv3_angry.gif'),
      heart: require('@/assets/videos/dogs/main_dog_welshcorgi_lv3_heart.gif'),
    },
  },
};

import { ImageSourcePropType } from 'react-native';

const calendarDogImages = {
  bichon: {
    drunk: require('@/assets/images/calendar/calendar_dog_bichon_drunk.png'),
    sober: require('@/assets/images/calendar/calendar_dog_bichon_sober.png'),
  },
  poodle: {
    drunk: require('@/assets/images/calendar/calendar_dog_poodle_drunk.png'),
    sober: require('@/assets/images/calendar/calendar_dog_poodle_sober.png'),
  },
  siba: {
    drunk: require('@/assets/images/calendar/calendar_dog_siba_drunk.png'),
    sober: require('@/assets/images/calendar/calendar_dog_siba_sober.png'),
  },
  welshcorgi: {
    drunk: require('@/assets/images/calendar/calendar_dog_welshcorgi_drunk.png'),
    sober: require('@/assets/images/calendar/calendar_dog_welshcorgi_sober.png'),
  },
};

const unmarkedDrinkImage = require('@/assets/images/calendar/calendar_dog_empty.png');

export const getCalendarDogImage = (
  levelName: string,
  isDrink: boolean | null | undefined,
): ImageSourcePropType => {
  if (isDrink === null || isDrink === undefined) return unmarkedDrinkImage;

  const name = (levelName ?? '').trim();
  let breedKey: keyof typeof calendarDogImages = 'bichon';
  if (name.includes('코기')) breedKey = 'welshcorgi';
  else if (name.includes('시바')) breedKey = 'siba';
  else if (name.includes('푸들')) breedKey = 'poodle';

  return isDrink
    ? calendarDogImages[breedKey].drunk
    : calendarDogImages[breedKey].sober;
};

type ReactionState = 'normal' | 'angry' | 'heart';

export const getPuppyGifSource = (
  levelName: string,
  level: number,
  reaction: ReactionState = 'normal',
): ImageSourcePropType => {
  const name = (levelName ?? '').trim();

  let breedKey: keyof typeof puppyGifs = 'bichon';
  if (name.includes('코기')) breedKey = 'welshcorgi';
  else if (name.includes('시바')) breedKey = 'shiba';
  else if (name.includes('푸들')) breedKey = 'poodle';

  let growthKey: 'growth1' | 'growth2' | 'growth3';
  if (level >= 20) growthKey = 'growth3';
  else if (level >= 10) growthKey = 'growth2';
  else growthKey = 'growth1';

  return puppyGifs[breedKey][growthKey][reaction];
};
