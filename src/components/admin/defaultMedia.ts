// Bundled default images shown in the Media Library picker so admins can
// pick a great-looking default without having to upload anything.
//
// These are bundled as static assets they are NOT stored server-side.
// When picked, the URL points to the built/bundled asset and works the
// same as any uploaded image (it gets saved as the field's URL).
import heroGradient from "@/assets/defaults/hero-gradient-1.jpg";
import heroGlass from "@/assets/defaults/hero-glass-2.jpg";
import heroDashboard from "@/assets/defaults/hero-dashboard-3.jpg";
import appScreenshot from "@/assets/defaults/app-screenshot-1.jpg";
import type { MediaFile } from "@/services/adminApi";

export interface DefaultMediaItem extends MediaFile {
  is_default: true;
}

let id = -1;
const make = (
  url: string,
  category: MediaFile["category"],
  name: string
): DefaultMediaItem => ({
  id: id--, // negative ids so they never collide with server-side rows
  filename: name,
  original_name: name,
  file_path: url,
  thumb_path: null,
  image_url: url,
  thumb_url: url,
  mime_type: "image/jpeg",
  file_size: 0,
  dimensions: "1600x896",
  category,
  section_key: null,
  alt_text: name,
  uploaded_by: null,
  created_at: "",
  is_default: true,
});

export const DEFAULT_MEDIA: DefaultMediaItem[] = [
  make(heroGradient, "hero", "Default · Purple Gradient"),
  make(heroGlass, "hero", "Default · Glass Spheres"),
  make(heroDashboard, "hero", "Default · Neon Dashboard"),
  make(appScreenshot, "screenshot", "Default · App Screenshot"),
];

export function getDefaultsForCategory(category?: string): DefaultMediaItem[] {
  if (!category) return DEFAULT_MEDIA;
  return DEFAULT_MEDIA.filter((m) => m.category === category);
}
