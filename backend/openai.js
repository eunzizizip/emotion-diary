// openai.js
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateComfortMessage(diaryContent, emotionType) {
  console.log("🔥 감정 분석 요청:", diaryContent, emotionType);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "너는 감정이 힘든 사람에게 진심어린 위로와 공감을 주는 따뜻한 심리 상담사야. 문장은 너무 짧거나 단순하지 않게, 현실적인 공감과 위로의 말로 감정을 어루만져 줘.",
        },
        {
          role: "user",
          content: `감정 상태는 "${emotionType}"이고, 다음은 사용자의 감정 일기야:\n"${diaryContent}"\n이 사람에게 감정 상태에 맞게 따뜻하고 진심 어린 위로글을 작성해 줘. 말투는 친절하고 다정하게 해줘.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI 위로글 생성 실패", error);
    return "위로글 생성 중 오류가 발생했습니다.";
  }
}

module.exports = generateComfortMessage;
