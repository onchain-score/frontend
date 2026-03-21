"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import { useLanguage } from "./providers/LanguageProvider";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null),
    );

    return () => subscription.unsubscribe();
  }, []);

  // Supabase 미설정 시 숨김
  if (!isSupabaseConfigured()) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-text-muted text-xs hidden sm:block">
          {user.email?.split("@")[0]}
        </span>
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-muted hover:text-danger border border-border hover:border-danger/30 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          {t("auth.logout")}
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-dim hover:text-primary border border-border hover:border-primary/30 rounded-lg transition-all duration-200"
    >
      <LogIn className="w-3.5 h-3.5" />
      {t("auth.login")}
    </Link>
  );
}
