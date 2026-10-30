export type AssetCredit = {
  name: string;
  author: string;
  license: string;
  sourceUrl: string;
};

export const MODEL_CREDITS: AssetCredit[] = [
  {
    name: 'Tomb of Tu Duc',
    author: 'matousekfoto',
    license: 'CC BY 4.0',
    sourceUrl: 'https://sketchfab.com/3d-models/tomb-of-tu-duc-77728a86ad1d4964824b63844d50bfe7',
  },
  {
    name: 'Trống đồng Đông Sơn - Việt Nam',
    author: 'ndnguyen3d',
    license: 'CC BY 4.0',
    sourceUrl: 'https://sketchfab.com/3d-models/trong-ong-ong-son-viet-nam-21e418a517a74b49a17ebbad94ba26c0',
  },
  {
    name: 'Royal Nghe Statue - Hue Imperial City',
    author: 'Atlantic Truong | Vietnam 3D',
    license: 'CC BY 4.0',
    sourceUrl: 'https://sketchfab.com/3d-models/royal-nghe-statue-hue-imperial-city-391d289bad2f48238c8f436d49dc60bb',
  },
  {
    name: 'Thư của chủ tịch HCM và Tuyên cáo',
    author: 'seawitch.vn',
    license: 'CC BY 4.0',
    sourceUrl: 'https://sketchfab.com/3d-models/thu-cua-chu-tich-hcm-va-tuyen-cao-17f2cc71bbac434fa21676e534174d1f',
  },
  {
    name: 'Tháp gốm hoa nâu thời Trần (Musée Cernuschi, Paris)',
    author: 'minhduc29062k3',
    license: 'CC BY 4.0',
    sourceUrl: 'https://sketchfab.com/3d-models/thap-gom-hoa-nau-thoi-tran-a9be25d62bc1414f9316eee0ebc28869',
  },
  {
    name: 'Covered Jar, 1500s–1600s, Vietnam (1998.285.a)',
    author: 'The Cleveland Museum of Art',
    license: 'CC0',
    sourceUrl: 'https://sketchfab.com/3d-models/1998285a-covered-jar-2155224257084c0e84465009dff10518',
  },
  {
    name: 'Celadon Ewer and Cover, 13th–14th C CE',
    author: 'Minneapolis Institute of Art',
    license: 'CC0',
    sourceUrl: 'https://sketchfab.com/3d-models/celadon-ewer-and-cover-13th-14th-c-ce-048c4728d8fd4f9b9bc97cfbaea48810',
  },
  {
    name: 'Vietnamese Bottle Vase (Yu-hu chun), 15th C CE',
    author: 'Minneapolis Institute of Art',
    license: 'CC0',
    sourceUrl: 'https://sketchfab.com/3d-models/vietnamese-bottle-vase-yu-hu-chun-15th-c-ce-49dc9488d3cd465ebc92f6b2d1bc1dc7',
  },
];

export const TEXTURE_CREDITS: AssetCredit[] = [
  {
    name: 'Plaster 001',
    author: 'ambientCG',
    license: 'CC0',
    sourceUrl: 'https://ambientcg.com/view?id=Plaster001',
  },
  {
    name: 'Terracotta Floor Tiles',
    author: 'Dimitrios Savva / Poly Haven',
    license: 'CC0',
    sourceUrl: 'https://polyhaven.com/a/terracotta_floor_tiles',
  },
  {
    name: 'Wood 027',
    author: 'ambientCG',
    license: 'CC0',
    sourceUrl: 'https://ambientcg.com/view?id=Wood027',
  },
];

const LICENSE_URLS: Record<string, string> = {
  'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
  CC0: 'https://creativecommons.org/publicdomain/zero/1.0/',
};

export function getLicenseUrl(license: string) {
  return LICENSE_URLS[license.trim()];
}
