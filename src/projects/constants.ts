import { ProjectConfig } from "@/aiParams";

/**
 * Empty project config used as default/fallback for missing fields.
 */
export const EMPTY_PROJECT_CONFIG: ProjectConfig = {
  id: "",
  name: "",
  description: "",
  systemPrompt: "",
  projectModelKey: "",
  modelConfigs: {},
  contextSource: {},
  created: 0,
  UsageTimestamps: 0,
};

// Frontmatter property keys (cortex-project-* prefix to avoid user property conflicts)
export const CORTEX_PROJECT_ID = "cortex-project-id";
export const CORTEX_PROJECT_NAME = "cortex-project-name";
export const CORTEX_PROJECT_DESCRIPTION = "cortex-project-description";
export const CORTEX_PROJECT_MODEL_KEY = "cortex-project-model-key";
export const CORTEX_PROJECT_TEMPERATURE = "cortex-project-temperature";
export const CORTEX_PROJECT_MAX_TOKENS = "cortex-project-max-tokens";
export const CORTEX_PROJECT_CREATED = "cortex-project-created";
export const CORTEX_PROJECT_LAST_USED = "cortex-project-last-used";
export const CORTEX_PROJECT_INCLUSIONS = "cortex-project-inclusions";
export const CORTEX_PROJECT_EXCLUSIONS = "cortex-project-exclusions";
export const CORTEX_PROJECT_WEB_URLS = "cortex-project-web-urls";
export const CORTEX_PROJECT_YOUTUBE_URLS = "cortex-project-youtube-urls";

// File structure conventions
export const PROJECT_CONFIG_FILE_NAME = "project.md";
export const PROJECTS_UNSUPPORTED_FOLDER_NAME = "unsupported";
