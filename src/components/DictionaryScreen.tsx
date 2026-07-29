"use client";

import { useState } from "react";
import { ALL_SIGNS, CATEGORIES } from "@/lib/isl-data";
import { t } from "@/lib/hi";

export function DictionaryScreen({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const query = search.toLowerCase();

  const filtered = ALL_SIGNS.filter((s) => {
    const matchCategory = category === "all" || s.category === category;
    const matchSearch = s.name.toLowerCase().includes(query) || s.meaning.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="btn-ghost text-xs">← {t("Back")}</button>
        <h2 className="font-bold text-surface-900 dark:text-white text-sm">ISL Dictionary</h2>
      </div>

      <div className="flex gap-2 mb-4" role="search">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={t("Search signs...")}
          className="input-field flex-1 text-xs"
          aria-label={t("Search signs...")}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="input-field text-xs w-auto"
          aria-label={t("Filter by category")}
        >
          <option value="all">{t("All Categories")}</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{t(c.name)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2" role="list" aria-label={t("Signs")}>
        {filtered.map((sign) => (
          <div key={sign.id} className="surface-card p-3.5 text-center hover:border-primary-500/30 transition-all cursor-pointer" role="listitem" aria-label={`${sign.name}: ${sign.meaning}`}>
            <span className="text-3xl block mb-1" role="img" aria-label={sign.name}>{sign.icon}</span>
            <p className="font-medium text-xs text-surface-900 dark:text-white truncate">{sign.name}</p>
            <p className="text-[10px] text-surface-500 truncate">{sign.meaning}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-surface-500 text-sm text-center py-8">{t("No results found")}</p>}
    </div>
  );
}
