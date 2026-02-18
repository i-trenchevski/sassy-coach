import type { Goal, Tone } from "@sassy-coach/shared";

interface MockMissionTemplate {
  task: string;
  sass: Record<Tone, string>;
  reflectionQuestion: string;
}

export const missionPool: Record<Goal, MockMissionTemplate[]> = {
  fitness: [
    {
      task: "Do 20 push-ups before lunch",
      sass: {
        sassy: "Oh, you thought scrolling counted as exercise?",
        kind: "Your body will thank you for this!",
        "drill-sergeant": "Twenty push-ups. No breaks. GO.",
        zen: "Feel the strength flow through your arms.",
      },
      reflectionQuestion: "How did your body feel after?",
    },
    {
      task: "Take a 20-minute walk outside",
      sass: {
        sassy: "Your couch called. It says go away.",
        kind: "Fresh air does wonders. Enjoy every step!",
        "drill-sergeant": "Move those legs, soldier!",
        zen: "Let each step bring you closer to yourself.",
      },
      reflectionQuestion: "What did you notice on your walk?",
    },
    {
      task: "Stretch for 10 minutes before bed",
      sass: {
        sassy: "Your muscles are tighter than your schedule.",
        kind: "A gentle stretch is a gift to yourself.",
        "drill-sergeant": "Limber up! Flexibility is strength!",
        zen: "Release the tension your body has been holding.",
      },
      reflectionQuestion: "Which area felt the tightest?",
    },
    {
      task: "Drink 8 glasses of water today",
      sass: {
        sassy: "Coffee doesn't count. Neither does wine.",
        kind: "Hydration is self-care in its simplest form.",
        "drill-sergeant": "Hydrate or die-drate! Eight glasses!",
        zen: "Water is life. Honor your body with it.",
      },
      reflectionQuestion: "Did you notice a difference in energy?",
    },
    {
      task: "Do a 7-minute bodyweight workout",
      sass: {
        sassy: "Seven minutes. You spend longer choosing Netflix shows.",
        kind: "Just seven minutes can change your whole day!",
        "drill-sergeant": "Seven minutes of pure discipline. Begin!",
        zen: "A short practice is still a practice.",
      },
      reflectionQuestion: "What exercise was the hardest?",
    },
    {
      task: "Take the stairs instead of the elevator today",
      sass: {
        sassy: "The elevator is for people who gave up.",
        kind: "Every step up is a step toward your goals!",
        "drill-sergeant": "Stairs. Every. Single. Time.",
        zen: "Ascend with intention and presence.",
      },
      reflectionQuestion: "How many flights did you climb?",
    },
    {
      task: "Hold a plank for 60 seconds",
      sass: {
        sassy: "One minute. Your excuses last longer.",
        kind: "You're stronger than you think. Hold on!",
        "drill-sergeant": "Sixty seconds! Do NOT drop!",
        zen: "Find stillness in the challenge.",
      },
      reflectionQuestion: "Did you make it the full minute?",
    },
    {
      task: "Dance to your favorite song — full energy",
      sass: {
        sassy: "Nobody's watching. Go full embarrassing.",
        kind: "Let the music move you. Pure joy!",
        "drill-sergeant": "I said FULL energy! Give me everything!",
        zen: "Let your body express what words cannot.",
      },
      reflectionQuestion: "What song did you pick and why?",
    },
    {
      task: "Do 30 squats throughout the day",
      sass: {
        sassy: "Your legs have been on vacation. Time's up.",
        kind: "Thirty squats, spread out. You've got this!",
        "drill-sergeant": "Thirty squats! Break them up if you must!",
        zen: "Ground yourself with each repetition.",
      },
      reflectionQuestion: "How did you break them up?",
    },
    {
      task: "Try a new healthy recipe for one meal",
      sass: {
        sassy: "Microwave meals don't count, bestie.",
        kind: "Cooking is an act of love for yourself.",
        "drill-sergeant": "Fuel your body with real food!",
        zen: "Nourish your body as you would a garden.",
      },
      reflectionQuestion: "What did you make? Would you make it again?",
    },
  ],
  productivity: [
    {
      task: "Write down your top 3 priorities for today",
      sass: {
        sassy: "A to-do list in your head doesn't count.",
        kind: "Clarity is the first step to progress!",
        "drill-sergeant": "Three priorities. Paper. Now.",
        zen: "Intention precedes action.",
      },
      reflectionQuestion: "Did you complete all three?",
    },
    {
      task: "Work in a focused 25-minute Pomodoro session",
      sass: {
        sassy: "25 minutes without your phone. Radical, I know.",
        kind: "One focused burst can move mountains!",
        "drill-sergeant": "Twenty-five minutes. Zero distractions!",
        zen: "Immerse yourself fully in the present task.",
      },
      reflectionQuestion: "What did you accomplish in that session?",
    },
    {
      task: "Clear your email inbox to zero",
      sass: {
        sassy: "Those 347 unread emails aren't going to judge themselves.",
        kind: "A clean inbox is a peaceful mind.",
        "drill-sergeant": "Clear. That. Inbox. Now.",
        zen: "Release what no longer serves you.",
      },
      reflectionQuestion: "How does a clean inbox feel?",
    },
    {
      task: "Organize your workspace for 10 minutes",
      sass: {
        sassy: "Your desk looks like a crime scene. Fix it.",
        kind: "A tidy space creates a tidy mind!",
        "drill-sergeant": "Ten minutes. Everything in its place!",
        zen: "Create order in your outer world to calm the inner.",
      },
      reflectionQuestion: "What area needed the most attention?",
    },
    {
      task: "Say no to one non-essential request today",
      sass: {
        sassy: "Stop being a yes-machine. You're not a vending machine.",
        kind: "Saying no to others is saying yes to yourself.",
        "drill-sergeant": "Protect your time! Decline and stand firm!",
        zen: "Boundaries are a form of self-respect.",
      },
      reflectionQuestion: "What did you say no to? How did it feel?",
    },
    {
      task: "Plan tomorrow's schedule before bed tonight",
      sass: {
        sassy: "Winging it is not a strategy, babe.",
        kind: "Tomorrow-you will be so grateful for this!",
        "drill-sergeant": "Plan the day BEFORE it starts!",
        zen: "Prepare the path so you may walk it freely.",
      },
      reflectionQuestion: "What's your most important task for tomorrow?",
    },
    {
      task: "Turn off all notifications for 2 hours",
      sass: {
        sassy: "The world won't end. Your group chat can wait.",
        kind: "Give yourself the gift of uninterrupted focus.",
        "drill-sergeant": "Notifications OFF. Focus ON.",
        zen: "In silence, the mind finds its sharpest edge.",
      },
      reflectionQuestion: "What did you get done during that time?",
    },
    {
      task: "Finish a task you've been procrastinating on",
      sass: {
        sassy: "That thing you keep avoiding? Today it dies.",
        kind: "Facing the hard stuff first is so freeing!",
        "drill-sergeant": "No more excuses. Attack that task!",
        zen: "What we resist persists. Let it go by doing it.",
      },
      reflectionQuestion: "Why were you putting it off?",
    },
    {
      task: "Read for 20 minutes instead of scrolling",
      sass: {
        sassy: "Instagram reels are not personal development.",
        kind: "Twenty minutes of reading feeds your mind beautifully.",
        "drill-sergeant": "Read. Learn. Grow. Twenty minutes.",
        zen: "Let words on a page expand your world.",
      },
      reflectionQuestion: "What are you reading right now?",
    },
    {
      task: "Write a brief journal entry about your day",
      sass: {
        sassy: "Your thoughts deserve better than your Notes app.",
        kind: "Writing it down helps you understand yourself.",
        "drill-sergeant": "Document your progress, soldier!",
        zen: "Reflect on the river of your day as it flows past.",
      },
      reflectionQuestion: "What was the highlight of your day?",
    },
  ],
  language: [
    {
      task: "Learn 5 new words in your target language",
      sass: {
        sassy: "Five words. That's fewer than your coffee order.",
        kind: "Five new words today — that's 1,825 a year!",
        "drill-sergeant": "Five new words. Memorize them!",
        zen: "Each word is a door to a new understanding.",
      },
      reflectionQuestion: "Which word was the most interesting?",
    },
    {
      task: "Listen to a podcast in your target language for 10 min",
      sass: {
        sassy: "You won't understand all of it. That's the point.",
        kind: "Even passive listening builds your ear. Keep going!",
        "drill-sergeant": "Ten minutes of immersion. No subtitles!",
        zen: "Let the sounds wash over you like a gentle stream.",
      },
      reflectionQuestion: "How much did you understand?",
    },
    {
      task: "Write 3 sentences about your day in your target language",
      sass: {
        sassy: "Grammar mistakes are free. Go wild.",
        kind: "Writing cements what you've learned. Great practice!",
        "drill-sergeant": "Three sentences. Correct grammar. Go.",
        zen: "Express your truth in a new tongue.",
      },
      reflectionQuestion: "What was the hardest part to express?",
    },
    {
      task: "Change your phone language for the rest of the day",
      sass: {
        sassy: "Good luck finding your settings later.",
        kind: "Full immersion at your fingertips — literally!",
        "drill-sergeant": "Total immersion! Change it NOW!",
        zen: "Surround yourself with the language you wish to speak.",
      },
      reflectionQuestion: "What new words did you pick up?",
    },
    {
      task: "Watch a 5-minute YouTube video in your target language",
      sass: {
        sassy: "YouTube in another language still counts as productive.",
        kind: "Visual context helps so much with learning!",
        "drill-sergeant": "Five minutes. Full attention. Report back.",
        zen: "Watch, listen, and absorb without judgment.",
      },
      reflectionQuestion: "What was the video about?",
    },
    {
      task: "Practice pronunciation by reading a paragraph aloud",
      sass: {
        sassy: "Yes, out loud. Your cat doesn't judge.",
        kind: "Speaking out loud builds confidence. You sound great!",
        "drill-sergeant": "Read it LOUD and CLEAR!",
        zen: "Let the words shape themselves on your lips.",
      },
      reflectionQuestion: "Which sounds were trickiest?",
    },
    {
      task: "Label 5 objects in your room in your target language",
      sass: {
        sassy: "Sticky notes: the original augmented reality.",
        kind: "Making your space bilingual is so creative!",
        "drill-sergeant": "Label everything! Visual drill!",
        zen: "See the familiar through new eyes.",
      },
      reflectionQuestion: "Which objects did you choose?",
    },
    {
      task: "Think in your target language for 5 minutes",
      sass: {
        sassy: "Your brain will resist. Do it anyway.",
        kind: "Thinking in another language rewires your brain!",
        "drill-sergeant": "Five minutes. Internal monologue. Target language only.",
        zen: "Observe your thoughts transform as language shifts.",
      },
      reflectionQuestion: "What did you find yourself thinking about?",
    },
    {
      task: "Translate a song you like into your target language",
      sass: {
        sassy: "Bet you didn't know those lyrics were that deep.",
        kind: "Music and language together — what a combo!",
        "drill-sergeant": "Full translation! Line by line!",
        zen: "Music transcends borders. Let it carry your learning.",
      },
      reflectionQuestion: "What song did you choose?",
    },
    {
      task: "Have a 2-minute conversation (real or imaginary)",
      sass: {
        sassy: "Talking to yourself in two languages is a flex.",
        kind: "Even imaginary conversations build real skills!",
        "drill-sergeant": "Two minutes of conversation. No English!",
        zen: "Language lives in the space between people.",
      },
      reflectionQuestion: "What was the conversation about?",
    },
  ],
  "job-search": [
    {
      task: "Update one section of your resume today",
      sass: {
        sassy: "That resume from 2019 isn't doing you any favors.",
        kind: "Small updates add up to a polished resume!",
        "drill-sergeant": "One section. Updated. Polished. Done.",
        zen: "Present your journey with clarity and truth.",
      },
      reflectionQuestion: "Which section did you improve?",
    },
    {
      task: "Apply to one job that genuinely excites you",
      sass: {
        sassy: "One application. Not bookmarking — applying.",
        kind: "You deserve a job that lights you up!",
        "drill-sergeant": "One application. Submitted. Today.",
        zen: "Take one step toward the work that calls to you.",
      },
      reflectionQuestion: "What about the role excited you?",
    },
    {
      task: "Connect with one person on LinkedIn with a real message",
      sass: {
        sassy: "Generic 'I'd like to add you' doesn't count.",
        kind: "Genuine connections open unexpected doors!",
        "drill-sergeant": "One connection. Personal message. Send it.",
        zen: "Every meaningful connection begins with a single reach.",
      },
      reflectionQuestion: "Who did you reach out to and why?",
    },
    {
      task: "Practice answering 'Tell me about yourself' out loud",
      sass: {
        sassy: "If you can't explain you, who can?",
        kind: "Practice makes this feel so much more natural!",
        "drill-sergeant": "Sixty seconds. Clear. Confident. Go.",
        zen: "Know yourself deeply so you may share freely.",
      },
      reflectionQuestion: "How confident did you feel?",
    },
    {
      task: "Research one company you'd love to work for",
      sass: {
        sassy: "Stalking their careers page counts as research.",
        kind: "Knowledge about a company shows genuine interest!",
        "drill-sergeant": "Full intel. Mission. Values. Culture.",
        zen: "Understanding others begins with curiosity.",
      },
      reflectionQuestion: "What did you learn about them?",
    },
    {
      task: "Write a personalized cover letter for a role",
      sass: {
        sassy: "Dear Hiring Manager is not personalized.",
        kind: "A thoughtful cover letter really stands out!",
        "drill-sergeant": "Custom letter. No templates. Make it count.",
        zen: "Let your words reflect your authentic intention.",
      },
      reflectionQuestion: "What made this letter personal?",
    },
    {
      task: "Clean up your LinkedIn profile photo and headline",
      sass: {
        sassy: "That beach selfie from 2017 isn't it, babe.",
        kind: "First impressions matter — make yours shine!",
        "drill-sergeant": "Professional photo. Strong headline. Now.",
        zen: "Present yourself as you wish to be seen.",
      },
      reflectionQuestion: "What headline did you choose?",
    },
    {
      task: "Prepare 3 questions to ask in your next interview",
      sass: {
        sassy: "No, 'What's the salary?' shouldn't be first.",
        kind: "Great questions show you've done your homework!",
        "drill-sergeant": "Three smart questions. Write them down.",
        zen: "The quality of your questions reveals the depth of your interest.",
      },
      reflectionQuestion: "What questions did you prepare?",
    },
    {
      task: "Ask someone to review your resume and give feedback",
      sass: {
        sassy: "Your mom saying 'it's great, honey' doesn't count.",
        kind: "Fresh eyes catch things we miss. So valuable!",
        "drill-sergeant": "Get feedback from a professional. Today.",
        zen: "Welcome outside perspectives as gifts.",
      },
      reflectionQuestion: "What feedback did you receive?",
    },
    {
      task: "Set up a job alert for your dream role",
      sass: {
        sassy: "Let the jobs come to you. Work smarter.",
        kind: "Automating your search saves so much energy!",
        "drill-sergeant": "Alerts configured. Stay on target.",
        zen: "Set your intention and let opportunity find you.",
      },
      reflectionQuestion: "What keywords did you use?",
    },
  ],
  custom: [
    {
      task: "Spend 15 minutes working on your personal goal",
      sass: {
        sassy: "Fifteen minutes. You spend longer on TikTok.",
        kind: "Even small steps create big progress!",
        "drill-sergeant": "Fifteen minutes of pure focus. Execute!",
        zen: "A few mindful minutes can move mountains.",
      },
      reflectionQuestion: "What progress did you make?",
    },
    {
      task: "Write down why your goal matters to you",
      sass: {
        sassy: "If you can't explain it, do you even want it?",
        kind: "Connecting with your 'why' fuels motivation!",
        "drill-sergeant": "Write it down. Know your mission.",
        zen: "Purpose gives direction to effort.",
      },
      reflectionQuestion: "What did you realize about your motivation?",
    },
    {
      task: "Remove one distraction from your environment",
      sass: {
        sassy: "That phone on your desk? Yeah, that one.",
        kind: "Creating space for focus is an act of self-care.",
        "drill-sergeant": "Identify the distraction. Eliminate it.",
        zen: "Clear the outer clutter to calm the inner mind.",
      },
      reflectionQuestion: "What did you remove?",
    },
    {
      task: "Tell someone about your goal today",
      sass: {
        sassy: "Accountability is free. Use it.",
        kind: "Sharing your goals makes them feel more real!",
        "drill-sergeant": "Tell someone. Make it public. No backing out.",
        zen: "Speaking your truth gives it power.",
      },
      reflectionQuestion: "Who did you tell? How did they respond?",
    },
    {
      task: "Spend 10 minutes learning something new about your goal",
      sass: {
        sassy: "Google is free. Ignorance is a choice.",
        kind: "Learning keeps your journey fresh and exciting!",
        "drill-sergeant": "Research. Learn. Apply. Ten minutes.",
        zen: "Knowledge waters the seeds of growth.",
      },
      reflectionQuestion: "What did you learn?",
    },
    {
      task: "Visualize yourself achieving your goal for 5 minutes",
      sass: {
        sassy: "Manifesting without action is just daydreaming. But start here.",
        kind: "Visualization primes your brain for success!",
        "drill-sergeant": "See it. Believe it. Then make it happen.",
        zen: "The mind creates what the heart imagines.",
      },
      reflectionQuestion: "What did you see in your visualization?",
    },
    {
      task: "Break your goal into 3 smaller sub-goals",
      sass: {
        sassy: "Big vague goals are just wishes. Break it down.",
        kind: "Smaller goals are easier to celebrate!",
        "drill-sergeant": "Three sub-objectives. Clear and measurable.",
        zen: "The whole is understood through its parts.",
      },
      reflectionQuestion: "What are your three sub-goals?",
    },
    {
      task: "Do one small uncomfortable thing related to your goal",
      sass: {
        sassy: "Growth lives outside your comfort zone. Visit it.",
        kind: "Discomfort means you're growing. That's beautiful!",
        "drill-sergeant": "Comfort is the enemy. Push through.",
        zen: "The lotus grows through mud to reach the light.",
      },
      reflectionQuestion: "What did you do and how did it feel?",
    },
    {
      task: "Find one person who has achieved your goal and study them",
      sass: {
        sassy: "Copy their strategy, not their Instagram.",
        kind: "Learning from others' journeys is so inspiring!",
        "drill-sergeant": "Find a role model. Study their method.",
        zen: "Those who came before light the path ahead.",
      },
      reflectionQuestion: "What can you learn from their approach?",
    },
    {
      task: "Celebrate one small win you had this week",
      sass: {
        sassy: "You did something right. Shocking, I know. Celebrate it.",
        kind: "Every win deserves recognition. You're doing great!",
        "drill-sergeant": "Acknowledge progress. Then keep pushing.",
        zen: "Gratitude for small victories nourishes the spirit.",
      },
      reflectionQuestion: "What win are you celebrating?",
    },
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
