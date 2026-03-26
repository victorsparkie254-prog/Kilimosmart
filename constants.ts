import { CropInfo } from './types';

export const CROPS: CropInfo[] = [
  {
    id: 'maize',
    name: 'Maize',
    swahiliName: 'Mahindi',
    description: 'The primary staple crop in Kenya.',
    plantingSeason: 'March - April (Long rains), October - November (Short rains)',
    diseases: [
      {
        id: 'maize_lethal_necrosis',
        name: 'Maize Lethal Necrosis (MLN)',
        swahiliName: 'Mnyauko wa Mahindi',
        symptoms: 'Yellowing of leaves, drying from the edges, stunted growth.',
        treatment: 'Rotate crops, use certified seeds, remove infected plants.',
        organicTreatment: 'Intercrop with legumes, use neem-based pesticides.'
      },
      {
        id: 'fall_armyworm',
        name: 'Fall Armyworm',
        swahiliName: 'Funza wa Jeshi',
        symptoms: 'Ragged holes in leaves, sawdust-like waste in the whorl.',
        treatment: 'Apply recommended insecticides early in the morning or late evening.',
        organicTreatment: 'Handpicking, applying sand or ash in the whorl, using sugar-water traps.'
      }
    ]
  },
  {
    id: 'beans',
    name: 'Beans',
    swahiliName: 'Maharagwe',
    description: 'Essential protein source, often intercropped with maize.',
    plantingSeason: 'March - April, September - October',
    diseases: [
      {
        id: 'bean_rust',
        name: 'Bean Rust',
        swahiliName: 'Kutu ya Maharagwe',
        symptoms: 'Small, reddish-brown pustules on leaves.',
        treatment: 'Use resistant varieties, apply fungicides if severe.',
        organicTreatment: 'Crop rotation, avoid overhead irrigation, use compost tea spray.'
      }
    ]
  },
  {
    id: 'cassava',
    name: 'Cassava',
    swahiliName: 'Muhogo',
    description: 'Drought-tolerant tuber crop.',
    plantingSeason: 'Beginning of rainy season',
    diseases: [
      {
        id: 'cassava_mosaic',
        name: 'Cassava Mosaic Disease (CMD)',
        swahiliName: 'Magonjwa ya Mosaki ya Muhogo',
        symptoms: 'Distorted, yellow-mottled leaves, reduced tuber size.',
        treatment: 'Use CMD-free cuttings, plant resistant varieties.',
        organicTreatment: 'Uproot and burn infected plants, control whiteflies with neem oil.'
      }
    ]
  }
];

export const TRANSLATIONS = {
  en: {
    welcome: "Welcome to Kilimo Smart",
    diagnosis: "Disease Diagnosis",
    advisory: "Planting Advisory",
    chat: "Ask Shamba Expert",
    takePhoto: "Take a Photo",
    uploadPhoto: "Upload Photo",
    analyzing: "Analyzing crop health...",
    results: "Diagnosis Results",
    treatment: "Recommended Treatment",
    organic: "Organic Options",
    weather: "Weather Forecast",
    plantingTip: "Planting Tip",
    voicePrompt: "Tap to speak your question",
    source: "Source: KALRO / FAO Guidelines"
  },
  sw: {
    welcome: "Karibu Kilimo Smart",
    diagnosis: "Utambuzi wa Magonjwa",
    advisory: "Ushauri wa Kupanda",
    chat: "Uliza Mtaalam wa Shamba",
    takePhoto: "Piga Picha",
    uploadPhoto: "Pakia Picha",
    analyzing: "Tunachambua afya ya mmea...",
    results: "Matokeo ya Utambuzi",
    treatment: "Matibabu Yanayopendekezwa",
    organic: "Chaguzi za Kiorganiki",
    weather: "Utabiri wa Hali ya Hewa",
    plantingTip: "Kidokezo cha Kupanda",
    voicePrompt: "Gusa ili uzungumze swali lako",
    source: "Chanzo: Mwongozo wa KALRO / FAO"
  }
};
