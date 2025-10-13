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
  let breedKey: keyof typeof puppyGifs = 'bichon';

  if (levelName?.endsWith('웰시코기')) {
    breedKey = 'welshcorgi';
  } else if (levelName?.endsWith('시바')) {
    breedKey = 'siba';
  } else if (levelName?.endsWith('푸들')) {
    breedKey = 'poodle';
  }

  return (
    puppyGifs[breedKey]?.[level as 1 | 2 | 3] ||
    puppyGifs[breedKey]?.[1] ||
    puppyGifs.bichon[1]
  );
};
