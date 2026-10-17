"use client";

import React, { useEffect, useState } from "react";
import { getApiData } from "@/lib/api";
import { defaultStats, type StatisticItem } from "./landing-data";

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrame = requestAnimationFrame(() => setCurrentValue(targetNum));
      return () => cancelAnimationFrame(reducedMotionFrame);
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

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
    <span className="font-numeric">
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
    <div role="region" aria-label="KilauBuild dalam angka" className="mt-12 sm:mt-16">
      <div className="site-shell">
        <div className="rounded-[2rem] border border-[#005592]/30 bg-gradient-to-br from-[#092436] via-[#0A263B] to-[#061824] p-8 sm:p-10 text-white shadow-[0_16px_40px_-20px_rgba(9,36,54,0.3)]">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8CC9EC]">
              KilauBuild dalam Angka
            </span>
            <span className="text-xs text-slate-300">
              Depok &amp; Jabodetabek
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {stats.map((item, index) => (
              <div
                key={item.id}
                className={`flex flex-col justify-between ${
                  index > 0 ? "lg:border-l lg:border-white/15 lg:pl-8" : ""
                }`}
              >
                <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  <AnimatedCountUp value={item.value} />
                </div>
                <div className="mt-3 border-t border-white/15 pt-2.5">
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  {item.unit && <p className="mt-0.5 text-xs text-[#C8DFEC]">{item.unit}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
