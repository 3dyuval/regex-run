import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegexInput({
  value,
  onChange,
  isValid,
  matchCount,
  onSubmit,
}) {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!value) {
      setError(null);
      return;
    }
    try {
      new RegExp(value);
      setError(null);
    } catch (e) {
      setError("Invalid regex syntax");
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !error && value) {
      onSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3"
    >
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          <span className="text-slate-500 font-mono">/</span>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="enter your regex..."
          className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl 
                             py-4 pl-16 pr-20 font-mono text-lg text-cyan-300 
                             placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50
                             focus:ring-2 focus:ring-cyan-500/20 transition-all"
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className="text-slate-500 font-mono">/g</span>
          {value && !error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`px-2 py-1 rounded-md text-xs font-mono ${
                matchCount > 0
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-slate-700/50 text-slate-400"
              }`}
            >
              {matchCount} match{matchCount !== 1 ? "es" : ""}
            </motion.div>
          )}
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      {isValid && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-emerald-400 text-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          All targets matched! Press Enter to continue
        </motion.div>
      )}
    </motion.div>
  );
}
