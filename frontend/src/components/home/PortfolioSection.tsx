"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getApiData, resolveMediaUrl } from "@/lib/api";
import { ArrowUpRight, MapPin, X, Layers, Activity } from "lucide-react";
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
    } catch (err: unknown) {
      lastError = err;
    }
  }

  throw lastError;
};

export const PortfolioSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"done" | "ongoing">("done");
  const [doneProjects, setDoneProjects] = useState<ProjectDone[]>(fallbackDoneProjects);
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProject[]>(fallbackOngoingProjects);
  const [selectedProject, setSelectedProject] = useState<ProjectDone | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [doneRes, ongoingRes] = await Promise.all([
          getFirstAvailable<ProjectDone[]>(["/project-dones", "/projects/done"]),
          getFirstAvailable<OngoingProject[]>(["/ongoing-projects", "/projects/ongoing"]),
        ]);
        if (doneRes.length > 0) setDoneProjects(doneRes);
        if (ongoingRes.length > 0) setOngoingProjects(ongoingRes);
      } catch (err: unknown) {
        console.warn("Gagal memuat portofolio backend, menggunakan foto lokal:", err);
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

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <section id="portofolio" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FA] text-[#005592] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#66B2E0]/30">
            Portofolio Terverifikasi
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Portofolio & Bukti Pengerjaan <span className="text-[#005592]">Nyata</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Integritas KilauBuild dibuktikan melalui dokumentasi transparan dari proyek yang telah selesai maupun yang sedang berlangsung di lapangan.
          </p>

          {/* Capsule Tab Selector (Like Header & Navbar) */}
          <div className="inline-flex p-1.5 bg-slate-200/60 backdrop-blur-sm rounded-full mt-8 border border-slate-300/50">
            <button
              onClick={() => setActiveTab("done")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "done"
                  ? "bg-[#005592] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Proyek Selesai ({doneProjects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("ongoing")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "ongoing"
                  ? "bg-[#005592] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Proyek Berjalan ({ongoingProjects.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Proyek Selesai */}
        {activeTab === "done" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doneProjects.map((project) => (
              <button
                type="button"
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                aria-label={`Buka galeri ${project.title}`}
              >
                <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={resolveMediaUrl(project.coverImage, "/header.png")}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-3.5 py-1.5 rounded-full shadow">
                    {project.category}
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#005592] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-[#005592]">
                      {project.budgetRange || "Estimasi Fleksibel"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-900 group-hover:text-[#005592] font-semibold transition-colors">
                      <span>Lihat Galeri</span>
                      <span className="w-6 h-6 rounded-full bg-[#005592] text-white flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Tab 2: Proyek Berjalan (Ongoing) */}
        {activeTab === "ongoing" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ongoingProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-[28px] overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden mb-5">
                    <Image
                      src={resolveMediaUrl(project.imageUrl, "/on going project.png")}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-sm">
                      <MapPin className="w-3.5 h-3.5 text-[#66B2E0]" />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {project.description || "Pengerjaan fisik berjalan sesuai jadwal termin."}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-gray-700">Progres Konstruksi</span>
                    <span className="text-[#005592] font-bold">{project.progressPercentage}% Selesai</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#005592] to-[#66B2E0] rounded-full transition-all duration-500"
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Galeri Foto Proyek Selesai */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setSelectedProject(null);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-gallery-title"
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-[#005592] uppercase tracking-wider">
                    {selectedProject.category}
                  </span>
                  <h3 id="project-gallery-title" className="mt-1 text-2xl font-bold text-gray-900">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  aria-label="Tutup Galeri"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedProject.gallery && selectedProject.gallery.length > 0 ? (
                  selectedProject.gallery.map((img) => (
                    <div key={img.id} className="relative h-64 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={resolveMediaUrl(img.imageUrl, selectedProject.coverImage || "/header.png")}
                        alt={img.caption || selectedProject.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                      {img.caption && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-2.5 backdrop-blur-sm">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="relative h-64 sm:col-span-2 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={resolveMediaUrl(selectedProject.coverImage, "/header.png")}
                      alt={selectedProject.title}
                      fill
                      sizes="(max-width: 896px) 100vw, 896px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="bg-[#005592] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0066AE] transition-colors"
                >
                  Tutup Galeri
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
