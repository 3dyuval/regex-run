import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Trophy } from "lucide-react";

export default function SuccessModal({
  isOpen,
  level,
  score,
  pointsEarned,
  onNextLevel,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl 
                                 border border-slate-700/50 p-8 max-w-md w-full text-center overflow-hidden"
          >
            {/* Decorative elements */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 
                                      bg-gradient-to-b from-cyan-500/20 to-transparent rounded-full blur-3xl"
            />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative mx-auto w-20 h-20 mb-6"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 
                                          rounded-2xl rotate-6 opacity-50"
              />
              <div
                className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 
                                          rounded-2xl flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative text-3xl font-bold text-white mb-2"
            >
              Level Complete!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative text-slate-400 mb-6"
            >
              You've mastered level {level}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative flex items-center justify-center gap-3 mb-8"
            >
              <div className="px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
                <p className="text-emerald-400 text-2xl font-bold">
                  +{pointsEarned}
                </p>
                <p className="text-emerald-400/60 text-xs">points</p>
              </div>
              <div className="px-4 py-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 text-2xl font-bold">
                    {score}
                  </span>
                </div>
                <p className="text-yellow-400/60 text-xs">total score</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={onNextLevel}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 
                                         hover:from-cyan-400 hover:to-purple-400 text-white font-semibold
                                         py-6 rounded-xl transition-all shadow-lg shadow-purple-500/25"
              >
                Next Level
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
