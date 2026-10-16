import type { LayerId } from "@/content/architecture";
import type { CategoryId } from "@/content/projects";

/** One color per layer of the stack (bottom of the monolith is cloud). */
export const layerColors: Record<LayerId | "security", string> = {
  interface: "#f1f5fa",
  api: "#486bff",
  data: "#8fa6ff",
  ai: "#52e6d0",
  cloud: "#d8ff68",
  security: "#ff755e",
};

/** Top-to-bottom order used by every stacked illustration. */
export const layerOrder: LayerId[] = ["interface", "api", "data", "ai", "cloud"];

export const categoryLayers: Record<CategoryId, (LayerId | "security")[]> = {
  web: ["interface", "api"],
  ai: ["ai"],
  cloud: ["cloud"],
  data: ["data"],
  security: ["security"],
};

export const categoryColor: Record<CategoryId, string> = {
  web: layerColors.api,
  ai: layerColors.ai,
  cloud: layerColors.cloud,
  data: layerColors.data,
  security: layerColors.security,
};
