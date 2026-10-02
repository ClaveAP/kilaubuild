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
    <section aria-label="KilauBuild dalam angka" className="bg-[#004475] text-white">
      <div className="site-shell">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.id}
              className="flex min-h-48 flex-col justify-between border-white/18 px-5 py-7 even:border-l sm:min-h-56 sm:px-7 sm:py-9 lg:border-l lg:first:border-l-0"
            >
              <div className="text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                <AnimatedCountUp value={item.value} />
              </div>
              <div className="mt-8 border-t border-white/20 pt-4">
                <p className="text-sm font-bold text-white">{item.title}</p>
                {item.unit && <p className="mt-1 text-xs leading-5 text-[#C8DFEC]">{item.unit}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
