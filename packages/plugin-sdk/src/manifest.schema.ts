import { z } from 'zod';

export const UIExtensionSchema = z.object({
  id: z.string(),
  type: z.enum(['dashboard_widget', 'sidebar_link', 'order_action', 'trip_action', 'settings_tab']),
  url: z.string().url(),
  label: z.string()
});

export const PluginManifestSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Must be a valid semver"),
  author: z.object({
    name: z.string(),
    email: z.string().email(),
    company: z.string().optional(),
    website: z.string().url().optional()
  }),
  icon: z.string().optional(),
  logo: z.string().optional(),
  permissions: z.array(z.string()),
  events: z.array(z.string()).optional(),
  webhooks: z.array(z.object({
    url: z.string().url(),
    events: z.array(z.string())
  })).optional(),
  uiExtensions: z.array(UIExtensionSchema).optional(),
  pariLinkVersion: z.string().default(">=1.0.0"),
  license: z.string().default("MIT")
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;
export type UIExtension = z.infer<typeof UIExtensionSchema>;

export const validateManifest = (json: unknown): PluginManifest => {
  return PluginManifestSchema.parse(json);
};
