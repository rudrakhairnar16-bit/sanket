"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { municipalSigns, signCategories } from "@/data/signs/municipal-signs";
import { mockModules } from "@/lib/mock-modules";
import { playCorrect, playIncorrect, playLevelUp } from "@/lib/sound";
import { getDueCards, createDefaultCard, updateCard, SRSCard } from "@/lib/learning/srs";

type QuestMode = "menu" | "flashcards" | "quiz" | "dictionary" | "review";

export default function LearnPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<QuestMode>("menu");
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [srsCards, setSrsCards] = useState<SRSCard[]>([]);
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    const stored = localStorage.getItem("sanket-srs-cards");
    if (stored) {
      try {
        const parsed: SRSCard[] = JSON.parse(stored);
        setSrsCards(parsed);
        setDueCards(getDueCards(parsed));
      } catch {}
    } else {
      const initial = municipalSigns.map((s) => createDefaultCard(s.id));
      setSrsCards(initial);
      localStorage.setItem("sanket-srs-cards", JSON.stringify(initial));
      setDueCards(getDueCards(initial));
    }
  }, []);

  const saveSrsCards = useCallback((cards: SRSCard[]) => {
    setSrsCards(cards);
    setDueCards(getDueCards(cards));
    localStorage.setItem("sanket-srs-cards", JSON.stringify(cards));
  }, []);

  const handleFlashcardReview = useCallback(
    (quality: number) => {
      const sign = municipalSigns[currentCard];
      const existing = srsCards.find((c) => c.signId === sign.id);
      const card = existing || createDefaultCard(sign.id);
      const updated = updateCard(card, quality);
      const next = srsCards.map((c) => (c.signId === sign.id ? updated : c));
      if (!existing) next.push(updated);
      saveSrsCards(next);
    },
    [currentCard, srsCards, saveSrsCards]
  );

  const handleReviewAnswer = useCallback(
    (quality: number) => {
      if (reviewIndex >= dueCards.length) return;
      const signId = dueCards[reviewIndex].signId;
      const existing = srsCards.find((c) => c.signId === signId);
      const card = existing || createDefaultCard(signId);
      const updated = updateCard(card, quality);
      const next = srsCards.map((c) => (c.signId === signId ? updated : c));
      if (!existing) next.push(updated);
      saveSrsCards(next);
      if (quality >= 3) playCorrect();
      else playIncorrect();
      setReviewIndex((i) => i + 1);
    },
    [reviewIndex, dueCards, srsCards, saveSrsCards]
  );

  const getDifficultyBadge = (signId: string) => {
    const card = srsCards.find((c) => c.signId === signId);
    if (!card) return null;
    if (card.easeFactor >= 2.5) return <Badge variant="green" className="text-[9px]">Easy</Badge>;
    if (card.easeFactor >= 1.8) return <Badge variant="gold" className="text-[9px]">Medium</Badge>;
    return <Badge variant="red" className="text-[9px]">Hard</Badge>;
  };

  const filteredSigns = municipalSigns.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.nameHi.includes(searchQuery);
    const matchesCategory = filterCategory === "all" || s.category.toLowerCase() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const quiz = mockModules[quizIndex % mockModules.length];
  const totalQuiz = mockModules.length;

  const handleQuizAnswer = (answer: string) => {
    if (answerChecked) return;
    setSelectedAnswer(answer);
    setAnswerChecked(true);
    if (answer === quiz.correctAnswer) {
      setQuizScore((s) => s + 1);
      playCorrect();
    } else {
      playIncorrect();
    }
  };

  const nextQuizQuestion = () => {
    if (quizIndex + 1 >= totalQuiz) {
      playLevelUp();
    }
    setQuizIndex((i) => i + 1);
    setSelectedAnswer(null);
    setAnswerChecked(false);
  };

  return (
    <AppShell>
      <div className="page-container">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              <span className="gradient-text">ISL Quest</span>
            </h1>
            <p className="text-white/50">Learn practical Indian Sign Language</p>
          </div>
          {mode !== "menu" && (
            <Button variant="ghost" size="sm" onClick={() => setMode("menu")}>← Back to Menu</Button>
          )}
        </div>

        {mode === "menu" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="animate-slide-up" style={{ animationDelay: "0ms" } as React.CSSProperties}>
                <Card variant="spatial" hover onClick={() => { setMode("flashcards"); setCurrentCard(0); setFlipped(false); }} className="cursor-pointer h-full">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/20 flex items-center justify-center text-2xl mb-3">🃏</div>
                  <h3 className="font-bold text-white mb-1">Flashcards</h3>
                  <p className="text-sm text-white/50">Flip through {municipalSigns.length} signs with descriptions and hand hints</p>
                  <Badge variant="gold" className="mt-3">{municipalSigns.length} cards</Badge>
                </Card>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: "40ms" } as React.CSSProperties}>
                <Card
                  variant="spatial"
                  hover
                  onClick={() => {
                    if (dueCards.length > 0) {
                      setMode("review");
                      setReviewIndex(0);
                    }
                  }}
                  className="cursor-pointer h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-2xl mb-3">🔄</div>
                  <h3 className="font-bold text-white mb-1">Due for Review</h3>
                  <p className="text-sm text-white/50">
                    {dueCards.length > 0
                      ? `${dueCards.length} sign${dueCards.length !== 1 ? "s" : ""} ready for spaced repetition review`
                      : "No signs due for review — check back later!"}
                  </p>
                  <Badge variant={dueCards.length > 0 ? "green" : "default"} className="mt-3">
                    {dueCards.length} due
                  </Badge>
                </Card>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: "80ms" } as React.CSSProperties}>
                <Card variant="spatial" hover onClick={() => { setMode("quiz"); setQuizIndex(0); setQuizScore(0); setSelectedAnswer(null); setAnswerChecked(false); }} className="cursor-pointer h-full">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-2xl mb-3">❓</div>
                  <h3 className="font-bold text-white mb-1">Quiz Challenge</h3>
                  <p className="text-sm text-white/50">Test your knowledge with {totalQuiz} questions</p>
                  <Badge variant="teal">{totalQuiz} questions</Badge>
                </Card>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: "160ms" } as React.CSSProperties}>
                <Card variant="spatial" hover onClick={() => setMode("dictionary")} className="cursor-pointer h-full">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl mb-3">📖</div>
                  <h3 className="font-bold text-white mb-1">Dictionary</h3>
                  <p className="text-sm text-white/50">Browse and search all ISL signs</p>
                  <Badge variant="blue">{municipalSigns.length} signs</Badge>
                </Card>
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "200ms" } as React.CSSProperties}>
              <Card>
                <div className="flex items-center gap-4">
                  <ProgressRing value={user?.islXp ?? 0} max={(user?.islLevel ?? 1) * 100 + 50} size={80} strokeWidth={6} />
                  <div>
                    <p className="text-sm font-medium text-white">Level {user?.islLevel ?? 1}</p>
                    <p className="text-xs text-white/40">{user?.islXp ?? 0} XP</p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {mode === "flashcards" && (
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/40">Card {currentCard + 1} of {municipalSigns.length}</span>
              <div className="flex items-center gap-2">
                {getDifficultyBadge(municipalSigns[currentCard].id)}
                <Badge variant="gold">{municipalSigns[currentCard].category}</Badge>
              </div>
            </div>
            <Card
              variant="spatial"
              className="min-h-[320px] flex flex-col items-center justify-center cursor-pointer select-none animate-scale-in"
              onClick={() => setFlipped(!flipped)}
            >
              {!flipped ? (
                <>
                  <span className="text-6xl mb-4 block animate-scale-in">{municipalSigns[currentCard].symbol}</span>
                  <h2 className="text-2xl font-bold text-white">{municipalSigns[currentCard].name}</h2>
                  <p className="text-white/40 text-sm mt-2">{municipalSigns[currentCard].nameHi}</p>
                  <p className="text-white/20 text-xs mt-4">Tap to reveal description →</p>
                </>
              ) : (
                <>
                  <p className="text-white/70 text-center mb-4 text-base leading-relaxed">{municipalSigns[currentCard].description}</p>
                  <div className="w-full p-3 rounded-xl bg-white/5 mb-3">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Hand Hint</p>
                    <p className="text-sm text-white/80">{municipalSigns[currentCard].handHint}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <span>Hands: {municipalSigns[currentCard].handCount}</span>
                    <span>•</span>
                    <span>{municipalSigns[currentCard].category}</span>
                  </div>
                </>
              )}
            </Card>
            {flipped && (
              <div className="flex gap-3 mt-4">
                <Button variant="ghost" className="flex-1 border border-red-500/30 hover:bg-red-500/10" onClick={(e) => { e.stopPropagation(); handleFlashcardReview(1); setFlipped(false); setCurrentCard(Math.min(municipalSigns.length - 1, currentCard + 1)); }}>
                  Need Practice
                </Button>
                <Button className="flex-1" onClick={(e) => { e.stopPropagation(); handleFlashcardReview(4); setFlipped(false); setCurrentCard(Math.min(municipalSigns.length - 1, currentCard + 1)); }}>
                  Got it
                </Button>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <Button
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); setCurrentCard(Math.max(0, currentCard - 1)); setFlipped(false); }}
                disabled={currentCard === 0}
              >
                ← Previous
              </Button>
              <Button
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); setCurrentCard(Math.min(municipalSigns.length - 1, currentCard + 1)); setFlipped(false); }}
                disabled={currentCard === municipalSigns.length - 1}
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        {mode === "review" && (
          <div className="max-w-lg mx-auto">
            {reviewIndex >= dueCards.length ? (
              <Card className="text-center py-8 animate-scale-in">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-white mb-2">Review Complete!</h3>
                <p className="text-sm text-white/50 mb-4">You reviewed {dueCards.length} sign{dueCards.length !== 1 ? "s" : ""}</p>
                <Button onClick={() => setMode("menu")}>Back to Menu</Button>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/40">Review {reviewIndex + 1} of {dueCards.length}</span>
                  <Badge variant="gold">Spaced Repetition</Badge>
                </div>
                {(() => {
                  const sign = municipalSigns.find((s) => s.id === dueCards[reviewIndex].signId);
                  if (!sign) return null;
                  return (
                    <Card
                      variant="spatial"
                      className="min-h-[320px] flex flex-col items-center justify-center cursor-pointer select-none animate-scale-in"
                      onClick={() => setFlipped(!flipped)}
                    >
                      {!flipped ? (
                        <>
                          <span className="text-6xl mb-4 block animate-scale-in">{sign.symbol}</span>
                          <h2 className="text-2xl font-bold text-white">{sign.name}</h2>
                          <p className="text-white/40 text-sm mt-2">{sign.nameHi}</p>
                          <p className="text-white/20 text-xs mt-4">Tap to reveal description →</p>
                        </>
                      ) : (
                        <>
                          <p className="text-white/70 text-center mb-4 text-base leading-relaxed">{sign.description}</p>
                          <div className="w-full p-3 rounded-xl bg-white/5 mb-3">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Hand Hint</p>
                            <p className="text-sm text-white/80">{sign.handHint}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/30">
                            <span>Hands: {sign.handCount}</span>
                            <span>•</span>
                            <span>{sign.category}</span>
                          </div>
                        </>
                      )}
                    </Card>
                  );
                })()}
                {flipped && (
                  <div className="flex gap-3 mt-4">
                    <Button variant="ghost" className="flex-1 border border-red-500/30 hover:bg-red-500/10" onClick={() => { handleReviewAnswer(1); setFlipped(false); }}>
                      Need Practice
                    </Button>
                    <Button className="flex-1" onClick={() => { handleReviewAnswer(4); setFlipped(false); }}>
                      Got it
                    </Button>
                  </div>
                )}
                <div className="flex justify-between mt-4">
                  <Button variant="ghost" onClick={() => setMode("menu")}>Exit Review</Button>
                  <span className="text-xs text-white/30 self-center">{dueCards.length - reviewIndex - 1} remaining</span>
                </div>
              </>
            )}
          </div>
        )}

        {mode === "quiz" && (
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/40">Question {Math.min(quizIndex + 1, totalQuiz)} of {totalQuiz}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/40">Score: <span className="text-gold-400 font-bold">{quizScore}</span></span>
                <ProgressRing value={quizIndex} max={totalQuiz} size={40} strokeWidth={4} showValue={false} />
              </div>
            </div>
            <Card className="animate-scale-in">
              <div className="mb-2">
                <Badge variant="teal">{quiz.category}</Badge>
                <Badge variant="default" className="ml-2">{quiz.difficulty}</Badge>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 mt-3">{quiz.question}</h3>
              <p className="text-sm text-white/40 mb-4">{quiz.questionHi}</p>
              <div className="space-y-2">
                {quiz.options.map((option: string) => {
                  const isCorrect = option === quiz.correctAnswer;
                  const isSelected = option === selectedAnswer;
                  let borderClass = "border-white/10 hover:border-white/20 hover:bg-white/5";
                  let icon = "";
                  if (answerChecked) {
                    if (isCorrect) { borderClass = "border-green-500 bg-green-500/10"; icon = "✓"; }
                    else if (isSelected && !isCorrect) { borderClass = "border-red-500 bg-red-500/10"; icon = "✗"; }
                  }
                  return (
                    <button
                      key={option}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={answerChecked}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-sm text-white/70 flex items-center justify-between ${borderClass}`}
                    >
                      <span>{option}</span>
                      {icon && <span className={isCorrect ? "text-green-400" : "text-red-400"}>{icon}</span>}
                    </button>
                  );
                })}
              </div>
              {answerChecked && (
                <div className="mt-4">
                  <Button onClick={nextQuizQuestion} className="w-full">
                    {quizIndex + 1 >= totalQuiz ? "View Results" : "Next Question →"}
                  </Button>
                </div>
              )}
            </Card>
            {quizIndex + 1 >= totalQuiz && answerChecked && (
              <Card className="mt-4 text-center animate-scale-in border-gold-400/30">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-2xl font-bold text-gold-400">{quizScore}/{totalQuiz}</p>
                <p className="text-sm text-white/50">Quiz Complete!</p>
                <Button className="mt-4" onClick={() => { setQuizIndex(0); setQuizScore(0); setSelectedAnswer(null); setAnswerChecked(false); }}>
                  Try Again
                </Button>
              </Card>
            )}
          </div>
        )}

        {mode === "dictionary" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Search signs by name or Hindi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field flex-1"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field w-full sm:w-48"
              >
                <option value="all">All Categories</option>
                {signCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-white/40 mb-4">{filteredSigns.length} signs found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredSigns.map((sign) => (
                <Card key={sign.id} className="text-center p-4 hover:border-gold-400/20 transition-all cursor-default">
                  <span className="text-3xl block mb-2">{sign.symbol}</span>
                  <p className="font-semibold text-white text-sm">{sign.name}</p>
                  <p className="text-xs text-white/40">{sign.nameHi}</p>
                  <p className="text-[10px] text-white/20 mt-1">{sign.category}</p>
                  <div className="mt-2">{getDifficultyBadge(sign.id)}</div>
                </Card>
              ))}
            </div>
            {filteredSigns.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl block mb-3">🔍</span>
                <p className="text-white/40">No signs found matching your search</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
