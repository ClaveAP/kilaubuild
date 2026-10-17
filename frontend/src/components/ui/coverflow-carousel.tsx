"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { KeyboardEvent } from "react";

export interface CoverflowItem {
  id: string;
  image: string;
  alt: string;
  title: string;
}

interface CoverflowCarouselProps {
  items: CoverflowItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onOpen: (index: number, trigger: HTMLButtonElement) => void;
}

export const CoverflowCarousel = ({ items, index, onIndexChange, onOpen }: CoverflowCarouselProps) => {
  const reduceMotion = useReducedMotion();
  const total = items.length;

  const goTo = (next: number) => {
    if (total > 0) onIndexChange((next + total) % total);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index + (event.key === "ArrowRight" ? 1 : -1));
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Galeri proyek selesai"
      className="relative w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#005592]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ perspective: reduceMotion ? undefined : 1200 }}
    >
      <motion.div
        className="relative mx-auto flex h-[clamp(280px,39svh,420px)] items-center justify-center sm:h-[clamp(320px,42svh,470px)]"
        drag={total > 1 && !reduceMotion ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 75 || Math.abs(info.velocity.x) > 500) {
            goTo(index + (info.offset.x < 0 ? 1 : -1));
          }
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((item, itemIndex) => {
          const rawOffset = itemIndex - index;
          const offset = rawOffset > total / 2 ? rawOffset - total : rawOffset < -total / 2 ? rawOffset + total : rawOffset;
          const active = offset === 0;

          return (
            <motion.button
              key={item.id}
              type="button"
              aria-label={active ? `Buka galeri ${item.title}` : `Tampilkan ${item.title}`}
              aria-current={active ? "true" : undefined}
              aria-hidden={Math.abs(offset) > 1}
              tabIndex={active ? 0 : -1}
              onClick={(event) => active ? onOpen(itemIndex, event.currentTarget) : onIndexChange(itemIndex)}
              animate={{
                x: offset * 260,
                z: reduceMotion ? 0 : -Math.abs(offset) * 150,
                rotateY: reduceMotion ? 0 : -offset * 38,
                scale: Math.max(1 - Math.abs(offset) * 0.16, 0.68),
                opacity: Math.abs(offset) > 1 ? 0 : 1,
              }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 230, damping: 27 }}
              className="absolute h-[clamp(250px,36svh,390px)] w-[min(78vw,600px)] overflow-hidden rounded-2xl bg-[#D9E7EF] shadow-[0_20px_45px_rgba(0,68,117,0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005592] sm:h-[clamp(290px,39svh,440px)]"
              style={{ zIndex: total - Math.abs(offset), pointerEvents: Math.abs(offset) > 1 ? "none" : "auto" }}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 78vw, 600px"
                className="object-cover"
                draggable={false}
              />
              {!active && <span className="absolute inset-0 bg-[#0A1E2F]/20" aria-hidden="true" />}
            </motion.button>
          );
        })}
      </motion.div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-5 pb-1">
          <button type="button" onClick={() => goTo(index - 1)} aria-label="Proyek sebelumnya" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#9DB3BF] bg-white text-[#004475] transition-colors hover:bg-[#DCECF5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005592]">
            <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          </button>
          <span className="font-numeric text-sm font-semibold text-[#004475]" aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <button type="button" onClick={() => goTo(index + 1)} aria-label="Proyek berikutnya" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#9DB3BF] bg-white text-[#004475] transition-colors hover:bg-[#DCECF5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005592]">
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
