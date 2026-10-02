"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Activity, ArrowUpRight, Layers3, MapPin, X } from "lucide-react";
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
  const [selectedProject, setSelectedProject] = useState<ProjectDone | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

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
      if (event.key === "Escape") setSelectedProject(null);
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

  return (
    <section id="portofolio" className="bg-[#071A2B] py-20 text-white sm:py-28">
      <div className="site-shell">
        <div className="grid gap-9 border-b border-white/20 pb-10 lg:grid-cols-12 lg:items-end">
          <h2 className="section-heading text-white lg:col-span-7">Lihat hasilnya. Ikuti prosesnya.</h2>
          <div className="lg:col-span-5">
            <p className="max-w-xl text-base leading-7 text-[#C8DCE8]">
              Galeri ini memuat proyek selesai dan progres yang sedang berjalan. Buka tiap proyek untuk melihat dokumentasinya.
            </p>
            <div className="mt-7 inline-grid grid-cols-2 rounded-xl border border-white/25 p-1" role="group" aria-label="Jenis portofolio">
              <button
                type="button"
                onClick={() => setActiveTab("done")}
                aria-pressed={activeTab === "done"}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition-colors ${
                  activeTab === "done" ? "bg-white text-[#004475]" : "text-white hover:bg-white/10"
                }`}
              >
                <Layers3 className="h-4 w-4" aria-hidden="true" />
                Selesai (<span className="font-numeric">{doneProjects.length}</span>)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ongoing")}
                aria-pressed={activeTab === "ongoing"}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition-colors ${
                  activeTab === "ongoing" ? "bg-white text-[#004475]" : "text-white hover:bg-white/10"
                }`}
              >
                <Activity className="h-4 w-4" aria-hidden="true" />
                Berjalan (<span className="font-numeric">{ongoingProjects.length}</span>)
              </button>
            </div>
          </div>
        </div>

        {activeTab === "done" ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
            {doneProjects.map((project, index) => {
              const featured = index === 0;

              return (
                <button
                  type="button"
                  key={project.id}
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    setSelectedProject(project);
                  }}
                  className={`group relative min-h-[390px] overflow-hidden rounded-2xl bg-[#173247] text-left md:min-h-[470px] ${
                    featured ? "md:col-span-2 lg:col-span-7 lg:min-h-[610px]" : "lg:col-span-5"
                  }`}
                  aria-label={`Buka galeri ${project.title}`}
                >
                  <Image
                    src={resolveMediaUrl(project.coverImage, "/header.png")}
                    alt=""
                    fill
                    sizes={featured ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 50vw, 42vw"}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/95 via-[#071A2B]/12 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <div className="mb-3 flex items-center justify-between gap-4 text-xs font-semibold text-[#B9D8E9]">
                      <span>{project.category}</span>
                      <span>{project.budgetRange || "RAB sesuai lingkup"}</span>
                    </div>
                    <h3 className={`font-bold leading-tight text-white ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/78">{project.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                      Buka dokumentasi
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 border-y border-white/20">
            {ongoingProjects.map((project, index) => (
              <article
                key={project.id}
                className={`grid gap-6 py-7 sm:grid-cols-[14rem_1fr] sm:items-center lg:grid-cols-[19rem_1fr_auto] ${
                  index > 0 ? "border-t border-white/20" : ""
                }`}
              >
                <div className="relative min-h-48 overflow-hidden rounded-xl bg-[#173247] sm:min-h-40">
                  <Image
                    src={resolveMediaUrl(project.imageUrl, "/on going project.png")}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 304px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[#B9D8E9]">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {project.location}
                    </span>
                    <span>Proyek berjalan</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-white">{project.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C8DCE8]">
                    {project.description || "Pengerjaan fisik berjalan sesuai tahap yang disepakati."}
                  </p>
                </div>
                {project.id.startsWith("fallback-") ? (
                  <div className="min-w-48 border-l border-white/20 pl-5">
                    <span className="text-xs font-semibold text-[#B9D8E9]">Status dokumentasi</span>
                    <p className="mt-2 text-lg font-bold text-white">Tahap aktif</p>
                  </div>
                ) : (
                  <div className="min-w-48">
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-xs font-semibold text-[#B9D8E9]">Progres fisik</span>
                      <strong className="font-numeric text-3xl font-bold text-white">{project.progressPercentage}%</strong>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
                      <div className="h-full rounded-full bg-[#66B2E0]" style={{ width: `${project.progressPercentage}%` }} />
                    </div>
                  </div>
                )}
              </article>
            ))}
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
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3F8] text-[#004475] transition-colors hover:bg-[#DCECF5]"
                aria-label="Tutup galeri"
              >
                <X className="h-5 w-5" aria-hidden="true" />
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
