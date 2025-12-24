import React from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Circle } from "lucide-react";

export default function TargetDisplay({ targets, matchedTargets }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/50 p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-purple-400" />
        <h3 className="text-slate-300 font-medium">Find these patterns</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {targets.map((target, index) => {
          const isMatched = matchedTargets.includes(index);
          return (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`
                                relative flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm
                                transition-all duration-300
                                ${
                                  isMatched
                                    ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"
                                    : "bg-slate-800/80 border border-slate-600/50 text-slate-300"
                                }
                            `}
            >
              {isMatched ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-slate-500" />
              )}
              <span className={isMatched ? "line-through opacity-60" : ""}>
                "{target.text}"
              </span>
              {isMatched && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Tip: Write a single regex that matches all {targets.length} patterns
      </div>
    </motion.div>
  );
}
