import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI if real key is present
const rawApiKey = process.env.GEMINI_API_KEY || '';
const isValidKey = rawApiKey && !rawApiKey.startsWith('MY_') && rawApiKey.trim().length > 10;
let genAI: GoogleGenAI | null = null;
if (isValidKey) {
  try {
    genAI = new GoogleGenAI({ apiKey: rawApiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// In-memory community impact data with persistent increments
let communityStats = {
  mealsServed: 14890,
  collegeYouthSupported: 342,
  homeworkSolved: 52180,
  communitiesReached: 31,
  offlinePacksDownloaded: 8460,
  adSponsoredMeals: 2150,
};

// API route for chat with Sir Lax
app.post('/api/chat', async (req, res) => {
  try {
    const { message, mode, gradeLevel, language, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Increment solved questions counter
    communityStats.homeworkSolved += 1;

    const languageInstruction =
      language === 'filipino'
        ? 'Speak in warm, encouraging Filipino / Taglish that is super friendly and very easy to follow.'
        : language === 'bilingual'
        ? 'Provide the primary explanation in very simple English, with helpful Filipino translations in parentheses or bullets for key words.'
        : 'Speak in ultra-simple, basic English suitable for young learners or Grade 1 non-English speakers.';

    const modeInstruction =
      mode === 'diy'
        ? 'Focus on DIY home or school projects. Break into: 1) What we are making, 2) Safe recycled/cheap materials you can find at home, 3) Step-by-step easy numbered instructions with emojis, 4) Safety tip.'
        : mode === 'math'
        ? 'Teach math step-by-step with real-life visual analogies like counting mangoes, apples, candies, or coins. Avoid scary jargon.'
        : mode === 'interactive'
        ? 'Ask an engaging mini-question or game at the end to check their understanding! Keep it fun and rewarding.'
        : mode === 'practical'
        ? 'Focus on practical real-world skills: everyday money budgeting, cooking cheap healthy meals, government IDs, basic home fixes, job preparation, and daily life wisdom with practical steps.'
        : mode === 'college'
        ? 'Support senior high and college youth: thesis guidance, exam survival on a budget, dorm life, scholarship applications, and career encouragement.'
        : mode === 'academics' || mode === 'homework'
        ? 'Help with school academic subjects: science, math, history, grammar, reading comprehension, and homework breakdown with clear explanations.'
        : 'UNIVERSAL "UNDER THE SUN" MODE: Provide limitless knowledge on ANY possible question (like ChatGPT & Dola AI), BUT ALWAYS EXPLAIN IN VERY SIMPLE, CRYSTAL-CLEAR, AND UNDERSTANDABLE LANGUAGE! Break down complex topics (quantum physics, artificial intelligence, space, coding, biology, economics, philosophy) using friendly, everyday real-world analogies (e.g., comparing atoms to LEGO blocks, computer memory to sticky notes, gravity to a bowling ball on a mattress, cells to busy kitchens). Avoid scary academic jargon. If a technical term is necessary, immediately explain it in plain words in parentheses. Make it so easy and fascinating that any child or student understands!';

    const systemPrompt = `You are "Sir Lax", a brilliant, beloved, deeply caring Filipino educator and universal AI with the full conversational power and limitless versatility of ChatGPT and Dola AI, infused with the heart of a dedicated community teacher.
Your golden motto is: "EDUCATION IS THE KEY FOR CHANGE!"
You are an all-in-one universal AI with ONE ABSOLUTE PEDAGOGICAL RULE: ALWAYS ANSWER IN VERY SIMPLE, PLAIN, AND UNDERSTANDABLE LANGUAGE.

1. UNIVERSAL INTELLIGENCE & REASONING (Like ChatGPT, in Simple Words):
   - Answer ANY question under the sun: science, space, cosmology, quantum physics, philosophy, history, geography.
   - Creative Writing & Drafting: Write compelling essays, speeches, poems, stories, debate arguments, and official letters in clear, natural language.
   - Coding & Tech: Write and debug code (Python, JavaScript, HTML, CSS), explain algorithms and internet tech in simple, friendly steps.
   - Advanced Math & Problem Solving: Step-by-step arithmetic, algebra, calculus, statistics, geometry with visual analogies (mangoes, coins, pizza slices).
   - Language & Translation: Translate fluently between English, Tagalog, and local dialects; polish grammar, vocabulary, and polite tone.
2. EVERYDAY ASSISTANT & PRODUCTIVITY (Like Dola AI, in Simple Steps):
   - Study Planning & Time Management: Build daily study schedules, exam prep timetables, dorm routines, and break down big projects into easy bite-sized steps.
   - Practical Life Skills: Budgeting allowance, 3-envelope rule, tipid recipes, household fixes, electric safety, government IDs, scholarship applications, and job interviews.
   - Motivation & Empathy: Support students feeling anxious, overwhelmed, or hopeless with compassionate encouragement.

Guiding Rules:
1. SIMPLICITY FIRST (The Sir Lax Golden Rule): Always answer in VERY SIMPLE, PLAIN, AND UNDERSTANDABLE LANGUAGE. Strictly avoid scary academic jargon, convoluted sentences, or dense textbooks. If a big technical word is mentioned, immediately decode it in plain words in parentheses. Use intuitive real-world analogies (LEGO blocks, bicycles, cooking, mangoes).
2. Tone: Deeply caring, enthusiastic, intellectually brilliant yet warm, fatherly/older brother ("Kuya Sir"). Praise curiosity ("Napakagandang tanong niyan!", "Super proud of your curiosity!").
3. Adaptability: Adjust depth based on Grade Level context: ${gradeLevel || 'Grade 1-3'}. Even for college level, prioritize crystal-clear explanations over convoluted jargon.
4. ${languageInstruction}
5. ${modeInstruction}
6. Formatting: Use short paragraphs (1-3 sentences max), bullet points, bold keywords, code blocks when coding, and friendly emojis (🌟, ☀️, 💡, 🧠, 🚀, 💻, 📅, ✍️, 👏, 🇵🇭). Keep explanations visually clean and easy to scan.
7. Never make the student feel slow or ashamed. Treat every question under the sun as valuable and worth exploring.
8. If the question is about food or hunger, acknowledge it warmly with hope and remind them about the community feeding centers.`;

    if (genAI) {
      try {
        // Format previous turns if any (up to 10 recent messages for deep ChatGPT-style context)
        const contents: any[] = [];
        if (Array.isArray(history) && history.length > 0) {
          const recent = history.slice(-10);
          for (const item of recent) {
            contents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const apiPromise = genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 15000)
        );

        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        const reply = response.text || 'I hear you, my student! Let us take it one step at a time.';
        return res.json({ reply, source: 'ai' });
      } catch (geminiError: any) {
        console.warn('Gemini API fallback to smart local tutor:', geminiError?.message || geminiError);
      }
    }

    // Fallback smart offline-style response if API key is absent or offline
    const fallbackReply = generateSmartFallbackReply(message, mode, gradeLevel, language);
    return res.json({ reply: fallbackReply, source: 'offline-engine' });
  } catch (error: any) {
    console.error('Error handling /api/chat:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Community impact API
app.get('/api/impact', (_req, res) => {
  res.json({
    success: true,
    stats: communityStats,
    recentDrives: [
      {
        id: '1',
        title: 'Barangay San Roque Children & Youth Feeding Drive',
        date: 'Recent Outreach',
        meals: 350,
        collegeYouthAssisted: 45,
        location: 'Community Covered Court',
        highlight: 'Hot chicken arroz caldo with eggs, free school notebooks, and 2-hour free math tutoring.',
      },
      {
        id: '2',
        title: 'College Dreamers Study Pantry & Midnight Snacks',
        date: 'Last Weekend',
        meals: 180,
        collegeYouthAssisted: 85,
        location: 'State University Dormitory Hub',
        highlight: 'Nutritious meals & printable formula sheets for working students during midterm exams.',
      },
      {
        id: '3',
        title: 'Riverside Elementary DIY Science & Recycled Art Workshop',
        date: 'Two Weeks Ago',
        meals: 220,
        collegeYouthAssisted: 30,
        location: 'Sitio Riverside Chapel Hall',
        highlight: 'Built 80 homemade bottle-sprinklers and solar oven prototypes using recycled cardboard boxes.',
      },
    ],
  });
});

// Sponsor meal or watch ad unit to feed a student
app.post('/api/support-meal', (req, res) => {
  const { type, count = 1, donorName } = req.body;
  communityStats.mealsServed += Number(count) || 1;
  if (type === 'ad-watch') {
    communityStats.adSponsoredMeals += 1;
  }
  res.json({
    success: true,
    message: `Salamat! You provided ${count} hot, healthy meal(s) for a student!`,
    stats: communityStats,
    donor: donorName || 'Kind Community Supporter',
  });
});

// Smart rules-based fallback for 100% offline and low-bandwidth resilience
function generateSmartFallbackReply(query: string, mode: string, _gradeLevel: string, language: string): string {
  const q = query.toLowerCase();
  const isTagalog = language === 'filipino';

  if (q.includes('photo') || q.includes('photosynthesis') || q.includes('plant')) {
    if (isTagalog) {
      return `🌟 **Hello anak! Sagutin natin ito nang napakadali!**\n\nAng **Photosynthesis** ay kung paano nagluluto ng sariling pagkain ang mga halaman (plants)!\n\n1. ☀️ **Araw (Sunlight):** Ito ang apoy o init.\n2. 💧 **Tubig (Water):** Iniinom ng ugat sa lupa.\n3. 🌬️ **Hangin (Air / CO2):** Hinihinga ng mga dahon.\n\n✨ **Resulta:** Nakakagawa sila ng matamis na pagkain (asukal) at naglalabas ng sariwang **Oxygen** na hinihinga natin! Ang galing, 'di ba? 🌿`;
    }
    return `🌟 **Hello my dear student! Let us learn this easily!**\n\n**Photosynthesis** is simply how plants make their own food! 🌿\n\nThink of it like a plant cooking in its kitchen:\n1. ☀️ **Sunlight:** Like the stove heat.\n2. 💧 **Water:** Sucked up by roots from the soil.\n3. 🌬️ **Air:** Leaves breathe in fresh air.\n\n✨ **Result:** The plant makes sweet food (sugar) to grow big, and gives us fresh **Oxygen** to breathe! High five! 👏`;
  }

  // Sky is blue / Anything under the sun curiosity
  if (q.includes('sky') && (q.includes('blue') || q.includes('kulay'))) {
    return `☀️ **Why is the Sky Blue? (Bakit Asul ang Langit?)**\n\nImagine sunlight is a basket of rainbow candies (red, orange, yellow, green, blue, violet)! 🌈\n\n1. ☀️ **Sunlight travels down:** When sunlight hits the air around Earth, it crashes into billions of tiny gas particles.\n2. 🔵 **Blue light dances wildly:** Blue light travels in tiny, short, energetic waves, so it bounces around in all directions across the atmosphere (Rayleigh scattering).\n3. 👀 **What our eyes see:** Whichever way you look up, those bouncing blue rays enter your eyes!\n\n✨ At sunset, the sun is farther away, so the blue has bounced away and only the long red/orange rays reach you! Isn't nature wondrous? 🌍✨`;
  }

  // Airplanes flying / How planes fly
  if (q.includes('plane') || q.includes('airplane') || q.includes('lipad') || q.includes('fly')) {
    return `✈️ **How Heavy Airplanes Fly in the Sky!**\n\nEven though planes weigh tons of metal, they soar like giant birds! Here is the magic of **Lift**: 🌬️\n\n1. 🦅 **Curved Wings (Airfoil):** Airplane wings are curved on top and flat at the bottom.\n2. 💨 **Fast Air Over the Top:** Air rushes faster over the curved top, creating lower pressure (suction) above the wing.\n3. 🚀 **Giant Push Up (Lift):** The higher pressure underneath pushes the airplane up into the sky!\n4. 🏎️ **Engines push forward (Thrust):** Powerful engines push it forward fast enough so the wings keep lifting!\n\n✨ Never stop being curious! Maybe one day you will design the airplanes of the future! 🇵🇭🌟`;
  }

  // Practical World: Budgeting allowance / tipid tips
  if (q.includes('budget') || q.includes('allowance') || q.includes('baon') || q.includes('ipon') || q.includes('save money') || mode === 'practical') {
    return `💰 **Kuya Sir Lax’s 3-Envelope Baon & Savings Rule!**\n\nManaging your allowance is a superpower that will change your life! 🇵🇭\n\n🪙 **Divide your daily money into 3 parts:**\n1. 🚌 **Envelope 1: Needs (60%)** -> Fares (pamasahe) and school lunch/snack.\n2. 💡 **Envelope 2: Emergency & Study (20%)** -> Photocopier, printouts, or unexpected pencil.\n3. 🐷 **Envelope 3: Piggy Bank / Ipon (20%)** -> Even ₱5 or ₱10 a day! Never touch this.\n\n✨ **Tipid Tip:** Bring your own water tumbler from home! Buying bottled water wastes ₱20 every day—that's ₱400 saved a month! You are becoming financially wise! 👏`;
  }

  // Cooking cheap nutritious food
  if (q.includes('cook') || q.includes('meal') || q.includes('ulam') || q.includes('luto') || q.includes('egg')) {
    return `🍳 **Sir Lax's ₱25 Nutritious Tipid Meal: "Super Egg Tortang Malunggay"!**\n\nHealthy food doesn't have to be expensive!\n\n🥣 **Ingredients:**\n- 1 egg (₱8 to ₱10)\n- 1 handful of fresh Malunggay (moringa) leaves (free from the neighborhood tree!)\n- A pinch of salt and drop of oil\n- 1 cup of hot steaming rice\n\n📝 **3-Minute Recipe:**\n1. Beat the egg in a cup with a fork until bubbly.\n2. Wash the malunggay leaves and mix them straight into the beaten egg with a tiny pinch of salt.\n3. Fry in a hot pan for 1 minute on each side until golden.\n\n✨ **Why it's amazing:** Packed with protein, iron, calcium, and vitamins A & C to power your brain for studying! 🧠💪`;
  }

  // Internet & How Wi-Fi works
  if (q.includes('internet') || q.includes('wifi') || q.includes('computer')) {
    return `🌐 **How Does the Internet Actually Reach You?**\n\nMany think the internet floats in space, but it is actually under the sea!\n\n1. 🌊 **Submarine Fiber Cables:** Giant glass cables as thick as a garden hose run along the ocean floor connecting countries.\n2. ⚡ **Speed of Light:** Information (like your chat message) is converted into pulses of light and travels through glass fibers at 300,000 km per second!\n3. 📡 **Local Towers & Wi-Fi:** Cell towers and Wi-Fi boxes convert light signals into invisible radio waves that your phone catches.\n\n✨ That means when you study today, you are connected to the collective knowledge of all humanity! Use that power for good! 💡🌟`;
  }

  if (q.includes('add') || q.includes('plus') || q.includes('+') || q.includes('math') || mode === 'math') {
    return `🍎 **Math is Fun and Easy with Sir Lax!**\n\nLet's count together step-by-step:\n- Imagine you have **3 juicy red apples** in your left hand 🍎🍎🍎.\n- Your classmate gives you **2 more sweet apples** in your right hand 🍎🍎.\n\n👉 Let us count all together: 1, 2, 3... 4, 5!\n✨ **Answer:** 3 + 2 = **5 apples!**\n\nRemember: You are doing great! Kaya mo yan! 🌟`;
  }

  if (mode === 'diy' || q.includes('project') || q.includes('diy') || q.includes('experiment')) {
    return `🛠️ **DIY School Project by Sir Lax: Recycled Bottle Desk Organizer!**\n\n*Zero cost, made from recycled trash!*\n\n📦 **Materials:**\n- 1 empty clean plastic soda or juice bottle\n- Safety scissors (ask an adult for help!)\n- Colored paper, wrappers, or crayons to decorate\n\n📝 **Easy Steps:**\n1. Wash and dry your plastic bottle.\n2. Carefully cut off the top neck (keep the bottom half as a tall cup).\n3. Wrap the edge with tape or paper so it is smooth and safe.\n4. Draw your favorite cartoon or write **"Study Hard!"** on it!\n\n✨ Now you have a wonderful holder for your pens and pencils! Proud of your creativity! ✏️🎨`;
  }

  return `🌟 **Hi! Kuya Sir Lax is here to help you!**\n\nI love your question: "*${query}*". You can ask me **anything under the sun**—from school lessons to real-world skills!\n\nHere is how we understand it easily:\n1. 📖 **Step 1:** Read the question slowly, one word at a time.\n2. 💡 **Step 2:** Find the main idea or clue.\n3. ✏️ **Step 3:** Break it into small friendly pieces.\n\nNever be afraid to ask! Tell me which part feels tricky, and let us explore it together! 🇵🇭💪`;
}

// Development or Production static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Chat Sir Lax server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
