# Kilimo Smart (Smart Shamba Advisor) - MVP Implementation Guide

## 1. Project Overview
Kilimo Smart is a production-ready MVP designed to bridge the agricultural extension gap in East Africa. It provides offline-first disease diagnosis, climate-smart advisory, and a localized AI chat interface.

## 2. Technical Architecture
- **Frontend**: React (PWA) with Tailwind CSS.
- **Offline ML**: TensorFlow.js (Web) / TFLite (Mobile) for on-device computer vision.
- **AI Brain**: Gemini 3 Flash for generative advisory (online) with local RAG fallback.
- **Data Source**: KALRO (Kenya Agricultural and Livestock Research Organization) & FAO guidelines.

## 3. Implementation Steps

### A. Crop Disease Model (Computer Vision)
1. **Data Collection**: Use the [PlantVillage dataset](https://github.com/spMohanty/PlantVillage-Dataset) or [iCassava](https://www.kaggle.com/c/cassava-leaf-disease-classification).
2. **Training**: Fine-tune a MobileNetV3 or EfficientNetLite model using transfer learning.
3. **Quantization**: Convert to TFLite (INT8 or Float16) to ensure it runs on low-end Android devices (<10MB model size).
4. **Deployment**: In this PWA, we use a mock diagnosis service. For production, integrate `@tensorflow/tfjs-tflite`.

### B. Offline RAG (Generative AI)
1. **Knowledge Base**: Curate PDFs/Text from KALRO e-Extension.
2. **Embeddings**: Use `all-MiniLM-L6-v2` (multilingual) to generate vectors.
3. **Local DB**: Store vectors in `IndexedDB` using `LanceDB` or a simple vector similarity search in JS.
4. **Fallback**: When offline, the app searches the local vector DB and provides pre-cached advice.

### C. Multi-lingual Support
- **Swahili First**: All labels and AI instructions prioritize Swahili.
- **Voice Interface**: Uses Web Speech API for STT and TTS. For production mobile, use `vosk-android` for offline ASR.

## 4. Offline Testing Plan
- **Accuracy Target**: >85% for Maize Streak Virus, Fall Armyworm, and Cassava Mosaic.
- **Latency**: Diagnosis should complete in <3 seconds on a device with 2GB RAM.
- **Storage**: Total app size (including models) should be <50MB.

## 5. Scaling Roadmap
1. **USSD Integration**: Connect the Express backend to an SMS gateway (e.g., Africa's Talking) for feature phone users.
2. **Community Reports**: Allow farmers to report sightings of pests (e.g., Locusts) to create a real-time heat map.
3. **Market Linkages**: Integrate current market prices from M-Farm or similar APIs.

## 6. Cost Estimate (1,000 Farmers in Kakamega)
- **Data Bundles**: $0.50/farmer/month (for sync) = $500/mo.
- **Hosting**: $20/mo (Firebase/Cloud Run).
- **Hardware**: $0 (BYOD - Bring Your Own Device).
- **Total Initial OpEx**: ~$520/month.

---
*Source: Developed for East African Smallholder Resilience Initiative 2026.*
