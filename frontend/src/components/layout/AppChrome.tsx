"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

interface AppChromeProps {
  children: ReactNode;
}

export const AppChrome = ({ children }: AppChromeProps) => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return children;

  return <PublicPageShell>{children}</PublicPageShell>;
};
