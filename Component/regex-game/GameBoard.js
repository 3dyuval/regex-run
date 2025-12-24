import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function GameBoard({ text, regex, targets }) {
  const highlightedText = useMemo(() => {
    if (!text) return null;

    let matches = [];

    // Find regex matches
    if (regex) {
      try {
        const re = new RegExp(regex, "g");
        let match;
        while ((match = re.exec(text)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            type: "regex",
          });
          // Prevent infinite loops with zero-length matches
          if (match[0].length === 0) break;
        }
      } catch (e) {
        // Invalid regex, ignore
      }
    }

    // Check which targets are matched
    const targetMatches = targets.map((target) => {
      return matches.some(
        (m) =>
          text.substring(m.start, m.end).includes(target.text) ||
          target.text.includes(text.substring(m.start, m.end)),
      );
    });

    // Build highlighted segments
    const segments = [];
    let lastIndex = 0;

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Merge overlapping matches
    const mergedMatches = [];
    for (const match of matches) {
      if (mergedMatches.length === 0) {
        mergedMatches.push({ ...match });
      } else {
        const last = mergedMatches[mergedMatches.length - 1];
        if (match.start <= last.end) {
          last.end = Math.max(last.end, match.end);
        } else {
          mergedMatches.push({ ...match });
        }
      }
    }

    for (const match of mergedMatches) {
      if (match.start > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, match.start),
          highlighted: false,
        });
      }
      segments.push({
        text: text.substring(match.start, match.end),
        highlighted: true,
      });
      lastIndex = match.end;
    }

    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        highlighted: false,
      });
    }

    return segments.length > 0 ? segments : [{ text, highlighted: false }];
  }, [text, regex, targets]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl" />
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-4 text-slate-500 text-sm font-mono">
            text.txt
          </span>
        </div>

        <div className="font-mono text-sm md:text-base leading-relaxed text-slate-300 max-h-[300px] overflow-y-auto custom-scrollbar">
          {highlightedText?.map((segment, index) =>
            segment.highlighted ? (
              <motion.span
                key={index}
                initial={{ backgroundColor: "rgba(34, 211, 238, 0)" }}
                animate={{ backgroundColor: "rgba(34, 211, 238, 0.3)" }}
                className="text-cyan-300 bg-cyan-500/30 rounded px-0.5 border-b-2 border-cyan-400"
              >
                {segment.text}
              </motion.span>
            ) : (
              <span key={index}>{segment.text}</span>
            ),
          )}
        </div>
      </div>
    </motion.div>
  );
}
