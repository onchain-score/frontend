"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "./providers/LanguageProvider";
import { LOCALES } from "@/lib/i18n";

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LOCALES.find((l) => l.code === locale)!;

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-1.5 px-3 py-1.5
          rounded-lg border border-border
          text-text-dim text-xs font-medium
          hover:border-primary/30 hover:text-text
          transition-all duration-200
        "
      >
        <Globe className="w-3.5 h-3.5" />
        {current.flag} {current.label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="
              absolute right-0 top-full mt-2 w-40
              rounded-xl border border-border bg-surface
              shadow-xl shadow-black/40 overflow-hidden
            "
          >
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLocale(l.code); setOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5
                  text-sm transition-colors duration-150
                  ${locale === l.code
                    ? "bg-primary/10 text-primary"
                    : "text-text-dim hover:bg-elevated hover:text-text"}
                `}
              >
                <span>{l.flag}</span>
                <span className="flex-1 text-left">{l.label}</span>
                {locale === l.code && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
