
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateBlogPost(topic: string, category: string) {
  const prompt = `
    다음 주제에 대해 '공백 제외 1,500자 이상의 매우 상세한' 교육적이고 전문적인 블로그 포스팅을 작성해 주세요.
    주제: ${topic}
    카테고리: ${category}

    지침 (매우 중요):
    1. 분량 준수: 공백을 제외한 순수 텍스트만으로 최소 1,500자 이상을 작성해야 합니다. 정보 밀도가 높고 깊이 있는 내용을 담으세요.
    2. 형식: HTML 태그(h2, h3, p, ul, li, strong 등)를 사용하여 시각적으로 구조화하세요.
    3. 구체성: 추상적인 설명보다는 구체적인 사례, 단계별 가이드, 최신 트렌드, 주의사항 등을 포함하여 실질적인 도움을 주어야 합니다.
    4. 구성:
       - 서론: 주제의 중요성과 독자가 얻을 수 있는 가치
       - 본론: 최소 4개 이상의 상세 섹션 (각 섹션마다 소제목 필수)
       - 실전 팁/체크리스트: 독자가 바로 실행해 볼 수 있는 구체적인 항목 목록
       - 결론: 내용 요약 및 향후 전망
    5. 말투: 신뢰감을 주는 전문가의 톤을 유지하되, 친절하게 설명하세요.
    6. 해시태그: 관련 높은 키워드 8개를 선정하세요.

    출력 형식은 반드시 아래 JSON 구조를 따르세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "포스팅 제목" },
            content: { type: Type.STRING, description: "HTML 본문 (공백 제외 1500자 이상)" },
            summary: { type: Type.STRING, description: "1~2문장의 짧은 요약" },
            hashtags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "해시태그 8개"
            },
            readTime: { type: Type.STRING, description: "예: '6분'" }
          },
          required: ["title", "content", "summary", "hashtags", "readTime"]
        }
      }
    });

    const result = JSON.parse(response.text);
    
    // Validate length (basic check, Gemini usually follows instructions but let's be safe)
    const textOnly = result.content.replace(/<[^>]*>/g, '').replace(/\s/g, '');
    console.log(`Generated content length (no spaces): ${textOnly.length}`);
    
    return result;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}
