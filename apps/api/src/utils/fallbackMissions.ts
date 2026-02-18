import type { Goal, Tone } from "@sassy-coach/shared";

interface MockMissionTemplate {
  task: string;
  sass: Record<Tone, string>;
  reflectionQuestion: string;
}

const missionPool: Record<Goal, MockMissionTemplate[]> = {
  fitness: [
    { task: "Do 20 push-ups before lunch", sass: { sassy: "Oh, you thought scrolling counted as exercise?", kind: "Your body will thank you for this!", "drill-sergeant": "Twenty push-ups. No breaks. GO.", zen: "Feel the strength flow through your arms." }, reflectionQuestion: "How did your body feel after?" },
    { task: "Take a 20-minute walk outside", sass: { sassy: "Your couch called. It says go away.", kind: "Fresh air does wonders. Enjoy every step!", "drill-sergeant": "Move those legs, soldier!", zen: "Let each step bring you closer to yourself." }, reflectionQuestion: "What did you notice on your walk?" },
    { task: "Stretch for 10 minutes before bed", sass: { sassy: "Your muscles are tighter than your schedule.", kind: "A gentle stretch is a gift to yourself.", "drill-sergeant": "Limber up! Flexibility is strength!", zen: "Release the tension your body has been holding." }, reflectionQuestion: "Which area felt the tightest?" },
    { task: "Drink 8 glasses of water today", sass: { sassy: "Coffee doesn't count. Neither does wine.", kind: "Hydration is self-care in its simplest form.", "drill-sergeant": "Hydrate or die-drate! Eight glasses!", zen: "Water is life. Honor your body with it." }, reflectionQuestion: "Did you notice a difference in energy?" },
    { task: "Do a 7-minute bodyweight workout", sass: { sassy: "Seven minutes. You spend longer choosing Netflix shows.", kind: "Just seven minutes can change your whole day!", "drill-sergeant": "Seven minutes of pure discipline. Begin!", zen: "A short practice is still a practice." }, reflectionQuestion: "What exercise was the hardest?" },
  ],
  productivity: [
    { task: "Write down your top 3 priorities for today", sass: { sassy: "A to-do list in your head doesn't count.", kind: "Clarity is the first step to progress!", "drill-sergeant": "Three priorities. Paper. Now.", zen: "Intention precedes action." }, reflectionQuestion: "Did you complete all three?" },
    { task: "Work in a focused 25-minute Pomodoro session", sass: { sassy: "25 minutes without your phone. Radical, I know.", kind: "One focused burst can move mountains!", "drill-sergeant": "Twenty-five minutes. Zero distractions!", zen: "Immerse yourself fully in the present task." }, reflectionQuestion: "What did you accomplish in that session?" },
    { task: "Finish a task you've been procrastinating on", sass: { sassy: "That thing you keep avoiding? Today it dies.", kind: "Facing the hard stuff first is so freeing!", "drill-sergeant": "No more excuses. Attack that task!", zen: "What we resist persists. Let it go by doing it." }, reflectionQuestion: "Why were you putting it off?" },
    { task: "Turn off all notifications for 2 hours", sass: { sassy: "The world won't end. Your group chat can wait.", kind: "Give yourself the gift of uninterrupted focus.", "drill-sergeant": "Notifications OFF. Focus ON.", zen: "In silence, the mind finds its sharpest edge." }, reflectionQuestion: "What did you get done during that time?" },
    { task: "Read for 20 minutes instead of scrolling", sass: { sassy: "Instagram reels are not personal development.", kind: "Twenty minutes of reading feeds your mind beautifully.", "drill-sergeant": "Read. Learn. Grow. Twenty minutes.", zen: "Let words on a page expand your world." }, reflectionQuestion: "What are you reading right now?" },
  ],
  language: [
    { task: "Learn 5 new words in your target language", sass: { sassy: "Five words. That's fewer than your coffee order.", kind: "Five new words today — that's 1,825 a year!", "drill-sergeant": "Five new words. Memorize them!", zen: "Each word is a door to a new understanding." }, reflectionQuestion: "Which word was the most interesting?" },
    { task: "Listen to a podcast in your target language for 10 min", sass: { sassy: "You won't understand all of it. That's the point.", kind: "Even passive listening builds your ear. Keep going!", "drill-sergeant": "Ten minutes of immersion. No subtitles!", zen: "Let the sounds wash over you like a gentle stream." }, reflectionQuestion: "How much did you understand?" },
    { task: "Write 3 sentences about your day in your target language", sass: { sassy: "Grammar mistakes are free. Go wild.", kind: "Writing cements what you've learned. Great practice!", "drill-sergeant": "Three sentences. Correct grammar. Go.", zen: "Express your truth in a new tongue." }, reflectionQuestion: "What was the hardest part to express?" },
    { task: "Practice pronunciation by reading a paragraph aloud", sass: { sassy: "Yes, out loud. Your cat doesn't judge.", kind: "Speaking out loud builds confidence. You sound great!", "drill-sergeant": "Read it LOUD and CLEAR!", zen: "Let the words shape themselves on your lips." }, reflectionQuestion: "Which sounds were trickiest?" },
    { task: "Think in your target language for 5 minutes", sass: { sassy: "Your brain will resist. Do it anyway.", kind: "Thinking in another language rewires your brain!", "drill-sergeant": "Five minutes. Internal monologue. Target language only.", zen: "Observe your thoughts transform as language shifts." }, reflectionQuestion: "What did you find yourself thinking about?" },
  ],
  "job-search": [
    { task: "Update one section of your resume today", sass: { sassy: "That resume from 2019 isn't doing you any favors.", kind: "Small updates add up to a polished resume!", "drill-sergeant": "One section. Updated. Polished. Done.", zen: "Present your journey with clarity and truth." }, reflectionQuestion: "Which section did you improve?" },
    { task: "Apply to one job that genuinely excites you", sass: { sassy: "One application. Not bookmarking — applying.", kind: "You deserve a job that lights you up!", "drill-sergeant": "One application. Submitted. Today.", zen: "Take one step toward the work that calls to you." }, reflectionQuestion: "What about the role excited you?" },
    { task: "Connect with one person on LinkedIn with a real message", sass: { sassy: "Generic 'I'd like to add you' doesn't count.", kind: "Genuine connections open unexpected doors!", "drill-sergeant": "One connection. Personal message. Send it.", zen: "Every meaningful connection begins with a single reach." }, reflectionQuestion: "Who did you reach out to and why?" },
    { task: "Practice answering 'Tell me about yourself' out loud", sass: { sassy: "If you can't explain you, who can?", kind: "Practice makes this feel so much more natural!", "drill-sergeant": "Sixty seconds. Clear. Confident. Go.", zen: "Know yourself deeply so you may share freely." }, reflectionQuestion: "How confident did you feel?" },
    { task: "Research one company you'd love to work for", sass: { sassy: "Stalking their careers page counts as research.", kind: "Knowledge about a company shows genuine interest!", "drill-sergeant": "Full intel. Mission. Values. Culture.", zen: "Understanding others begins with curiosity." }, reflectionQuestion: "What did you learn about them?" },
  ],
  custom: [
    { task: "Spend 15 minutes working on your personal goal", sass: { sassy: "Fifteen minutes. You spend longer on TikTok.", kind: "Even small steps create big progress!", "drill-sergeant": "Fifteen minutes of pure focus. Execute!", zen: "A few mindful minutes can move mountains." }, reflectionQuestion: "What progress did you make?" },
    { task: "Write down why your goal matters to you", sass: { sassy: "If you can't explain it, do you even want it?", kind: "Connecting with your 'why' fuels motivation!", "drill-sergeant": "Write it down. Know your mission.", zen: "Purpose gives direction to effort." }, reflectionQuestion: "What did you realize about your motivation?" },
    { task: "Remove one distraction from your environment", sass: { sassy: "That phone on your desk? Yeah, that one.", kind: "Creating space for focus is an act of self-care.", "drill-sergeant": "Identify the distraction. Eliminate it.", zen: "Clear the outer clutter to calm the inner mind." }, reflectionQuestion: "What did you remove?" },
    { task: "Do one small uncomfortable thing related to your goal", sass: { sassy: "Growth lives outside your comfort zone. Visit it.", kind: "Discomfort means you're growing. That's beautiful!", "drill-sergeant": "Comfort is the enemy. Push through.", zen: "The lotus grows through mud to reach the light." }, reflectionQuestion: "What did you do and how did it feel?" },
    { task: "Celebrate one small win you had this week", sass: { sassy: "You did something right. Shocking, I know. Celebrate it.", kind: "Every win deserves recognition. You're doing great!", "drill-sergeant": "Acknowledge progress. Then keep pushing.", zen: "Gratitude for small victories nourishes the spirit." }, reflectionQuestion: "What win are you celebrating?" },
  ],
};

export function pickMission(
  goal: Goal,
  recentMissionTasks: string[]
): MockMissionTemplate {
  const pool = missionPool[goal];
  const available = pool.filter((m) => !recentMissionTasks.includes(m.task));
  const source = available.length > 0 ? available : pool;
  return source[Math.floor(Math.random() * source.length)];
}
