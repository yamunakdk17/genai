// require("dotenv").config();

// const { GoogleGenAI } = require("@google/genai");
// const { z } = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");

// console.log("KEY:", process.env.GEMINI_API_KEY);

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
// });

// // Interview Report Schema
// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description."),

//     technicalQuestions: z
//         .array(
//             z.object({
//                 question: z
//                     .string()
//                     .describe("The technical question that can be asked in the interview."),

//                 intention: z
//                     .string()
//                     .describe("The intention behind asking this technical question."),

//                 answer: z
//                     .string()
//                     .describe(
//                         "How to answer this question, what points to cover, and what approach to take."
//                     ),
//             })
//         )
//         .describe(
//             "Technical questions that can be asked in the interview along with their intention and how to answer them."
//         ),

//     behavioralQuestions: z
//         .array(
//             z.object({
//                 question: z
//                     .string()
//                     .describe("The behavioral question that can be asked in the interview."),

//                 intention: z
//                     .string()
//                     .describe("The intention behind asking this behavioral question."),

//                 answer: z
//                     .string()
//                     .describe(
//                         "How to answer this question, what points to cover, and what approach to take."
//                     ),
//             })
//         )
//         .describe(
//             "Behavioral questions that can be asked in the interview, along with their intention and how to answer them."
//         ),

//     skillGaps: z
//         .array(
//             z.object({
//                 skill: z
//                     .string()
//                     .describe("The skill that the candidate is lacking."),

//                 severity: z
//                     .enum(["low", "medium", "high"])
//                     .describe("The severity of this skill gap."),
//             })
//         )
//         .describe(
//             "List of skill gaps in the candidate's profile along with their severity."
//         ),

//     preparationPlan: z
//         .array(
//             z.object({
//                 day: z
//                     .number()
//                     .describe("The day number in the preparation plan, starting from 1."),

//                 focus: z
//                     .string()
//                     .describe(
//                         "The main focus of this day in the preparation plan, e.g. data structures, system design, etc."
//                     ),

//                 tasks: z
//                     .array(z.string())
//                     .describe(
//                         "List of tasks to be done on this day to follow the preparation plan."
//                     ),
//             })
//         )
//         .describe(
//             "A day-wise preparation plan for the candidate to follow in order to prepare for the interview."
//         ),
// });

// async function generateInterviewReport({
//     resume,
//     selfDescription,
//     jobDescription,
// }) {

//     const prompt = `Generate an interview report for a candidate with the following details:

// Resume:
// ${resume}

// Self Description:
// ${selfDescription}

// Job Description:
// ${jobDescription}
// `;
//     const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseJsonSchema: zodToJsonSchema(interviewReportSchema),
//         },
//     });
//     console.log("CURRENT KEY:", process.env.GEMINI_API_KEY);
    
//     return JSON.parse(response.text)
// }

// module.exports = generateInterviewReport;



require("dotenv").config();

const OpenAI = require("openai");
const puppeteer = require("puppeteer");

console.log("OPENROUTER KEY:", process.env.OPENROUTER_API_KEY);

const ai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical interviewer.

Generate an interview report for the following candidate.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY valid JSON.

{
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "skillGaps": [
    {
      "skill": "",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": ["", ""]
    }
  ]
}
`;

  const completion = await ai.chat.completions.create({
    model: "inclusionai/ling-3.0-flash:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
  });
  let text = completion.choices[0].message.content || "";

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(text);
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Generate a professional ATS-friendly resume.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY valid JSON.

{
  "html": "<html>...</html>"
}
`;

  const response = await ai.chat.completions.create({
    model: "inclusionai/ling-3.0-flash:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
  });

  let text = response.choices[0].message.content || "";

  text = text
    .replace(/```json/g, "")
    .replace(/```html/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const result = JSON.parse(text);
    return generatePdfFromHtml(result.html);
  } catch (err) {
    console.log("AI Response:");
    console.log(text);
    throw new Error("OpenRouter did not return valid JSON.");
  }



}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
};