import React from "react";
import { motion } from "framer-motion";
import { Zap, Trophy, Star } from "lucide-react";

export default function LevelIndicator({ level, score, streak }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full" />
            <div
              className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 
                                      rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25"
            >
              <span className="text-white font-bold text-lg">{level}</span>
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider">
              Level
            </p>
            <p className="text-white font-semibold">Challenge {level}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 
                                 border border-orange-500/30 rounded-full"
          >
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 font-medium text-sm">
              {streak}x streak
            </span>
          </motion.div>
        )}

        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-slate-500 text-xs">Score</p>
            <motion.p
              key={score}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-white font-bold text-lg"
            >
              {score.toLocaleString()}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
