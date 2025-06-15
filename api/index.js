import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// 환경변수 불러오기
dotenv.config();

// Gemini API 객체 생성
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // CORS 헤더 설정
  const allowedOrigin = "https://github.com/seojin122"


  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    return res
      .status(200)
      .send("✅ 이 API는 POST 요청만 처리합니다. mood와 timeOfDay를 보내주세요.");
  }

  try {
    // req.body 수동 파싱 (Vercel에서는 반드시 필요)
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString();
    const body = JSON.parse(rawBody);

    const { mood, timeOfDay } = body;

    if (!mood || !timeOfDay) {
      return res.status(400).json({
        error: "기분(mood)과 시간대(timeOfDay)를 모두 입력해야 합니다.",
      });
    }

    const prompt = `
사용자의 현재 기분: ${mood}
현재 시간대: ${timeOfDay}

이런 감정과 시간대에 어울리는 노래 3곡을 추천해주세요.
각 곡에 대해 감성적인 한 줄 설명도 덧붙여 주세요.
노래 제목과 가수는 반드시 포함해주세요.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "당신은 감성적인 음악 큐레이터입니다. 사용자에게 어울리는 노래 3곡과 간단한 감성 설명을 추천하세요.",
      },
    });

    const responseText = result?.response?.text || result?.text;

    if (!responseText) {
      throw new Error("Gemini 응답이 비어 있습니다.");
    }

    res.status(200).json({ answer: responseText });
  } catch (err) {
    console.error("🔥 에러 발생:", err);
    res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
  }
}
