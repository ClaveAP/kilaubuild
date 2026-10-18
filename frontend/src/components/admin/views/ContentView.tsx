"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, Camera, HelpCircle, MessageSquareQuote } from "lucide-react";
import { getApiData } from "@/lib/api";
import { TestimoniesTab } from "./content/TestimoniesTab";
import { FaqsTab } from "./content/FaqsTab";
import { StatisticsTab } from "./content/StatisticsTab";
import { InstagramTab } from "./content/InstagramTab";
import type {
  FaqItem,
  InstagramPostItem,
  StatisticItem,
  TestimonyItem,
} from "../admin.types";

type ContentTab = "TESTIMONY" | "FAQ" | "STATS" | "INSTAGRAM";

export const ContentView = () => {
  const [activeTab, setActiveTab] = useState<ContentTab>("TESTIMONY");
  const [testimonies, setTestimonies] = useState<TestimonyItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);
  const [igPosts, setIgPosts] = useState<InstagramPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllContent = useCallback(async () => {
    setLoading(true);
    try {
      const [testRes, faqRes, statsRes, igRes] = await Promise.all([
        getApiData<TestimonyItem[]>("/testimonies"),
        getApiData<FaqItem[]>("/faqs"),
        getApiData<StatisticItem[]>("/statistics"),
        getApiData<InstagramPostItem[]>("/instagram-posts"),
      ]);
      setTestimonies(testRes || []);
      setFaqs(faqRes || []);
      setStatistics(statsRes || []);
      setIgPosts(igRes || []);
    } catch (err: unknown) {
      console.warn("Gagal memuat konten:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAllContent();
  }, [fetchAllContent]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#0A1E2F]">
          Manajemen Konten Publik
        </h2>
        <p className="mt-1 text-xs text-[#71818D]">
          Kelola ulasan klien, tanya jawab (FAQ), counter statistik, dan feed Instagram resmi KilauBuild.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#CBD8DF]">
        <button
          type="button"
          onClick={() => setActiveTab("TESTIMONY")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
            activeTab === "TESTIMONY"
              ? "border-[#005592] text-[#005592]"
              : "border-transparent text-[#71818D] hover:text-[#0A1E2F]"
          }`}
        >
          <MessageSquareQuote className="h-4 w-4" />
          <span>Testimoni Klien ({testimonies.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("FAQ")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
            activeTab === "FAQ"
              ? "border-[#005592] text-[#005592]"
              : "border-transparent text-[#71818D] hover:text-[#0A1E2F]"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>FAQ ({faqs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("STATS")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
            activeTab === "STATS"
              ? "border-[#005592] text-[#005592]"
              : "border-transparent text-[#71818D] hover:text-[#0A1E2F]"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Statistik Landing Page ({statistics.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("INSTAGRAM")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
            activeTab === "INSTAGRAM"
              ? "border-[#005592] text-[#005592]"
              : "border-transparent text-[#71818D] hover:text-[#0A1E2F]"
          }`}
        >
          <Camera className="h-4 w-4" />
          <span>Instagram Feed ({igPosts.length})</span>
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === "TESTIMONY" && (
        <TestimoniesTab
          testimonies={testimonies}
          loading={loading}
          onRefresh={fetchAllContent}
        />
      )}

      {activeTab === "FAQ" && (
        <FaqsTab
          faqs={faqs}
          loading={loading}
          onRefresh={fetchAllContent}
        />
      )}

      {activeTab === "STATS" && (
        <StatisticsTab
          statistics={statistics}
          loading={loading}
          onRefresh={fetchAllContent}
        />
      )}

      {activeTab === "INSTAGRAM" && (
        <InstagramTab
          posts={igPosts}
          loading={loading}
          onRefresh={fetchAllContent}
        />
      )}
    </div>
  );
};
