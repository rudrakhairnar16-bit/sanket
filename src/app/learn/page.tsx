"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ALL_SIGNS,
  CATEGORIES,
  WEBCAM_SIGNS,
  getSignsByCategory,
  getQuizForCategory,
  type ISLSign,
} from "@/lib/isl-data";
import {
  loadGame,
  saveGame,
  addXP,
  updateStreak,
  completeSign,
  recordAnswer,
  checkPerfectQuiz,
  checkWebcamMilestone,
  getLevelProgress,
  getAccuracy,
  BADGES,
  type GameState,
} from "@/lib/game-storage";

type Screen = "home" | "flashcards" | "quiz" | "practice" | "badges";

export default function LearnPage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [game, setGame] = useState<GameState | null>(null);
  const [animateIn, setAnimateIn] = useState("animate-fade-in");

  useEffect(() => {
    setGame(loadGame());
  }, []);

  function transitionTo(newScreen: Screen) {
    setAnimateIn("animate-fade-in");
    setScreen(newScreen);
  }

  function updateGame(updater: (prev: GameState) => GameState) {
    setGame((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveGame(next);
      return next;
    });
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  const progress = getLevelProgress(game.xp);
  const accuracy = getAccuracy(game);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-50">
      {screen === "home" && (
        <HomeScreen
          game={game}
          progress={progress}
          accuracy={accuracy}
          onNavigate={transitionTo}
          animateIn={animateIn}
        />
      )}
      {screen === "flashcards" && (
        <FlashcardScreen
          game={game}
          onUpdate={updateGame}
          onBack={() => transitionTo("home")}
        />
      )}
      {screen === "quiz" && (
        <QuizScreen
          game={game}
          onUpdate={updateGame}
          onBack={() => transitionTo("home")}
        />
      )}
      {screen === "practice" && (
        <PracticeScreen
          game={game}
          onUpdate={updateGame}
          onBack={() => transitionTo("home")}
        />
      )}
      {screen === "badges" && (
        <BadgesScreen
          game={game}
          onBack={() => transitionTo("home")}
        />
      )}
    </div>
  );
}

function HomeScreen({
  game,
  progress,
  accuracy,
  onNavigate,
  animateIn,
}: {
  game: GameState;
  progress: { current: number; next: number; progress: number };
  accuracy: number;
  onNavigate: (screen: Screen) => void;
  animateIn: string;
}) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className={`max-w-4xl mx-auto px-4 py-6 ${animateIn}`}>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/login"
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-all"
        >
          ← Login
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-all"
        >
          Clerk Dashboard →
        </Link>
      </div>

      <div className="glass rounded-3xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">ISL Quest</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-0.5">
              Learn Indian Sign Language
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{today}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">Lv.{game.level}</div>
            <p className="text-xs text-gray-400">{game.xp} XP</p>
          </div>
        </div>

        <div className="bg-white/60 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 font-medium">
              Level {game.level} → {game.level + 1}
            </span>
            <span className="text-xs text-gray-400">
              {progress.current} / {progress.next} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress.progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <StatBox icon="🔥" value={game.streak} label="Day Streak" />
          <StatBox icon="🎯" value={`${accuracy}%`} label="Accuracy" />
          <StatBox icon="🏆" value={game.badges.length} label="Badges" />
          <StatBox icon="✅" value={game.completedSigns.length} label="Learned" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <ModeCard
          icon="🃏"
          title="Flashcards"
          description="Flip cards to learn signs and their meanings"
          color="from-primary-500 to-indigo-600"
          onClick={() => onNavigate("flashcards")}
        />
        <ModeCard
          icon="🧠"
          title="Quiz Challenge"
          description="Test your knowledge with quick quizzes"
          color="from-emerald-500 to-teal-600"
          onClick={() => onNavigate("quiz")}
        />
        <ModeCard
          icon="📸"
          title="Webcam Practice"
          description="Use your camera to practice real signs"
          color="from-amber-500 to-orange-600"
          onClick={() => onNavigate("practice")}
        />
      </div>

      <button
        onClick={() => onNavigate("badges")}
        className="w-full glass rounded-2xl p-4 text-center hover:shadow-md transition-all"
      >
        <span className="text-sm font-medium text-gray-600">
          View All Badges ({game.badges.length}/{BADGES.length})
        </span>
      </button>

      <div className="mt-4 p-4 bg-white/40 rounded-2xl text-center">
        <p className="text-xs text-gray-400">
          Content sourced from ISLRTC, Ministry of Social Justice & Empowerment, Govt. of India
        </p>
      </div>
    </div>
  );
}

function StatBox({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-3 text-center">
      <span className="text-xl block mb-0.5">{icon}</span>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl p-6 text-white text-left hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
      <div className="relative">
        <span className="text-4xl block mb-3">{icon}</span>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </button>
  );
}

function FlashcardScreen({
  game,
  onUpdate,
  onBack,
}: {
  game: GameState;
  onUpdate: (updater: (prev: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [signIndex, setSignIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  const category = CATEGORIES[categoryIndex];
  const signs = getSignsByCategory(category.id);
  const currentSign = signs[signIndex];

  function markKnown() {
    if (!currentSign) return;
    onUpdate((prev) => {
      let state = addXP(prev, 15);
      state = completeSign(state, currentSign.id);
      state = recordAnswer(state, true);
      return state;
    });
    setKnownCount((c) => c + 1);

    setTimeout(() => {
      if (signIndex + 1 < signs.length) {
        setSignIndex((i) => i + 1);
        setFlipped(false);
      } else if (categoryIndex + 1 < CATEGORIES.length) {
        setCategoryIndex((i) => i + 1);
        setSignIndex(0);
        setFlipped(false);
      } else {
        onUpdate((prev) => {
          let state = addXP(prev, 50);
          state = updateStreak(state);
          return state;
        });
        onBack();
      }
    }, 400);
  }

  function skipSign() {
    if (signIndex + 1 < signs.length) {
      setSignIndex((i) => i + 1);
      setFlipped(false);
    } else if (categoryIndex + 1 < CATEGORIES.length) {
      setCategoryIndex((i) => i + 1);
      setSignIndex(0);
      setFlipped(false);
    } else {
      onBack();
    }
  }

  const allDone =
    signIndex + 1 > signs.length &&
    categoryIndex + 1 >= CATEGORIES.length;

  if (!currentSign || allDone) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            All Categories Done!
          </h2>
          <p className="text-gray-500 mb-6">
            You reviewed {knownCount} signs. Keep practicing daily!
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-600 transition-all"
        >
          ← Exit
        </button>
        <span className="text-xs text-gray-400">
          {category.name} • {signIndex + 1}/{signs.length}
        </span>
      </div>

      <div
        className="cursor-pointer perspective-[1000px] mb-6"
        onClick={() => setFlipped(!flipped)}
        style={{ perspective: "1000px" }}
      >
        <div
          className={`relative w-full transition-transform duration-500`}
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "320px",
          }}
        >
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-7xl mb-4">{currentSign.icon}</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentSign.name}
            </h2>
            <p className="text-gray-400 text-sm">Tap to reveal meaning</p>
          </div>

          <div
            className="bg-white rounded-3xl shadow-lg border border-primary-200 p-8 flex flex-col items-center justify-center text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              minHeight: "320px",
            }}
          >
            <span className="text-6xl mb-4">💡</span>
            <h2 className="text-2xl font-bold text-primary-700 mb-2">
              {currentSign.meaning}
            </h2>
            {currentSign.hint && (
              <p className="text-gray-500 text-sm mt-2">
                💬 {currentSign.hint}
              </p>
            )}
            {currentSign.webcamSupported && (
              <span className="mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                📸 Webcam practice available
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={skipSign}
          className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
        >
          Skip
        </button>
        <button
          onClick={markKnown}
          className="flex-1 px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
        >
          ✓ I Know This
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {signs.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === signIndex
                ? "bg-primary-500 w-4"
                : i < signIndex
                ? "bg-green-400"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        +15 XP per sign • Tap card to flip
      </p>
    </div>
  );
}

function QuizScreen({
  game,
  onUpdate,
  onBack,
}: {
  game: GameState;
  onUpdate: (updater: (prev: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const lastAnswerRef = useRef<boolean | null>(null);

  const category = CATEGORIES[categoryIndex];
  const quizData = getQuizForCategory(category.id);
  const q = quizData[questionIndex];
  const isCorrect = selected === q?.sign.meaning;

  function handleAnswer(option: string) {
    if (selected) return;
    setSelected(option);
    lastAnswerRef.current = option === q.sign.meaning;
    if (option === q.sign.meaning) {
      setCorrectCount((c) => c + 1);
    }
  }

  function nextQuestion() {
    const correct = lastAnswerRef.current === true;

    onUpdate((prev) => {
      let state = recordAnswer(prev, correct);
      state = addXP(state, correct ? 20 : 5);
      state = completeSign(state, q.sign.id);
      return state;
    });

    if (correct) setScore((s) => s + 20);

    setSelected(null);
    lastAnswerRef.current = null;

    if (questionIndex + 1 >= quizData.length) {
      if (categoryIndex + 1 < CATEGORIES.length) {
        setCategoryIndex((i) => i + 1);
        setQuestionIndex(0);
      } else {
        const pct = ((correctCount + (correct ? 1 : 0)) / quizData.length) * 100;
        if (pct === 100) {
          onUpdate((prev) => checkPerfectQuiz(prev));
        }
        onUpdate((prev) => {
          let state = addXP(prev, 30);
          state = updateStreak(state);
          return state;
        });
        setShowResult(true);
        setFinished(true);
      }
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }

  if (finished) {
    const total = ALL_SIGNS.length;
    const pct = Math.round((correctCount / total) * 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center">
          {pct >= 80 ? (
            <span className="text-7xl block mb-4">🏆</span>
          ) : pct >= 50 ? (
            <span className="text-6xl block mb-4">💪</span>
          ) : (
            <span className="text-6xl block mb-4">📚</span>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {pct >= 80
              ? "Outstanding!"
              : pct >= 50
              ? "Good Effort!"
              : "Keep Learning!"}
          </h2>
          <p className="text-gray-500 mb-1">
            You scored {correctCount}/{total} across {CATEGORIES.length} categories
          </p>
          <p className="text-3xl font-bold text-primary-600 mb-6">
            {pct}% Accuracy
          </p>
          <p className="text-sm text-gray-400 mb-6">+{score} XP earned</p>
          <button
            onClick={onBack}
            className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in text-center">
        <p className="text-gray-500 mb-4">Not enough signs in this category.</p>
        <button onClick={onBack} className="text-primary-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-600 transition-all"
        >
          ← Exit
        </button>
        <span className="text-xs text-gray-400">
          {category.name} • Q{questionIndex + 1}/{quizData.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-4">
        <div className="text-center mb-6">
          <span className="text-6xl block mb-3">{q.sign.icon}</span>
          <h2 className="text-xl font-bold text-gray-900">
            What does this sign mean?
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Sign: {q.sign.name}
          </p>
        </div>

        <div className="space-y-3">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={!!selected}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                selected === option
                  ? option === q.sign.meaning
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-red-500 bg-red-50 shadow-md"
                  : selected
                  ? option === q.sign.meaning
                    ? "border-green-400 bg-green-50"
                    : "border-gray-100 bg-gray-50 opacity-60"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                    selected === option
                      ? option === q.sign.meaning
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-medium">{option}</span>
                {selected && option === q.sign.meaning && (
                  <span className="ml-auto text-green-600 text-sm font-medium">✓</span>
                )}
                {selected === option && option !== q.sign.meaning && (
                  <span className="ml-auto text-red-600 text-sm font-medium">✗</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="animate-slide-up">
          <div
            className={`rounded-2xl p-4 mb-4 text-center ${
              isCorrect
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`font-medium ${
                isCorrect ? "text-green-700" : "text-red-700"
              }`}
            >
              {isCorrect
                ? "✅ Correct! +20 XP"
                : `✗ The answer was: ${q.sign.meaning}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">{q.sign.hint}</p>
            {q.sign.webcamSupported && (
              <p className="text-xs text-green-600 mt-1">📸 Try with webcam!</p>
            )}
          </div>
          <button
            onClick={nextQuestion}
            className="w-full gradient-primary text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg"
          >
            {questionIndex + 1 >= quizData.length &&
            categoryIndex + 1 >= CATEGORIES.length
              ? "See Final Results"
              : "Next Question"}
          </button>
        </div>
      )}

      <div className="flex justify-center gap-1.5 mt-4">
        {quizData.slice(0, 5).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === questionIndex
                ? "bg-primary-500 w-4"
                : i < questionIndex
                ? "bg-green-400"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">
        Score: {score} XP • {correctCount}/{questionIndex + (selected ? 1 : 0)} correct
      </p>
    </div>
  );
}

function PracticeScreen({
  game,
  onUpdate,
  onBack,
}: {
  game: GameState;
  onUpdate: (updater: (prev: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "practicing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [handCount, setHandCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [practiceCount, setPracticeCount] = useState(0);
  const [selectedSign, setSelectedSign] = useState<string>(WEBCAM_SIGNS[0]);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const correctFrames = useRef(0);
  const totalFrames = useRef(0);
  const lastTimestamp = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("isl-webcam-count");
    if (saved) setPracticeCount(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  async function startCamera() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus("ready");
      setTimeout(() => startDetection(), 500);
    } catch (err) {
      setErrorMsg("Camera access denied. Please allow camera permissions.");
      setStatus("error");
    }
  }

  async function startDetection() {
    try {
      const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
      setStatus("practicing");
      lastTimestamp.current = 0;
      processFrame(landmarker);
    } catch {
      setErrorMsg("Failed to load AI model. Check your internet connection.");
      setStatus("error");
    }
  }

  function processFrame(landmarker: any) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(() => processFrame(landmarker));
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      animFrameRef.current = requestAnimationFrame(() => processFrame(landmarker));
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const now = performance.now();
    if (now - lastTimestamp.current > 100) {
      lastTimestamp.current = now;
      const result = landmarker.detectForVideo(video, now);

      if (result.landmarks && result.landmarks.length > 0) {
        setHandCount(result.landmarks.length);

        result.landmarks.forEach((hand: any, i: number) => {
          ctx.strokeStyle = i === 0 ? "#6366f1" : "#8b5cf6";
          ctx.lineWidth = 2;
          const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
            [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15],
            [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
          ];
          for (const [a, b] of connections) {
            ctx.beginPath();
            ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height);
            ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height);
            ctx.stroke();
          }
          ctx.fillStyle = i === 0 ? "#6366f1" : "#8b5cf6";
          for (const lm of hand) {
            ctx.beginPath();
            ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
            ctx.fill();
          }
        });

        const detected = classifyHands(result.landmarks);
        totalFrames.current += 1;
        if (detected.sign === selectedSign && detected.confidence > 0.6) {
          correctFrames.current += 1;
        } else if (totalFrames.current > 10) {
          correctFrames.current = Math.max(0, correctFrames.current - 1);
        }

        const acc = totalFrames.current > 0
          ? Math.round((correctFrames.current / totalFrames.current) * 100)
          : 0;
        setAccuracy(acc);

        if (acc > 60 && totalFrames.current > 20) {
          setStatus("success");
          const newCount = practiceCount + 1;
          setPracticeCount(newCount);
          localStorage.setItem("isl-webcam-count", String(newCount));

          onUpdate((prev) => {
            let state = addXP(prev, 50);
            state = updateStreak(state);
            state = checkWebcamMilestone(state, newCount);
            return state;
          });
          cancelAnimationFrame(animFrameRef.current);
          landmarker.close();
          return;
        }
      } else {
        setHandCount(0);
      }
    }

    animFrameRef.current = requestAnimationFrame(() => processFrame(landmarker));
  }

  function stopAll() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    cancelAnimationFrame(animFrameRef.current);
    correctFrames.current = 0;
    totalFrames.current = 0;
    setAccuracy(0);
    setStatus("idle");
    setErrorMsg("");
  }

  const signInfo = ALL_SIGNS.find((s) => s.name === selectedSign);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { stopAll(); onBack(); }}
          className="text-sm text-gray-400 hover:text-gray-600 transition-all"
        >
          ← Exit
        </button>
        {status !== "idle" && (
          <button
            onClick={stopAll}
            className="text-sm text-red-400 hover:text-red-600 transition-all"
          >
            Restart
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Webcam Practice</h2>
          <p className="text-sm text-gray-500">
            Show the sign to your camera
          </p>
        </div>

        {status === "idle" && (
          <div className="text-center py-8">
            <span className="text-6xl block mb-4">📸</span>
            <p className="text-gray-500 mb-2">Choose a sign to practice:</p>
            <select
              value={selectedSign}
              onChange={(e) => setSelectedSign(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4 bg-white"
            >
              {WEBCAM_SIGNS.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {signInfo && (
              <div className="mb-4 p-3 bg-gray-50 rounded-2xl">
                <span className="text-3xl block mb-2">{signInfo.icon}</span>
                <p className="text-sm text-gray-600">{signInfo.hint}</p>
              </div>
            )}
            <button
              onClick={startCamera}
              className="px-8 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
            >
              Start Camera
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-8">
            <span className="text-6xl block mb-4">😞</span>
            <p className="text-red-600 font-medium mb-2">{errorMsg}</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {(status === "loading" || status === "ready" || status === "practicing") && (
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full scale-x-[-1]"
            />

            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-3" />
                  <p className="text-white/80 text-sm">Starting camera...</p>
                </div>
              </div>
            )}

            {status === "practicing" && (
              <div className="absolute top-3 left-3 right-3 flex justify-between">
                <span className="px-3 py-1.5 bg-black/50 text-white text-xs rounded-xl backdrop-blur">
                  {handCount > 0 ? `${handCount} hand${handCount > 1 ? "s" : ""}` : "No hand"}
                </span>
                <span className="px-3 py-1.5 bg-black/50 text-white text-xs rounded-xl backdrop-blur">
                  Target: {selectedSign}
                </span>
              </div>
            )}
          </div>
        )}

        {status === "practicing" && (
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full gradient-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(accuracy, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 w-12 text-right">
                {accuracy}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {signInfo?.hint}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-6 text-center animate-scale-in">
            <span className="text-5xl block mb-3">🎉</span>
            <p className="text-green-700 font-bold text-lg mb-1">
              Sign Recognized!
            </p>
            <p className="text-green-600 text-sm mb-3">
              You signed {selectedSign} correctly! +50 XP
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={stopAll}
                className="px-6 py-2.5 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all"
              >
                Practice Again
              </button>
              <button
                onClick={() => { stopAll(); onBack(); }}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Practice count: {practiceCount} • +50 XP per successful practice
      </p>
    </div>
  );
}

function classifyHands(hands: { x: number; y: number }[][]): { sign: string | null; confidence: number } {
  if (hands.length === 0) return { sign: null, confidence: 0 };

  const hand = hands[0];
  if (hand.length < 21) return { sign: null, confidence: 0 };

  const d = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const tip4 = hand[4], ip3 = hand[3], mcp2 = hand[2];
  const tip8 = hand[8], pip6 = hand[6], mcp5 = hand[5];
  const tip12 = hand[12], pip10 = hand[10], mcp9 = hand[9];
  const tip16 = hand[16], pip14 = hand[14], mcp13 = hand[13];
  const tip20 = hand[20], pip18 = hand[18], mcp17 = hand[17];

  const thumbExt = d(tip4, ip3) > d(ip3, mcp2) * 1.2;
  const indexExt = d(tip8, pip6) > d(pip6, mcp5) * 1.4;
  const middleExt = d(tip12, pip10) > d(pip10, mcp9) * 1.4;
  const ringExt = d(tip16, pip14) > d(pip14, mcp13) * 1.4;
  const pinkyExt = d(tip20, pip18) > d(pip18, mcp17) * 1.4;

  const allExt = indexExt && middleExt && ringExt && pinkyExt;

  if (allExt && thumbExt) return { sign: "Wait", confidence: 0.85 };
  if (!indexExt && !middleExt && !ringExt && !pinkyExt && !thumbExt) return { sign: "Yes", confidence: 0.8 };
  if (indexExt && !middleExt && !ringExt && !pinkyExt && !thumbExt) return { sign: "No", confidence: 0.75 };

  if (hands.length >= 2) {
    const leftP = { x: (hands[0][9].x + hands[0][0].x) / 2, y: (hands[0][9].y + hands[0][0].y) / 2 };
    const rightP = { x: (hands[1][9].x + hands[1][0].x) / 2, y: (hands[1][9].y + hands[1][0].y) / 2 };
    if (d(leftP, rightP) < 0.15) {
      let match = true;
      for (let i = 4; i < 21; i++) {
        if (d(hands[0][i], hands[1][i]) > 0.1) { match = false; break; }
      }
      if (match) return { sign: "Namaste", confidence: 0.9 };
    }
  }

  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    return { sign: "Namaste", confidence: 0.5 };
  }

  return { sign: null, confidence: 0 };
}

function BadgesScreen({
  game,
  onBack,
}: {
  game: GameState;
  onBack: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <button
        onClick={onBack}
        className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1 transition-all"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievements</h2>
      <p className="text-gray-500 text-sm mb-6">
        {game.badges.length} of {BADGES.length} unlocked
      </p>

      <div className="space-y-3">
        {BADGES.map((badge) => {
          const unlocked = game.badges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`rounded-2xl p-4 flex items-center gap-4 transition-all ${
                unlocked
                  ? "bg-white border border-amber-200 shadow-sm"
                  : "bg-gray-50 border border-gray-100 opacity-60"
              }`}
            >
              <span className={`text-3xl ${unlocked ? "" : "grayscale"}`}>
                {badge.icon}
              </span>
              <div>
                <p
                  className={`font-semibold ${
                    unlocked ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {badge.name}
                </p>
                <p className="text-xs text-gray-500">{badge.requirement}</p>
              </div>
              {unlocked && (
                <span className="ml-auto text-green-500 text-xl">✅</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


