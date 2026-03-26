export interface CropInfo {
  id: string;
  name: string;
  swahiliName: string;
  description: string;
  plantingSeason: string;
  diseases: Disease[];
}

export interface Disease {
  id: string;
  name: string;
  swahiliName: string;
  symptoms: string;
  treatment: string;
  organicTreatment: string;
  confidence?: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
  forecast: string;
  date: string;
}

export interface AdvisoryMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  voiceUrl?: string;
}
