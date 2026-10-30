import { ChatMessage, GradeLevel, LanguageMode, ModeType } from '../types';

export async function sendChatMessage(
  message: string,
  mode: ModeType,
  gradeLevel: GradeLevel,
  language: LanguageMode,
  history: ChatMessage[],
  forceOffline: boolean = false
): Promise<{ text: string; isOffline: boolean; source: string }> {
  // Check if browser is offline or user forced offline mode
  const isActuallyOffline = forceOffline || (typeof navigator !== 'undefined' && !navigator.onLine);

  if (isActuallyOffline) {
    const offlineReply = getOfflineTutorResponse(message, mode, gradeLevel, language);
    return {
      text: offlineReply,
      isOffline: true,
      source: 'offline-cached-pack',
    };
  }

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        mode,
        gradeLevel,
        language,
        history: history.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return {
      text: data.reply || 'Let us try this together step-by-step!',
      isOffline: data.source === 'offline-engine',
      source: data.source || 'gemini',
    };
  } catch (err) {
    console.warn('Network call failed, switching to Sir Lax offline tutor:', err);
    const fallbackText = getOfflineTutorResponse(message, mode, gradeLevel, language);
    return {
      text: fallbackText,
      isOffline: true,
      source: 'offline-emergency-engine',
    };
  }
}

// Comprehensive offline response engine for zero-data environments
function getOfflineTutorResponse(
  query: string,
  mode: ModeType,
  _gradeLevel: GradeLevel,
  language: LanguageMode
): string {
  const q = query.toLowerCase().trim();
  const isTagalog = language === 'filipino';
  const isBilingual = language === 'bilingual';

  // Math additions / subtractions
  const mathMatch = q.match(/(\d+)\s*([\+\-\*\/x])\s*(\d+)/);
  if (mathMatch) {
    const n1 = parseInt(mathMatch[1], 10);
    const op = mathMatch[2];
    const n2 = parseInt(mathMatch[3], 10);
    let result = 0;
    let explanation = '';

    if (op === '+') {
      result = n1 + n2;
      explanation = `Let us count with delicious mangoes 🥭!\n- First basket: **${n1} mangoes**\n- Second basket: **${n2} mangoes**\n👉 Put them together in one big basket: **${result} mangoes**!\n\n✨ **Final Answer: ${n1} + ${n2} = ${result}**`;
    } else if (op === '-') {
      result = n1 - n2;
      explanation = `Let us count with sweet cookies 🍪!\n- You start with **${n1} cookies**.\n- You give your sister **${n2} cookies**.\n👉 How many are left for you? Exactly **${result} cookies**!\n\n✨ **Final Answer: ${n1} - ${n2} = ${result}**`;
    } else if (op === '*' || op === 'x') {
      result = n1 * n2;
      explanation = `Multiplication is just fast adding!\n- Think of **${n1} groups** with **${n2} items** in each group.\n👉 If you add them all up, you get **${result}**!\n\n✨ **Final Answer: ${n1} × ${n2} = ${result}**`;
    } else {
      result = Math.floor(n1 / (n2 || 1));
      explanation = `Division means sharing equally with your classmates!\n- You have **${n1} candies**.\n- You share them equally with **${n2} friends**.\n👉 Each friend receives **${result} candies**!\n\n✨ **Final Answer: ${n1} ÷ ${n2} = ${result}**`;
    }

    if (isTagalog) {
      return `🌟 **Offline Math Helper ni Sir Lax!**\n\nNapakadali niyan anak! Walang internet pero sagot agad!\n\n${explanation}\n\n👏 Ang galing mo mag-aral! Subukan mo pa ang isa!`;
    }
    return `🌟 **Sir Lax Offline Math Helper!** *(Saved on your device)*\n\n${explanation}\n\n👏 Great job solving this! Try another one!`;
  }

  // Science / Nature & Curiosities under the sun
  if (q.includes('water cycle') || q.includes('rain') || q.includes('ulan')) {
    if (isTagalog || isBilingual) {
      return `🌧️ **Paano Bumabagsak ang Ulan? (Water Cycle in Simple Words)**\n\n1. ☀️ **Painit (Evaporation):** Naiinitan ng araw ang tubig sa ilog o dagat, nagiging usok na umaakyat sa langit.\n2. ☁️ **Ulap (Condensation):** Nagsasama-sama ang usok at nagiging mabigat na ulap.\n3. 🌧️ **Ulan (Precipitation):** Kapag sobrang bigat na, bumubuhos na ito bilang patak ng ulan!\n\n💧 Babalik ito sa lupa at ulit-ulitin. Galing ng kalikasan! 🌿`;
    }
    return `🌧️ **The Water Cycle Explained for Grade 1!**\n\nThink of water taking a fun merry-go-round ride:\n1. ☀️ **Step 1 - Sun Heats Up:** The sun warms up water in rivers. It turns into invisible steam and flies up to the sky.\n2. ☁️ **Step 2 - Cloud Hugs:** High in the cold sky, droplets hug each other and become fluffy clouds.\n3. 🌧️ **Step 3 - Raindrops Fall:** When clouds get too heavy, water drops fall down as rain!\n\n✨ The plants drink the rain, and the circle starts again! High five! 👏`;
  }

  // Why is the sky blue / Why is ocean salty
  if (q.includes('sky') && (q.includes('blue') || q.includes('asul'))) {
    return `☀️ **Why is the Sky Blue? (Anything Under The Sun!)**\n\nSunlight looks white, but it hides all rainbow colors! 🌈\n- When sunlight reaches our Earth, it bumps into tiny gases in the sky.\n- The **blue light** is bouncy and scatters in every direction (Rayleigh scattering)!\n- So whenever you look up in the morning or noon, your eyes catch the scattered blue sunshine! ☀️✨`;
  }

  if (q.includes('ocean') || q.includes('sea') || q.includes('dagat') || q.includes('salty') || q.includes('maalat')) {
    return `🌊 **Why is the Ocean Salty? (Bakit Maalat ang Dagat?)**\n\n1. 🌧️ Rain trickles down over rocks and mountains on land.\n2. 🪨 The water washes tiny minerals and natural salts out of the rocks.\n3. 🏞️ Rivers carry those minerals into the ocean.\n4. ☀️ The sun evaporates pure water into clouds, leaving the minerals behind!\n👉 Over millions of years, the salt stayed in the ocean! That's why sea water tastes like salt! 🌊✨`;
  }

  // Practical World: Budgeting & Saving Money
  if (q.includes('budget') || q.includes('allowance') || q.includes('baon') || q.includes('ipon') || mode === 'practical') {
    return `💰 **Kuya Sir Lax’s 3-Envelope Allowance & Ipon Rule!**\n\nHandling your allowance wisely gives you freedom! 🇵🇭\n\n1. 🚌 **Envelope 1: Pamasahe & Lunch (60%)** -> Fares and healthy lunch so you have energy.\n2. 💡 **Envelope 2: School Emergency (20%)** -> Photocopier, pencil, or unexpected project fee.\n3. 🐷 **Envelope 3: Piggy Bank / Savings (20%)** -> Put ₱5 or ₱10 into an empty bottle or can every single day!\n\n💡 **Tipid Life Hack:** Always bring a reusable water tumbler! Buying cold plastic water wastes ₱20 every school day (that's ₱400 monthly savings!). Great job learning life skills! 👏`;
  }

  // Practical World: Healthy tipid food
  if (q.includes('cook') || q.includes('recipe') || q.includes('ulam') || q.includes('luto') || q.includes('food')) {
    return `🍳 **Sir Lax's ₱25 Nutritious Tipid Recipe: "Tortang Malunggay with Egg"!**\n\nSuper healthy, fast, and gives you brain energy for exams! 🧠\n\n🥣 **What you need:**\n- 1 egg (₱8 to ₱10)\n- Fresh Malunggay leaves picked from the garden tree (Free!)\n- Tiny pinch of salt\n- 1 spoon of oil\n\n📝 **Easy Steps:**\n1. Beat the egg in a cup until fluffy.\n2. Wash malunggay and stir into the egg with a pinch of salt.\n3. Cook in a pan for 1 minute on each side until golden.\n\n✨ Serve with warm rice! High in iron, calcium, and vitamin A. Masarap at masustansya! 🍚`;
  }

  // Practical World: IDs & Interviews
  if (q.includes('interview') || q.includes('job') || q.includes('id') || q.includes('resume')) {
    return `📋 **Sir Lax Practical Life Guide: First Interview & Barangay ID!**\n\n1. 🪪 **Getting a Free First-Time Jobseeker Certificate:** Go to your Barangay Hall. Under Republic Act 11261, first-time jobseekers get Barangay Clearance, Police Clearance, and NBI clearance for FREE!\n2. 👔 **Interview Secret:** Arrive 15 minutes early, smile, wear neat collared clothes, and speak with honesty. Say: *"I am eager to learn, hard-working, and dependable."*\n\n🌟 You have dignity and bright potential. Walk with your head held high! 🇵🇭`;
  }

  // DIY projects
  if (mode === 'diy' || q.includes('diy') || q.includes('project') || q.includes('craft') || q.includes('recycled')) {
    return `🛠️ **Sir Lax Free DIY Guide: Recycled Cardboard Pencil Holder & Stand!**\n\n*Cost: ₱0.00 (Zero Pesos! Free at home)*\n\n📦 **What you need:**\n- 1 empty toilet paper roll or small box\n- 1 piece of cardboard from an old carton box\n- Old newspaper, biscuit wrappers, or colorful flyers\n- Rice glue (kanin mashed with a drop of water) or tape\n\n📝 **Easy 4 Steps:**\n1. Take the cardboard tube and glue it standing up on the flat cardboard base.\n2. Dip your finger in rice paste (or tape) and wrap colorful wrappers around it.\n3. Write your dream on the front: **"Future Doctor / Teacher / Engineer"**! 🌟\n4. Let it dry under the fan. Place your pens and pencils inside!\n\n✨ **Sir Lax Tip:** "Creativity does not need expensive store-bought items. The greatest minds invent with what they have around them!" 🇵🇭`;
  }

  // College Youth help
  if (q.includes('college') || q.includes('thesis') || q.includes('stipend') || q.includes('exam')) {
    return `🎓 **Kuya Sir Lax Advice for College Youth & Working Scholars:**\n\nI see how hard you work every day. Never lose heart!\n\n💡 **Survival Tips:**\n1. **Meal Strategy:** Never study on an empty stomach. If you have no lunch, come to our Barangay Feeding Hub or Dorm Study Pantry for free warm arroz caldo.\n2. **Break Big Homeworks Down:** Don't write a 10-page paper in one night. Write 2 simple paragraphs today, 2 paragraphs tomorrow.\n3. **Rest Your Mind:** 20 minutes of sleep before study gives you double memory power.\n\n🌟 Remember our core motto: **"EDUCATION IS THE KEY FOR CHANGE!"** You are changing your family's future with every passed exam! 🇵🇭💪`;
  }

  // Default warm response
  if (isTagalog) {
    return `🌟 **Kumusta anak! Kuya Sir Lax dito!** *(Offline Mode Ready)*\n\nBinasa ko ang tanong mo: "*${query}*". Maaari kang magtanong ng **kahit ano sa ilalim ng araw**—aralin sa paaralan, praktikal na buhay, o mga katanungan sa mundo!\n\nNarito ang simpleng gabay:\n1. 📖 Basahin nang dahan-dahan ang tanong.\n2. 💡 Hanapin ang pinakamahalagang salita.\n3. ✏️ Huwag matakot magkamali—diyan tayo natututo!\n\nSabihin mo sa akin: Aling salita o bahagi ang medyo nakakalito, at ipaliliwanag ko nang mas madali! 🇵🇭`;
  }

  return `🌟 **Hello my smart student! Sir Lax is here with you!** *(Offline Mode Ready)*\n\nI love your question: "*${query}*". Remember, you can ask me **anything under the sun**—school lessons, real-world skills, or big curiosities!\n\nHere is how we explore it easily:\n1. 📖 **Step 1:** Read the question with a smile.\n2. 💡 **Step 2:** Look for the clue word.\n3. ✏️ **Step 3:** Break it into small friendly pieces.\n\nNever forget: You are capable and smart! Let me know what step you want to do first! 🌟👏`;
}
