/**
 * Seed the mission pool with AI-generated missions.
 *
 * Usage: npx tsx src/scripts/seedPool.ts
 *
 * Generates missions for each goal/tone combo and inserts them into the mission_pool table.
 * Safe to run multiple times — it appends new missions to the pool.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import type { Goal, Tone } from "@sassy-coach/shared";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const GOALS: Goal[] = [
  "fitness",
  "productivity",
  "language",
  "job-search",
  "custom",
];
const TONES: Tone[] = ["sassy", "kind", "drill-sergeant", "zen"];

const MISSIONS_PER_COMBO = 10;

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

async function generateBatch(
  goal: Goal,
  tone: Tone,
  count: number
): Promise<Array<{ task: string; sass: string; reflectionQuestion: string }>> {
  const systemPrompt = `You are Sassy Coach, a daily accountability coach.
Generate ${count} unique daily missions as a JSON array.

Your personality is: ${TONE_DESCRIPTIONS[tone]}
Goal area: ${GOAL_DESCRIPTIONS[goal]}

Rules:
- Each task must be completable in under 30 minutes
- Each task must be specific and concrete (not vague)
- The sass/motivation message should be 1-2 sentences in the ${tone} tone
- The reflection question should be thoughtful
- Never suggest anything extreme, unsafe, or requiring purchases
- All ${count} missions must be DIFFERENT from each other

Respond with a JSON object:
{
  "missions": [
    {
      "task": "max 20 words",
      "sass": "max 25 words in ${tone} tone",
      "reflectionQuestion": "max 20 words"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate ${count} unique daily missions for the "${goal}" goal in the "${tone}" tone.`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.95,
    max_tokens: 2000,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Empty OpenAI response");

  const parsed = JSON.parse(content);
  return parsed.missions;
}

async function main() {
  console.log("Seeding mission pool...\n");

  let totalInserted = 0;

  for (const goal of GOALS) {
    for (const tone of TONES) {
      // Check how many already exist
      const { count } = await supabase
        .from("mission_pool")
        .select("*", { count: "exact", head: true })
        .eq("goal", goal)
        .eq("tone", tone);

      const existing = count ?? 0;
      const needed = MISSIONS_PER_COMBO - existing;

      if (needed <= 0) {
        console.log(
          `  ${goal}/${tone}: already has ${existing} missions, skipping`
        );
        continue;
      }

      console.log(
        `  ${goal}/${tone}: has ${existing}, generating ${needed} more...`
      );

      try {
        const missions = await generateBatch(goal, tone, needed);

        const rows = missions.map((m) => ({
          goal,
          tone,
          task: m.task,
          sass: m.sass,
          reflection_question: m.reflectionQuestion,
        }));

        const { error } = await supabase.from("mission_pool").insert(rows);

        if (error) {
          console.error(`    Error inserting ${goal}/${tone}:`, error.message);
        } else {
          totalInserted += rows.length;
          console.log(`    Inserted ${rows.length} missions`);
        }
      } catch (err) {
        console.error(
          `    Failed to generate ${goal}/${tone}:`,
          err instanceof Error ? err.message : err
        );
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`\nDone! Inserted ${totalInserted} new missions into the pool.`);
}

main().catch(console.error);
