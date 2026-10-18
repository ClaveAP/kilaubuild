"use client";

import { useCallback, useEffect, useState } from "react";
import { FolderKanban, Layers } from "lucide-react";
import { getApiData } from "@/lib/api";
import { ProjectsDoneTab } from "./projects/ProjectsDoneTab";
import { ProjectsOngoingTab } from "./projects/ProjectsOngoingTab";
import type { OngoingProjectItem, ProjectDoneItem } from "../admin.types";

interface ProjectsViewProps {
  onRefreshStats: () => void;
}

type ProjectTab = "DONE" | "ONGOING";

export const ProjectsView = ({ onRefreshStats }: ProjectsViewProps) => {
  const [activeTab, setActiveTab] = useState<ProjectTab>("DONE");
  const [projectsDone, setProjectsDone] = useState<ProjectDoneItem[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProjects = useCallback(async () => {
    setLoading(true);
    try {
      const [doneRes, ongoingRes] = await Promise.all([
        getApiData<ProjectDoneItem[]>("/projects/done"),
        getApiData<OngoingProjectItem[]>("/projects/ongoing"),
      ]);
      setProjectsDone(doneRes || []);
      setOngoingProjects(ongoingRes || []);
    } catch (err: unknown) {
      console.warn("Gagal memuat proyek:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAllProjects();
  }, [fetchAllProjects]);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#0A1E2F]">
          Portofolio Proyek
        </h2>
        <p className="mt-1 text-xs text-[#71818D]">
          Kelola portofolio proyek selesai dan progres pembangunan fisik yang sedang berjalan di lapangan.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#CBD8DF]">
        <button
          type="button"
          onClick={() => setActiveTab("DONE")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
            activeTab === "DONE"
              ? "border-[#005592] text-[#005592]"
              : "border-transparent text-[#71818D] hover:text-[#0A1E2F]"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Proyek Selesai ({projectsDone.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ONGOING")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
            activeTab === "ONGOING"
              ? "border-[#005592] text-[#005592]"
              : "border-transparent text-[#71818D] hover:text-[#0A1E2F]"
          }`}
        >
          <FolderKanban className="h-4 w-4" />
          <span>Proyek Sedang Berjalan ({ongoingProjects.length})</span>
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === "DONE" ? (
        <ProjectsDoneTab
          projects={projectsDone}
          loading={loading}
          onRefresh={fetchAllProjects}
          onRefreshStats={onRefreshStats}
        />
      ) : (
        <ProjectsOngoingTab
          projects={ongoingProjects}
          loading={loading}
          onRefresh={fetchAllProjects}
          onRefreshStats={onRefreshStats}
        />
      )}
    </div>
  );
};
