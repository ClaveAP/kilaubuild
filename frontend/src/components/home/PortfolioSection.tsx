"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Pulse, Stack, X } from "@phosphor-icons/react";
import { getApiData, resolveMediaUrl } from "@/lib/api";
import {
  fallbackDoneProjects,
  fallbackOngoingProjects,
  type OngoingProject,
  type ProjectDone,
} from "./landing-data";

const getFirstAvailable = async <T,>(endpoints: string[]): Promise<T> => {
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      return await getApiData<T>(endpoint);
    } catch (error: unknown) {
      lastError = error;
    }
  }

  throw lastError;
};

export const PortfolioSection = () => {
  const [activeTab, setActiveTab] = useState<"done" | "ongoing">("done");
  const [doneProjects, setDoneProjects] = useState<ProjectDone[]>(fallbackDoneProjects);
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProject[]>(fallbackOngoingProjects);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeOngoingIndex, setActiveOngoingIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectDone | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [doneResponse, ongoingResponse] = await Promise.all([
          getFirstAvailable<ProjectDone[]>(["/project-dones", "/projects/done"]),
          getFirstAvailable<OngoingProject[]>(["/ongoing-projects", "/projects/ongoing"]),
        ]);

        if (doneResponse.length > 0) setDoneProjects(doneResponse);
        if (ongoingResponse.length > 0) setOngoingProjects(ongoingResponse);
      } catch (error: unknown) {
        console.warn("Gagal memuat portofolio backend, menggunakan foto lokal:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
        return;
      }

      if (event.key === "Tab") {
        const dialog = modalContainerRef.current;
        if (!dialog) return;

        const focusableElements = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [selectedProject]);

  const visibleProjectIndex = Math.min(activeProjectIndex, Math.max(doneProjects.length - 1, 0));
  const activeProject = doneProjects[visibleProjectIndex];
  const visibleOngoingIndex = Math.min(activeOngoingIndex, Math.max(ongoingProjects.length - 1, 0));
  const activeOngoingProject = ongoingProjects[visibleOngoingIndex];

  return (
    <section id="portofolio" className="scroll-mt-20 lg:scroll-mt-6 border-b border-[#CBD8DF] bg-[#FBFBFA] py-16 text-[#0A1E2F] sm:py-20 lg:py-24">
      <div className="site-shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between border-b border-[#CBD8DF] pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#005592]/15 bg-[#005592]/5 px-3.5 py-1 text-xs font-semibold text-[#005592]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#005592]" />
              <span>Portofolio &amp; Progres Lapangan</span>
            </div>
            <h2 className="mt-4 text-[clamp(2.1rem,3.4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] text-[#092436]">
              Lihat hasilnya. Ikuti <span className="font-serif italic font-normal text-[#005592]">prosesnya.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#526474]">
              Dokumentasi nyata proyek selesai dan pekerjaan fisik yang sedang berjalan aktif di Depok dan Jabodetabek.
            </p>
            <div className="inline-flex rounded-full border border-[#CBD8DF] bg-white p-1.5 shadow-xs" role="group" aria-label="Jenis portofolio">
              <button
                type="button"
                onClick={() => setActiveTab("done")}
                aria-pressed={activeTab === "done"}
                className={`flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold transition-all duration-300 ${
                  activeTab === "done" ? "bg-[#005592] text-white shadow-xs" : "text-[#526474] hover:text-[#092436]"
                }`}
              >
                <Stack size={16} weight="bold" aria-hidden="true" />
                Selesai (<span className="font-numeric">{doneProjects.length}</span>)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ongoing")}
                aria-pressed={activeTab === "ongoing"}
                className={`flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold transition-all duration-300 ${
                  activeTab === "ongoing" ? "bg-[#005592] text-white shadow-xs" : "text-[#526474] hover:text-[#092436]"
                }`}
              >
                <Pulse size={16} weight="bold" aria-hidden="true" />
                Sedang Berjalan (<span className="font-numeric">{ongoingProjects.length}</span>)
              </button>
            </div>
          </div>
        </div>

        {activeTab === "done" ? (
          <div className="mt-8 lg:mt-10">
            {activeProject ? (
              <div
                role="region"
                aria-roledescription="carousel"
                aria-label="Proyek selesai"
                className="outline-none focus-visible:ring-2 focus-visible:ring-[#005592]"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    event.preventDefault();
                    setActiveProjectIndex((current) => Math.min(Math.max(current + (event.key === "ArrowRight" ? 1 : -1), 0), doneProjects.length - 1));
                  }
                }}
              >
                <article key={activeProject.id} className="grid gap-8 rounded-[2rem] border border-[#E2ECF2] bg-white p-6 sm:p-9 shadow-[0_12px_36px_-16px_rgba(0,68,117,0.08)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-12">
                  <div
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget as unknown as HTMLButtonElement;
                      setSelectedProject(activeProject);
                    }}
                    className="group/img relative h-[270px] cursor-pointer overflow-hidden rounded-2xl bg-[#EBF4FA] sm:h-[340px] lg:h-[clamp(300px,42svh,440px)]"
                  >
                    <Image
                      src={resolveMediaUrl(activeProject.coverImage, "/header.png")}
                      alt={activeProject.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover transition-transform duration-700 group-hover/img:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[#005592]/0 transition-colors duration-300 group-hover/img:bg-[#005592]/15" />
                    <span className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#005592] shadow-sm backdrop-blur-md transition-transform duration-300 group-hover/img:scale-105">
                      Lihat Foto ({activeProject.gallery?.length || 1})
                      <ArrowUpRight size={13} weight="bold" />
                    </span>
                  </div>

                  <div className="max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF4FA] px-3 py-1 text-xs font-bold text-[#005592]">
                        <Stack size={14} weight="bold" aria-hidden="true" />
                        {activeProject.category}
                      </span>
                      <span className="rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Proyek Selesai
                      </span>
                    </div>

                    <h3 aria-live="polite" className="mt-4 text-2xl font-bold tracking-tight text-[#092436] sm:text-3xl lg:text-4xl">
                      {activeProject.title}
                    </h3>

                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#526474]">
                      {activeProject.description || "Hasil pekerjaan konstruksi dan interior yang telah selesai diserahterimakan dengan berita acara fisik lengkap."}
                    </p>

                    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#E2ECF2] bg-[#F8FBFD] p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="text-xs font-semibold text-[#526474]">Lingkup Pekerjaan</span>
                        <p className="mt-1 text-base font-bold text-[#092436]">{activeProject.budgetRange || activeProject.category}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          triggerRef.current = event.currentTarget;
                          setSelectedProject(activeProject);
                        }}
                        className="group inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-full bg-[#005592] pl-5 pr-2 py-1.5 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] active:scale-[0.98]"
                      >
                        <span>Buka Dokumentasi</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                          <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                        </span>
                      </button>
                    </div>
                  </div>
                </article>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="text-xs sm:text-sm font-semibold text-[#526474]" aria-live="polite">
                    Proyek <span className="font-numeric text-[#005592]">{String(visibleProjectIndex + 1).padStart(2, "0")} / {String(doneProjects.length).padStart(2, "0")}</span>
                  </p>
                  {doneProjects.length > 1 && (
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        disabled={visibleProjectIndex === 0}
                        onClick={() => setActiveProjectIndex(visibleProjectIndex - 1)}
                        className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-[#CBD8DF] bg-white py-1 pl-1.5 pr-4 text-xs font-bold text-[#092436] transition-all hover:border-[#005592]/30 hover:bg-[#F8FBFD] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF3F8] text-[#005592] transition-transform duration-300 group-hover:-translate-x-0.5">
                          <ArrowLeft size={13} weight="bold" aria-hidden="true" />
                        </span>
                        <span>Sebelumnya</span>
                      </button>
                      <button
                        type="button"
                        disabled={visibleProjectIndex === doneProjects.length - 1}
                        onClick={() => setActiveProjectIndex(visibleProjectIndex + 1)}
                        className="group inline-flex min-h-10 items-center gap-2 rounded-full bg-[#005592] py-1 pl-4 pr-1.5 text-xs font-bold text-white transition-all hover:bg-[#0066AE] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span>Berikutnya</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                          <ArrowRight size={13} weight="bold" aria-hidden="true" />
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="py-16 text-center text-[#526474]">Belum ada proyek selesai untuk ditampilkan.</p>
            )}
          </div>
        ) : (
          <div className="mt-8 lg:mt-10">
            {activeOngoingProject ? (
              <div
                role="region"
                aria-roledescription="carousel"
                aria-label="Proyek yang sedang berjalan"
                className="outline-none focus-visible:ring-2 focus-visible:ring-[#005592]"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    event.preventDefault();
                    setActiveOngoingIndex((current) => Math.min(Math.max(current + (event.key === "ArrowRight" ? 1 : -1), 0), ongoingProjects.length - 1));
                  }
                }}
              >
                <article key={activeOngoingProject.id} className="grid gap-8 rounded-[2rem] border border-[#E2ECF2] bg-white p-6 sm:p-9 shadow-[0_12px_36px_-16px_rgba(0,68,117,0.08)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-12">
                  <div className="relative h-[270px] overflow-hidden rounded-2xl bg-[#EBF4FA] sm:h-[340px] lg:h-[clamp(300px,42svh,440px)]">
                    <Image
                      src={resolveMediaUrl(activeOngoingProject.imageUrl, "/on going project.png")}
                      alt={activeOngoingProject.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    />
                  </div>
                  <div className="max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF4FA] px-3 py-1 text-xs font-bold text-[#005592]">
                        <MapPin size={14} weight="bold" aria-hidden="true" />
                        {activeOngoingProject.location}
                      </span>
                      <span className="rounded-full border border-[#005592]/20 px-3 py-1 text-xs font-semibold text-[#005592]">
                        Progres Lapangan Aktif
                      </span>
                    </div>
                    <h3 aria-live="polite" className="mt-4 text-2xl font-bold tracking-tight text-[#092436] sm:text-3xl lg:text-4xl">{activeOngoingProject.title}</h3>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#526474]">
                      {activeOngoingProject.description || "Pengerjaan fisik berjalan sesuai tahap yang disepakati."}
                    </p>
                    <div className="mt-6 rounded-2xl border border-[#E2ECF2] bg-[#F8FBFD] p-5">
                      {activeOngoingProject.id.startsWith("fallback-") ? (
                        <div>
                          <span className="text-xs font-semibold text-[#526474]">Status dokumentasi</span>
                          <p className="mt-1 text-lg font-bold text-[#092436]">Tahap konstruksi aktif</p>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-end justify-between gap-4">
                            <span className="text-xs font-semibold text-[#526474]">Progres fisik lapangan</span>
                            <strong className="font-numeric text-2xl font-bold text-[#005592]">{activeOngoingProject.progressPercentage}%</strong>
                          </div>
                          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-[#CBD8DF]/60" aria-hidden="true">
                            <div className="h-full rounded-full bg-[#005592] transition-all duration-500" style={{ width: `${activeOngoingProject.progressPercentage}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="text-xs sm:text-sm font-semibold text-[#526474]" aria-live="polite">
                    Proyek <span className="font-numeric text-[#005592]">{String(visibleOngoingIndex + 1).padStart(2, "0")} / {String(ongoingProjects.length).padStart(2, "0")}</span>
                  </p>
                  {ongoingProjects.length > 1 && (
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        disabled={visibleOngoingIndex === 0}
                        onClick={() => setActiveOngoingIndex(visibleOngoingIndex - 1)}
                        className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-[#CBD8DF] bg-white py-1 pl-1.5 pr-4 text-xs font-bold text-[#092436] transition-all hover:border-[#005592]/30 hover:bg-[#F8FBFD] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF3F8] text-[#005592] transition-transform duration-300 group-hover:-translate-x-0.5">
                          <ArrowLeft size={13} weight="bold" aria-hidden="true" />
                        </span>
                        <span>Sebelumnya</span>
                      </button>
                      <button
                        type="button"
                        disabled={visibleOngoingIndex === ongoingProjects.length - 1}
                        onClick={() => setActiveOngoingIndex(visibleOngoingIndex + 1)}
                        className="group inline-flex min-h-10 items-center gap-2 rounded-full bg-[#005592] py-1 pl-4 pr-1.5 text-xs font-bold text-white transition-all hover:bg-[#0066AE] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span>Berikutnya</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                          <ArrowRight size={13} weight="bold" aria-hidden="true" />
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="py-16 text-center text-[#526474]">Belum ada proyek berjalan untuk ditampilkan.</p>
            )}
          </div>
        )}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#03101A]/88 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelectedProject(null);
          }}
        >
          <div
            ref={modalContainerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-gallery-title"
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-5 text-[#0A1E2F] shadow-[0_30px_90px_rgba(0,0,0,0.4)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-6 border-b border-[#CBD8DF] pb-5">
              <div>
                <p className="text-sm font-bold text-[#005592]">{selectedProject.category}</p>
                <h3 id="project-gallery-title" className="mt-2 text-2xl font-bold sm:text-3xl">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedProject(null)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3F8] text-[#004475] transition-colors hover:bg-[#DCECF5]"
                aria-label="Tutup galeri"
              >
                <X size={20} weight="bold" aria-hidden="true" />
              </button>
            </div>

            {selectedProject.description && (
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#526474]">{selectedProject.description}</p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {selectedProject.gallery && selectedProject.gallery.length > 0 ? (
                selectedProject.gallery.map((image) => (
                  <figure key={image.id} className="overflow-hidden rounded-xl border border-[#CBD8DF] bg-[#EAF3F8]">
                    <div className="relative min-h-64">
                      <Image
                        src={resolveMediaUrl(image.imageUrl, selectedProject.coverImage || "/header.png")}
                        alt={image.caption || selectedProject.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    {image.caption && <figcaption className="px-4 py-3 text-xs text-[#526474]">{image.caption}</figcaption>}
                  </figure>
                ))
              ) : (
                <div className="relative min-h-80 overflow-hidden rounded-xl bg-[#EAF3F8] sm:col-span-2">
                  <Image
                    src={resolveMediaUrl(selectedProject.coverImage, "/header.png")}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 960px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
