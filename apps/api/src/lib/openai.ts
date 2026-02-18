import OpenAI from "openai";
import type { Goal, Tone } from "@sassy-coach/shared";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface GeneratedMission {
  task: string;
  sass: string;
  reflectionQuestion: string;
}

const TONE_DESCRIPTIONS: Record<Tone, string> = {
  sassy:
    "witty, teasing, playfully roasting — like a brutally honest best friend",
  kind: "warm, encouraging, supportive — like a gentle mentor",
  "drill-sergeant":
    "commanding, no-nonsense, intense — like a military coach",
  zen: "calm, philosophical, meditative — like a wise monk",
};

const GOAL_DESCRIPTIONS: Record<Goal, string> = {
  fitness: "physical health, exercise, nutrition, and body wellness",
  productivity:
    "time management, focus, work habits, and getting things done",
  language: "learning a new language through daily practice",
  "job-search":
    "finding a new job, resume building, networking, and interviews",
  custom: "a personal goal the user is working toward",
};

export async function generateMission(
  goal: Goal,
  tone: Tone,
  recentTasks: string[]
): Promise<GeneratedMission> {
  const systemPrompt = `You are Sassy Coach, a daily accountability coach inside a mobile app.
You generate ONE small, actionable daily mission for the user.

Your personality for this user is: ${TONE_DESCRIPTIONS[tone]}

Rules:
- The task must be completable in under 30 minutes
- The task must be specific and concrete (not vague)
- The task must relate to the user's goal: ${GOAL_DESCRIPTIONS[goal]}
- The sass/motivation message should be 1-2 sentences in the ${tone} tone
- The reflection question should be thoughtful and help the user process what they did
- Never suggest anything extreme, unsafe, or requiring purchases
- Do NOT repeat any of the recent tasks listed below

Respond in JSON format only:
{
  "task": "max 20 words, the specific daily mission",
  "sass": "max 25 words, the motivation message in the chosen tone",
  "reflectionQuestion": "max 20 words, a thoughtful reflection question"
}`;

  const userPrompt =
    recentTasks.length > 0
      ? `Generate a new daily mission. Avoid repeating these recent tasks:\n${recentTasks.map((t, i) => `${i + 1}. ${t}`).join("\n")}`
      : "Generate the user's first daily mission.";

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
    max_tokens: 300,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("OpenAI returned empty response");
  }

  const parsed = JSON.parse(content) as GeneratedMission;

  if (!parsed.task || !parsed.sass || !parsed.reflectionQuestion) {
    throw new Error("OpenAI response missing required fields");
  }

  return parsed;
}
