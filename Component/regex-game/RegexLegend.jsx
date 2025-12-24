import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, X, Lock, CheckCircle } from "lucide-react";
import { REGEX_FEATURES, getAvailableFeatures } from "./regexFeatures";

export default function RegexLegend({ currentLevel, isOpen, onClose }) {
  const availableFeatures = getAvailableFeatures(currentLevel);
  const availableIds = new Set(availableFeatures.map((f) => f.id));

  const colorClasses = {
    blue: "bg-blue-500/20 border-blue-500/50 text-blue-300",
    cyan: "bg-cyan-500/20 border-cyan-500/50 text-cyan-300",
    green: "bg-green-500/20 border-green-500/50 text-green-300",
    purple: "bg-purple-500/20 border-purple-500/50 text-purple-300",
    indigo: "bg-indigo-500/20 border-indigo-500/50 text-indigo-300",
    orange: "bg-orange-500/20 border-orange-500/50 text-orange-300",
    yellow: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
    pink: "bg-pink-500/20 border-pink-500/50 text-pink-300",
    red: "bg-red-500/20 border-red-500/50 text-red-300",
    teal: "bg-teal-500/20 border-teal-500/50 text-teal-300",
    emerald: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
    rose: "bg-rose-500/20 border-rose-500/50 text-rose-300",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-slate-900 rounded-2xl border border-slate-700/50 
                                 w-full max-w-4xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 
                                      px-6 py-4 flex items-center justify-between z-10"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 
                                              flex items-center justify-center"
                >
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Regex Pattern Guide
                  </h2>
                  <p className="text-sm text-slate-400">
                    Level {currentLevel} · {availableFeatures.length} features
                    unlocked
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6 custom-scrollbar">
              <div className="grid gap-4 md:grid-cols-2">
                {REGEX_FEATURES.map((feature, index) => {
                  const isUnlocked = availableIds.has(feature.id);
                  const Icon = feature.icon;

                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`
                                                relative overflow-hidden rounded-xl border transition-all
                                                ${
                                                  isUnlocked
                                                    ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                                                    : "bg-slate-900/50 border-slate-800/50 opacity-60"
                                                }
                                            `}
                    >
                      {/* Locked overlay */}
                      {!isUnlocked && (
                        <div
                          className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] 
                                                              flex items-center justify-center z-10"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Lock className="w-6 h-6 text-slate-600" />
                            <span className="text-xs text-slate-500 font-medium">
                              Unlocks at Level{" "}
                              {Math.ceil((feature.difficulty_score - 2) / 0.8)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-4">
                        {/* Header with icon */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`
                                                            w-10 h-10 rounded-lg border flex items-center justify-center
                                                            ${isUnlocked ? colorClasses[feature.color] : "bg-slate-800 border-slate-700 text-slate-600"}
                                                        `}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3
                                className={`font-semibold ${isUnlocked ? "text-white" : "text-slate-500"}`}
                              >
                                {feature.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-500">
                                  Difficulty: {feature.difficulty_score}
                                </span>
                                {isUnlocked && (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p
                          className={`text-sm mb-3 ${isUnlocked ? "text-slate-300" : "text-slate-600"}`}
                        >
                          {feature.description}
                        </p>

                        {/* Example */}
                        <div
                          className={`
                                                    rounded-lg border p-3 space-y-1.5
                                                    ${
                                                      isUnlocked
                                                        ? "bg-slate-900/50 border-slate-700/50"
                                                        : "bg-slate-950/50 border-slate-800/50"
                                                    }
                                                `}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 uppercase tracking-wider">
                              Example
                            </span>
                          </div>
                          <code
                            className={`
                                                        block font-mono text-sm
                                                        ${isUnlocked ? "text-cyan-300" : "text-slate-600"}
                                                    `}
                          >
                            /{feature.example}/g
                          </code>
                          <p
                            className={`text-xs ${isUnlocked ? "text-slate-400" : "text-slate-600"}`}
                          >
                            {feature.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer info */}
              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <p className="text-sm text-cyan-300">
                  💡 <strong>Tip:</strong> As you progress through levels, more
                  advanced regex features will unlock automatically. Practice
                  with simpler patterns first!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
