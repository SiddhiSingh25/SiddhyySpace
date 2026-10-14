"use client";

import { useState, useMemo } from "react";
import { FAQ_DATA, FaqItem } from "../data/faqData";
import { Search, ChevronDown, Sparkles, Check, Link as LinkIcon, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  "All",
  "About",
  "Recommendations & Affiliates",
  "Trust & Policies",
  "Contact",
] as const;

type CategoryType = (typeof CATEGORIES)[number];

export function FaqAccordion() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [openIds, setOpenIds] = useState<number[]>([1]); // First item open by default
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleItem = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(filteredFaqs.map((f) => f.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  const handleCopyLink = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#faq-${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Search & Actions Bar */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search questions or keywords (e.g. affiliate, Siddhi Singh, products)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-surface/70 py-3.5 pl-12 pr-10 text-sm text-foreground placeholder:text-muted/70 transition-all focus:border-link focus:bg-background focus:outline-none focus:ring-2 focus:ring-link/20 shadow-sm"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted hover:text-foreground"
              aria-label="Clear search"
            >
              Clear
            </button>
          ) : null}
        </div>

        {/* Category Pills & Bulk Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? FAQ_DATA.length
                  : FAQ_DATA.filter((item) => item.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-foreground text-background shadow-sm"
                      : "border border-border bg-surface/50 text-muted hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected
                        ? "bg-background/20 text-background"
                        : "bg-muted/15 text-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <button
              onClick={expandAll}
              className="hover:text-foreground hover:underline"
            >
              Expand all
            </button>
            <span>•</span>
            <button
              onClick={collapseAll}
              className="hover:text-foreground hover:underline"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Items List */}
      {filteredFaqs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/30 p-12 text-center">
          <HelpCircle className="mx-auto h-10 w-10 text-muted/60" />
          <h3 className="mt-4 font-display text-lg font-medium text-foreground">
            No matching questions found
          </h3>
          <p className="mt-1 text-sm text-muted">
            We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try adjusting your keywords or clearing filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                id={`faq-${faq.id}`}
                className={`group rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-link/30 bg-surface/90 shadow-sm"
                    : "border-border/80 bg-surface/40 hover:border-border hover:bg-surface/70"
                }`}
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-link rounded-2xl"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-xs font-semibold text-foreground/80 mt-0.5">
                      {String(faq.id).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="font-display text-base font-medium tracking-tight text-foreground sm:text-lg">
                        {faq.question}
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-block rounded-md bg-muted/10 px-2 py-0.5 text-[11px] font-medium text-muted">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(faq.id, e)}
                      title="Copy question link"
                      aria-label="Copy question link"
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted hover:text-foreground hover:bg-background/80 transition-all"
                    >
                      {copiedId === faq.id ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <LinkIcon className="h-4 w-4" />
                      )}
                    </button>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180 bg-foreground text-background"
                          : "bg-surface border border-border text-muted group-hover:text-foreground"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1 sm:pl-[3.75rem]">
                        <p className="text-sm leading-relaxed text-muted sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful bottom CTA */}
      <div className="mt-12 rounded-3xl border border-border/80 bg-gradient-to-br from-surface to-primary/10 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-link uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Have More Questions?</span>
          </div>
          <h3 className="font-display text-xl font-medium text-foreground">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-sm text-muted max-w-xl">
            Siddhi Singh is always open to feedback, brand partnerships, or answering queries about recommendations and lifestyle guides.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <a
            href="/#about"
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-medium text-foreground shadow-sm hover:border-foreground/30 hover:bg-surface transition-all"
          >
            About Siddhi
          </a>
          <a
            href="mailto:singhsiddhi960@gmail.com"
            className="rounded-xl bg-foreground px-4 py-2.5 text-xs font-medium text-background hover:bg-foreground/90 shadow-sm transition-all"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
