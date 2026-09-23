"use client";

import React, { useEffect, useState } from "react";
import { getApiData } from "@/lib/api";
import { defaultStats, type StatisticItem } from "./landing-data";

// Animated Count-Up component with smooth cubic ease-out
const AnimatedCountUp: React.FC<{ value: string; duration?: number }> = ({
  value,
  duration = 1800,
}) => {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  const prefix = match ? match[1] : "";
  const targetNum = match ? parseFloat(match[2]) : null;
  const suffix = match ? match[3] : "";

  const [currentValue, setCurrentValue] = useState<number>(0);

  useEffect(() => {
    if (targetNum === null || isNaN(targetNum)) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Easing cubic ease-out: 1 - (1 - t)^3
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * targetNum);

      setCurrentValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetNum);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetNum, duration]);

  if (targetNum === null) {
    return <span>{value}</span>;
  }

  return (
    <span className="tabular-nums font-serif">
      {prefix}
      {currentValue}
      {suffix}
    </span>
  );
};

export const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<StatisticItem[]>(defaultStats);
  const [, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getApiData<StatisticItem[]>("/statistics");
        if (data.length > 0) {
          setStats(data);
        }
      } catch (err: unknown) {
        console.warn("Gagal memuat statistik langsung, menggunakan nilai default:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="w-full pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Soft-Tinted Cards Grid (Exact RooFix Reference Aesthetic) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-[#EBF4FA] hover:bg-[#E2EEF7] rounded-3xl p-6 sm:p-8 text-center border border-blue-100/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-center items-center"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-normal text-slate-900 tracking-tight mb-2">
                <AnimatedCountUp value={item.value} />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700">
                {item.title}
              </div>
              {item.unit && (
                <div className="text-[11px] text-slate-500 mt-1 font-normal">
                  {item.unit}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
