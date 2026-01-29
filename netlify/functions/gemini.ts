import fetch from "node-fetch";

export const handler = async (event) => {
  const { category } = JSON.parse(event.body || "{}");

  const prompt = `
أنشئ 5 أسئلة اختيار من متعدد باللغة العربية
في مجال: ${category}

الشروط:
- كل سؤال له 4 خيارات
- خيار واحد صحيح فقط
- أرجع النتيجة بصيغة JSON فقط بدون شرح

الصيغة:
[
 {
   "q": "...",
   "options": ["", "", "", ""],
   "correct": 0
 }
]
`;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text;

  return {
    statusCode: 200,
    body: text,
  };
};
