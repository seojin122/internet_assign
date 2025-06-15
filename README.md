# 🎵 감정 기반 음악 추천 API (using Google Gemini)

이 프로젝트는 사용자의 기분(`mood`)과 시간대(`timeOfDay`)에 맞는 음악을 추천해주는 Node.js 기반의 API입니다. Google의 Gemini API(Gemini 2.0 Flash 모델)를 활용하여 감성적인 음악 큐레이션을 제공합니다.

## 📦 기술 스택

- Node.js
- Vercel Serverless Functions
- Google Generative AI SDK (`@google/genai`)
- dotenv

## 🚀 주요 기능

- 사용자로부터 기분과 시간대를 입력받아
- 감정과 상황에 어울리는 노래 3곡을 추천
- 각 곡마다 감성적인 설명도 포함됨

## 🔐 환경 변수 설정

루트 디렉토리에 `.env` 파일을 만들고 다음과 같이 작성하세요:

```json
{
  "mood": "설렘",
  "timeOfDay": "저녁"
}
