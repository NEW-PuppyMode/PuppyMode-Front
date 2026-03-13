const puppyGifs = {
  bichon: {
    1: require('@/assets/videos/dogs/bichon_1.gif'),
    2: require('@/assets/videos/dogs/bichon_2.gif'),
    3: require('@/assets/videos/dogs/bichon_3.gif'),
  },
  poodle: {
    1: require('@/assets/videos/dogs/poodle_1.gif'),
    2: require('@/assets/videos/dogs/poodle_2.gif'),
    3: require('@/assets/videos/dogs/poodle_3.gif'),
  },
  siba: {
    1: require('@/assets/videos/dogs/siba_1.gif'),
    2: require('@/assets/videos/dogs/siba_2.gif'),
    3: require('@/assets/videos/dogs/siba_3.gif'),
  },
  welshcorgi: {
    1: require('@/assets/videos/dogs/welshcorgi_1.gif'),
    2: require('@/assets/videos/dogs/welshcorgi_2.gif'),
    3: require('@/assets/videos/dogs/welshcorgi_3.gif'),
  },
};

import { ImageSourcePropType } from 'react-native';

export const getPuppyGifSource = (
  levelName: string,
  level: number,
): ImageSourcePropType => {
  const name = (levelName ?? '').trim();

  let breedKey: keyof typeof puppyGifs = 'bichon';
  if (name.includes('코기')) breedKey = 'welshcorgi';
  else if (name.includes('시바')) breedKey = 'siba';
  else if (name.includes('푸들')) breedKey = 'poodle';

  const safeLevel = (level === 1 || level === 2 || level === 3 ? level : 1) as
    | 1
    | 2
    | 3;

  console.log(puppyGifs[breedKey][1]);
  return puppyGifs[breedKey][safeLevel] ?? puppyGifs[breedKey][1];
};
