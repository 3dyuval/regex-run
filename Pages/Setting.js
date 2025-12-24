import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Check, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { REGEX_FEATURES } from "@/components/regex-game/regexFeatures";

const PRESETS = {
  beginner: { name: "Beginner", maxDifficulty: 3 },
  intermediate: { name: "Intermediate", maxDifficulty: 6 },
  advanced: { name: "Advanced", maxDifficulty: 9 },
  all: { name: "All Features", maxDifficulty: 10 },
};

export default function Settings() {
  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    const saved = localStorage.getItem("regexGameFeatures");
    if (saved) {
      return JSON.parse(saved);
    }
    // Default: features with difficulty <= 5
    return REGEX_FEATURES.filter((f) => f.difficulty_score <= 5).map(
      (f) => f.id,
    );
  });

  const [preset, setPreset] = useState("intermediate");

  useEffect(() => {
    localStorage.setItem("regexGameFeatures", JSON.stringify(selectedFeatures));
  }, [selectedFeatures]);

  const handlePresetChange = (value) => {
    setPreset(value);
    if (value === "custom") return;

    const maxDiff = PRESETS[value].maxDifficulty;
    const features = REGEX_FEATURES.filter(
      (f) => f.difficulty_score <= maxDiff,
    ).map((f) => f.id);
    setSelectedFeatures(features);
  };

  const toggleFeature = (featureId) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(featureId)) {
        return prev.filter((id) => id !== featureId);
      }
      return [...prev, featureId];
    });
    setPreset("custom");
  };

  const toggleAll = () => {
    if (selectedFeatures.length === REGEX_FEATURES.length) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(REGEX_FEATURES.map((f) => f.id));
    }
    setPreset("custom");
  };

  const colorClasses = {
    blue: "border-blue-500/30 bg-blue-500/10",
    cyan: "border-cyan-500/30 bg-cyan-500/10",
    green: "border-green-500/30 bg-green-500/10",
    purple: "border-purple-500/30 bg-purple-500/10",
    indigo: "border-indigo-500/30 bg-indigo-500/10",
    orange: "border-orange-500/30 bg-orange-500/10",
    yellow: "border-yellow-500/30 bg-yellow-500/10",
    pink: "border-pink-500/30 bg-pink-500/10",
    red: "border-red-500/30 bg-red-500/10",
    teal: "border-teal-500/30 bg-teal-500/10",
    emerald: "border-emerald-500/30 bg-emerald-500/10",
    rose: "border-rose-500/30 bg-rose-500/10",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("RegexGame")}>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Game Settings
                </h1>
                <p className="text-slate-400 text-sm">
                  Customize your regex learning experience
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preset Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold mb-1">Feature Preset</h3>
              <p className="text-slate-400 text-sm">
                Quick select features by difficulty level
              </p>
            </div>
            <Button
              onClick={toggleAll}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              {selectedFeatures.length === REGEX_FEATURES.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>
          <Select value={preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-full bg-slate-800/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">
                Beginner (Basic patterns)
              </SelectItem>
              <SelectItem value="intermediate">
                Intermediate (Includes quantifiers)
              </SelectItem>
              <SelectItem value="advanced">Advanced (Most features)</SelectItem>
              <SelectItem value="all">All Features (Expert mode)</SelectItem>
              {preset === "custom" && (
                <SelectItem value="custom">Custom Selection</SelectItem>
              )}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Feature List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
            <span>Available Features</span>
            <span className="text-sm text-slate-400">
              {selectedFeatures.length} / {REGEX_FEATURES.length} selected
            </span>
          </h3>

          <div className="space-y-3">
            {REGEX_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const isSelected = selectedFeatures.includes(feature.id);

              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => toggleFeature(feature.id)}
                  className={`
                                        flex items-start gap-4 p-4 rounded-lg border cursor-pointer
                                        transition-all duration-200
                                        ${
                                          isSelected
                                            ? `${colorClasses[feature.color]} border-l-4`
                                            : "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50"
                                        }
                                    `}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleFeature(feature.id)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 text-${feature.color}-400`} />
                      <h4 className="text-white font-medium">{feature.name}</h4>
                      <span className="px-2 py-0.5 text-xs bg-slate-700/50 text-slate-300 rounded">
                        Level {feature.difficulty_score}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <code className="px-2 py-1 bg-slate-950/50 text-cyan-300 rounded font-mono">
                        {feature.example}
                      </code>
                      <span className="text-slate-500">→</span>
                      <span className="text-slate-400">
                        {feature.explanation}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Save Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-slate-500 text-sm flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Your preferences are automatically saved
        </motion.div>
      </div>
    </div>
  );
}
