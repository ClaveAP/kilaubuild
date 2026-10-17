"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

interface PublicPageShellProps {
  children: ReactNode;
}

export const PublicPageShell = ({ children }: PublicPageShellProps) => {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          id="main-content"
          initial={reduceMotion ? false : { opacity: 0, y: 14, clipPath: "inset(0 0 2% 0)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen overflow-hidden bg-white pt-[72px] lg:ml-[244px] lg:pt-0"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <div className="lg:ml-[244px]">
        <Footer />
      </div>
    </>
  );
};
