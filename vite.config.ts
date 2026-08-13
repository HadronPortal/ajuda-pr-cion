// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

function readProjectEnvironment() {
  const values: Record<string, string> = {};

  for (const line of readFileSync(resolve(process.cwd(), ".env"), "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    values[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }

  return values;
}

const projectEnvironment = readProjectEnvironment();
const CRM_SUPABASE_PROJECT_REF = "vbkbbfeujqmvgmmhmeao";
const CRM_SUPABASE_URL = `https://${CRM_SUPABASE_PROJECT_REF}.supabase.co`;
const supabaseConfigModuleId = "virtual:crm-supabase-config";
const resolvedSupabaseConfigModuleId = `\0${supabaseConfigModuleId}`;

function crmSupabaseConfigPlugin(): Plugin {
  return {
    name: "crm-supabase-config",
    enforce: "post",
    resolveId(id) {
      return id === supabaseConfigModuleId ? resolvedSupabaseConfigModuleId : undefined;
    },
    load(id) {
      if (id !== resolvedSupabaseConfigModuleId) return undefined;

      return [
        `export const supabaseProjectId = ${JSON.stringify(CRM_SUPABASE_PROJECT_REF)};`,
        `export const supabaseUrl = ${JSON.stringify(CRM_SUPABASE_URL)};`,
        `export const supabasePublishableKey = ${JSON.stringify(projectEnvironment.VITE_SUPABASE_PUBLISHABLE_KEY)};`,
      ].join("\n");
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
