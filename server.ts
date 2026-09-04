import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for leaderboard and appreciations
interface LeaderboardRecord {
  id: string;
  name: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  streak: number;
  topicsLearned: number;
  badge: string;
  appreciations: number;
  category: 'daily' | 'weekly' | 'all-time';
}

const defaultLeaderboard: LeaderboardRecord[] = [
  { id: 'u1', name: 'Aarav Sharma', avatar: '🎓', wpm: 96, accuracy: 99, streak: 14, topicsLearned: 28, badge: 'Speed Master', appreciations: 42, category: 'weekly' },
  { id: 'u2', name: 'Elena Rostova', avatar: '🔬', wpm: 92, accuracy: 98, streak: 21, topicsLearned: 34, badge: 'Scholar Typist', appreciations: 38, category: 'weekly' },
  { id: 'u3', name: 'David Chen', avatar: '💻', wpm: 88, accuracy: 97, streak: 9, topicsLearned: 19, badge: 'Code Typist', appreciations: 29, category: 'weekly' },
  { id: 'u4', name: 'Priya Patel', avatar: '📚', wpm: 85, accuracy: 99, streak: 18, topicsLearned: 25, badge: 'Accuracy Master', appreciations: 51, category: 'weekly' },
  { id: 'u5', name: 'Marcus Miller', avatar: '🚀', wpm: 81, accuracy: 96, streak: 6, topicsLearned: 15, badge: 'Cosmos Explorer', appreciations: 19, category: 'weekly' },
  { id: 'u6', name: 'Sara Tanaka', avatar: '🧠', wpm: 78, accuracy: 98, streak: 11, topicsLearned: 22, badge: 'Neuro Typist', appreciations: 27, category: 'weekly' },
  { id: 'u7', name: 'Zainab Ahmed', avatar: '⚡', wpm: 75, accuracy: 95, streak: 5, topicsLearned: 12, badge: 'Speed Initiate', appreciations: 14, category: 'weekly' },
];

let communityLeaderboard: LeaderboardRecord[] = [...defaultLeaderboard];

// Helper to clean raw Wikipedia extract into clean typing text
function cleanWikipediaText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    // Remove references like [1], [citation needed], [note 2]
    .replace(/\[\d+\]/g, '')
    .replace(/\[[a-zA-Z\s]+\]/g, '')
    // Remove wiki headings like == Section ==
    .replace(/={2,}[^=]+={2,}/g, '')
    // Remove bullet characters
    .replace(/^[\*\#\•\-\–\—]\s+/gm, '')
    // Normalize curly quotes and special punctuation that ruin typing test
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper to partition text into sentences and word counts
function splitIntoWordsAndPassages(cleanedText: string) {
  const sentences = cleanedText.match(/[^.!?]+[.!?]+(\s|$)/g) || [cleanedText];
  
  let quickPassage = '';
  let standardPassage = '';
  let deepPassage = '';

  let wordCount = 0;
  for (const sentence of sentences) {
    const sWords = sentence.trim().split(/\s+/).length;
    wordCount += sWords;

    if (wordCount <= 160) {
      quickPassage += (quickPassage ? ' ' : '') + sentence.trim();
    }
    if (wordCount <= 380) {
      standardPassage += (standardPassage ? ' ' : '') + sentence.trim();
    }
    if (wordCount <= 950) {
      deepPassage += (deepPassage ? ' ' : '') + sentence.trim();
    }
  }

  // Fallbacks if text was short
  if (!quickPassage) quickPassage = cleanedText.slice(0, 500);
  if (!standardPassage) standardPassage = cleanedText.slice(0, 1500);
  if (!deepPassage) deepPassage = cleanedText;

  return {
    quick: quickPassage.trim(),
    standard: standardPassage.trim(),
    deep: deepPassage.trim(),
  };
}

// Calculate difficulty metrics
function assessDifficulty(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'Medium';
  const avgLen = words.reduce((acc, w) => acc + w.length, 0) / words.length;
  if (avgLen < 4.8) return 'Easy';
  if (avgLen > 6.2) return 'Hard';
  return 'Medium';
}

// Heuristic fallback for learning summary takeaways
function extractKeyTakeaways(topic: string, text: string): string[] {
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || [])
    .map(s => s.trim())
    .filter(s => s.length > 30 && s.length < 180);
  
  if (sentences.length >= 4) {
    return sentences.slice(0, 4);
  }

  return [
    `${topic} is a significant subject with wide real-world and academic applications.`,
    `Understanding core concepts of ${topic} strengthens conceptual clarity and analytical thinking.`,
    `Typing key terminology reinforces motor memory and long-term subject recall.`,
    `Regular revision helps retain key facts about ${topic} over time.`
  ];
}

// Heuristic fallback quiz generator
function generateHeuristicQuiz(topic: string, text: string) {
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).map(s => s.trim()).filter(s => s.length > 25);
  const firstSentence = sentences[0] || `${topic} is a central concept in modern studies.`;

  return [
    {
      question: `According to the passage, what is the primary focus of ${topic}?`,
      options: [
        firstSentence.length > 80 ? firstSentence.slice(0, 75) + '...' : firstSentence,
        `An ancient mythological theory with no practical modern relevance.`,
        `A mechanical hardware assembly process for computer monitors.`,
        `A purely recreational hobby without documented academic study.`
      ],
      correctIndex: 0,
      explanation: `The introductory definition specifies the core domain of ${topic}.`
    },
    {
      question: `Why is practicing topic-based typing in ${topic} effective for students?`,
      options: [
        `It only measures raw finger velocity without learning retention.`,
        `It combines motor skills with cognitive processing to build lasting conceptual memory.`,
        `It forces users to memorize random keys without understanding words.`,
        `It eliminates the need to review academic concepts.`
      ],
      correctIndex: 1,
      explanation: `Topic-based typing stimulates cognitive memory pathways alongside muscle memory.`
    },
    {
      question: `What distinguishes ${topic} when explored systematically?`,
      options: [
        `It requires continuous random guesswork without structured facts.`,
        `It is based on verified foundational principles, literature, and practical applications.`,
        `It is restricted only to a single obsolete historical era.`,
        `It has no structured definitions or documented history.`
      ],
      correctIndex: 1,
      explanation: `Educational subjects like ${topic} are defined by empirical and documented foundations.`
    }
  ];
}

// 1. Wikipedia Search API Proxy
app.get('/api/wikipedia/search', async (req, res) => {
  const query = (req.query.q as string || '').trim();
  if (!query) {
    return res.json({ results: [] });
  }

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=8&namespace=0&format=json`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TypeWise-Educational-Typing-Platform/1.0 (contact: student-support@typewise.edu)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Wikipedia search failed with status: ${response.status}`);
    }

    const data = await response.json();
    // data format: [query, [titles], [descriptions], [urls]]
    const titles: string[] = data[1] || [];
    const snippets: string[] = data[2] || [];
    const urls: string[] = data[3] || [];

    const results = titles.map((title, idx) => ({
      title,
      snippet: snippets[idx] || `Read and type about ${title}`,
      url: urls[idx] || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
    }));

    res.json({ results });
  } catch (error) {
    console.error('Wikipedia search error:', error);
    res.status(500).json({ error: 'Failed to search Wikipedia', results: [] });
  }
});

// 2. Wikipedia Topic Extraction & Processing
app.get('/api/wikipedia/topic', async (req, res) => {
  const title = (req.query.title as string || '').trim();
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    // Fetch Wikipedia full extract
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro=false&explaintext=true&pithumbsize=600&titles=${encodeURIComponent(title)}&format=json&redirects=1`;
    const response = await fetch(extractUrl, {
      headers: {
        'User-Agent': 'TypeWise-Educational-Typing-Platform/1.0 (contact: student-support@typewise.edu)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const data = await response.json();
    const pages = data?.query?.pages || {};
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (!page || page.missing || !page.extract) {
      return res.status(404).json({ error: `No article found for "${title}"` });
    }

    const rawExtract: string = page.extract;
    const cleanedText = cleanWikipediaText(rawExtract);
    const passages = splitIntoWordsAndPassages(cleanedText);
    const difficulty = assessDifficulty(passages.standard);
    const wordsCount = passages.standard.split(/\s+/).length;

    let keyTakeaways = extractKeyTakeaways(page.title, passages.standard);
    let quiz = generateHeuristicQuiz(page.title, passages.quick);

    // Optional AI enhancement if GEMINI_API_KEY is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Analyze this educational passage about "${page.title}":
"${passages.standard.slice(0, 1200)}"

Return a JSON object with:
1. "keyTakeaways": an array of exactly 4 concise, clear educational bullet point facts a student should learn and remember.
2. "quiz": an array of 3 multiple-choice questions testing reading comprehension and recall of this passage.
Each question object must contain:
- "question": string
- "options": array of 4 distinct strings
- "correctIndex": number (0-3)
- "explanation": string explaining why the answer is correct.

Respond ONLY with valid JSON.`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (aiResponse.text) {
          const parsed = JSON.parse(aiResponse.text);
          if (Array.isArray(parsed.keyTakeaways) && parsed.keyTakeaways.length > 0) {
            keyTakeaways = parsed.keyTakeaways;
          }
          if (Array.isArray(parsed.quiz) && parsed.quiz.length > 0) {
            quiz = parsed.quiz;
          }
        }
      } catch (aiErr) {
        console.warn('Gemini enhancement skipped, using structured heuristics:', aiErr);
      }
    }

    res.json({
      title: page.title,
      thumbnail: page.thumbnail?.source || null,
      difficulty,
      wordCounts: {
        quick: passages.quick.split(/\s+/).length,
        standard: passages.standard.split(/\s+/).length,
        deep: passages.deep.split(/\s+/).length,
      },
      passages,
      keyTakeaways,
      quiz
    });

  } catch (error: any) {
    console.error('Topic fetch error:', error);
    res.status(500).json({ error: error.message || 'Error processing topic' });
  }
});

// 3. Leaderboard API
app.get('/api/leaderboard', (req, res) => {
  const category = (req.query.category as string) || 'weekly';
  const list = communityLeaderboard.filter(item => item.category === category || category === 'all-time');
  res.json({ leaderboard: list.sort((a, b) => b.wpm - a.wpm) });
});

// 4. Appreciate / Kudos endpoint for social leaderboard
app.post('/api/leaderboard/appreciate', (req, res) => {
  const { peerId } = req.body;
  const peer = communityLeaderboard.find(p => p.id === peerId);
  if (peer) {
    peer.appreciations += 1;
    return res.json({ success: true, appreciations: peer.appreciations });
  }
  res.status(404).json({ error: 'Peer not found' });
});

// 5. Submit user score to leaderboard
app.post('/api/leaderboard/submit', (req, res) => {
  const { name, avatar, wpm, accuracy, streak, topicsLearned, badge } = req.body;
  const newEntry: LeaderboardRecord = {
    id: 'user-' + Date.now(),
    name: name || 'Anonymous Student',
    avatar: avatar || '⚡',
    wpm: Math.round(wpm) || 60,
    accuracy: Math.round(accuracy) || 95,
    streak: streak || 1,
    topicsLearned: topicsLearned || 1,
    badge: badge || 'Knowledge Explorer',
    appreciations: 0,
    category: 'weekly'
  };

  communityLeaderboard.push(newEntry);
  res.json({ success: true, entry: newEntry });
});

// Start server with Vite middleware in development or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TypeWise server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
