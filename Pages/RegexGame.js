import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  RefreshCw,
  Lightbulb,
  Code2,
  Loader2,
  BookOpen,
  Settings,
} from "lucide-react";
import GameBoard from "@/components/regex-game/GameBoard";
import RegexInput from "@/components/regex-game/RegexInput";
import TargetDisplay from "@/components/regex-game/TargetDisplay";
import LevelIndicator from "@/components/regex-game/LevelIndicator";
import SuccessModal from "@/components/regex-game/SuccessModal";
import RegexLegend from "@/components/regex-game/RegexLegend";
import {
  generateTargets,
  getAvailableFeatures,
} from "@/components/regex-game/regexFeatures";

const TEXT_APIS = [
  {
    url: "https://api.quotable.io/random?minLength=100&maxLength=300",
    parser: (data) => data.content,
  },
  {
    url: "https://uselessfacts.jsph.pl/api/v2/facts/random",
    parser: (data) => data.text,
  },
  {
    url: "https://api.chucknorris.io/jokes/random",
    parser: (data) => data.value,
  },
  {
    url: "https://api.adviceslip.com/advice",
    parser: (data) => data.slip.advice,
  },
  { url: "https://catfact.ninja/fact", parser: (data) => data.fact },
  {
    url: "https://official-joke-api.appspot.com/random_joke",
    parser: (data) => `${data.setup} ${data.punchline}`,
  },
];

export default function RegexGame() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [text, setText] = useState("");
  const [targets, setTargets] = useState([]);
  const [regex, setRegex] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [currentFeatures, setCurrentFeatures] = useState([]);
  const [showLegend, setShowLegend] = useState(false);

  const fetchText = useCallback(async () => {
    setIsLoading(true);
    setRegex("");

    // Try multiple APIs in case one fails
    for (let attempt = 0; attempt < 5; attempt++) {
      const api = TEXT_APIS[Math.floor(Math.random() * TEXT_APIS.length)];
      try {
        const response = await fetch(api.url);
        const data = await response.json();
        const fetchedText = api.parser(data);

        if (fetchedText && fetchedText.length >= 50) {
          setText(fetchedText);

          // Generate targets using the new feature-based system
          const result = generateTargets(fetchedText, level, 3);

          if (result) {
            setTargets(result.targets);
            setCurrentFeatures(result.features);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.log("API failed, trying another...");
      }
    }

    // Fallback text with better content for pattern matching
    const fallbackText =
      "The quick brown fox jumps over the lazy dog. Programming is the art of telling a computer what to do. Numbers like 123 and 456 are important. Characters repeat sometimes, like ooooh or ahhhh!";
    setText(fallbackText);

    const result = generateTargets(fallbackText, level, 3);
    if (result) {
      setTargets(result.targets);
      setCurrentFeatures(result.features);
    } else {
      // Ultimate fallback
      setTargets([
        { text: "qui", feature: "literal", featureName: "Literal Characters" },
        { text: "fox", feature: "literal", featureName: "Literal Characters" },
        { text: "art", feature: "literal", featureName: "Literal Characters" },
      ]);
      setCurrentFeatures([]);
    }

    setIsLoading(false);
  }, [level]);

  useEffect(() => {
    fetchText();
  }, [fetchText]);

  // Calculate which targets are matched
  const matchedTargets = useMemo(() => {
    if (!regex || !text) return [];

    try {
      const re = new RegExp(regex, "g");
      const matches = [];
      let match;
      while ((match = re.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        });
        if (match[0].length === 0) break;
      }

      return targets
        .map((target, index) => {
          const isMatched = matches.some(
            (m) =>
              m.text.includes(target.text) ||
              (m.start <= target.start && m.end >= target.end),
          );
          return isMatched ? index : -1;
        })
        .filter((i) => i !== -1);
    } catch {
      return [];
    }
  }, [regex, text, targets]);

  // Count total matches
  const matchCount = useMemo(() => {
    if (!regex || !text) return 0;
    try {
      const re = new RegExp(regex, "g");
      const matches = text.match(re);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [regex, text]);

  const isAllMatched =
    matchedTargets.length === targets.length && targets.length > 0;

  const handleSubmit = () => {
    if (isAllMatched) {
      const basePoints = 100 * level;
      const streakBonus = streak * 25;
      const earned = basePoints + streakBonus;

      setPointsEarned(earned);
      setScore((prev) => prev + earned);
      setStreak((prev) => prev + 1);
      setShowSuccess(true);
    }
  };

  const handleNextLevel = () => {
    setShowSuccess(false);
    setLevel((prev) => prev + 1);
    fetchText();
  };

  const handleSkip = () => {
    setStreak(0);
    fetchText();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 
                                  rounded-full border border-slate-700/50 mb-4"
          >
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span className="text-slate-300 font-medium">Regex Challenge</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 
                                 bg-clip-text text-transparent mb-2"
          >
            Pattern Finder
          </h1>
          <p className="text-slate-400">
            Master regular expressions one pattern at a time
          </p>
        </motion.div>

        {/* Level indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <LevelIndicator level={level} score={score} streak={streak} />
            <Link to={createPageUrl("Settings")}>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Main game area */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
              <p className="text-slate-400">Loading challenge...</p>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Text display */}
              <GameBoard text={text} regex={regex} targets={targets} />

              {/* Targets */}
              <TargetDisplay
                targets={targets}
                matchedTargets={matchedTargets}
              />

              {/* Regex input */}
              <RegexInput
                value={regex}
                onChange={setRegex}
                isValid={isAllMatched}
                matchCount={matchCount}
                onSubmit={handleSubmit}
              />

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="bg-slate-900/50 border-slate-700 hover:bg-slate-800 
                                                 text-slate-300 hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Skip
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowLegend(true)}
                    className="bg-slate-900/50 border-slate-700 hover:bg-slate-800 
                                                 text-slate-300 hover:text-white"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Pattern Guide
                  </Button>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!isAllMatched}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 
                                             hover:from-cyan-400 hover:to-purple-400 text-white 
                                             font-semibold px-8 disabled:opacity-50 disabled:cursor-not-allowed
                                             shadow-lg shadow-purple-500/25"
                >
                  Submit
                </Button>
              </div>

              {/* Feature hint display */}
              {currentFeatures.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-purple-300 font-medium mb-1">
                        Features for this level
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentFeatures.map((feature, idx) => {
                          const Icon = feature.icon;
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 px-2 py-1 
                                                                                  bg-purple-500/20 border border-purple-500/30 rounded-md"
                            >
                              <Icon className="w-3 h-3 text-purple-300" />
                              <span className="text-xs text-purple-200">
                                {feature.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-purple-200/70 text-xs mt-2">
                        Try using these patterns to match all targets
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success modal */}
      <SuccessModal
        isOpen={showSuccess}
        level={level}
        score={score}
        pointsEarned={pointsEarned}
        onNextLevel={handleNextLevel}
      />

      {/* Regex Legend */}
      <RegexLegend
        currentLevel={level}
        isOpen={showLegend}
        onClose={() => setShowLegend(false)}
      />

      {/* Custom scrollbar styles */}
      <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(30, 41, 59, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(100, 116, 139, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(100, 116, 139, 0.7);
                }
            `}</style>
    </div>
  );
}
