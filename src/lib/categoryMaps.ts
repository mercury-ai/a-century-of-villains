import { AL, PL } from "../data";
import type { Mode } from "./types";

export function getCategoryLabels(mode: Mode): Record<string, string> {
  if (mode === "power") return PL;
  if (mode === "system") {
    return {
      per_pct: "Personal Villains",
      sys_pct: "Systemic Villains"
    };
  }
  return AL;
}

export function getCategoryColors(mode: Mode): Record<string, string> {
  if (mode === "power") {
    return {
      criminal_individual: "#f43f5e",
      personal: "#f59e0b",
      state_political: "#0ea5e9",
      corporate_institutional: "#0d9488",
      feudal: "#ea580c",
      foreign_threat: "#8b5cf6",
      colonial_state: "#ec4899",
      supernatural: "#64748b",
      patriarchal: "#db2777",
      other: "#8e8e93"
    };
  }
  if (mode === "system") {
    return {
      per_pct: "#f43f5e",
      sys_pct: "#38bdf8"
    };
  }
  return {
    criminal_gangster: "#e11d48",
    terrorist: "#f43f5e",
    family_antagonist: "#f59e0b",
    jealous_lover: "#ca8a04",
    "landlord/zamindar": "#a16207",
    corrupt_politician: "#4f46e5",
    corporate_villain: "#0d9488",
    corrupt_police: "#0284c7",
    colonial_oppressor: "#7c3aed",
    supernatural: "#64748b",
    patriarchal_system: "#ec4899",
    "system/society": "#10b981",
    "religious_extremist/cult_leader": "#d946ef"
  };
}
