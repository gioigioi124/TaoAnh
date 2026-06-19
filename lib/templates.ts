import { Template } from "@/types";

export const TEMPLATES: Template[] = [
  {
    id: "product-photo",
    label: "📦 Product Photo",
    category: "E-commerce",
    prompt: "Professional product photography of {product}, white background, studio lighting, 8K, ultra detailed, commercial quality",
    variables: ["product"],
  },
  {
    id: "portrait",
    label: "🧑 Portrait",
    category: "People",
    prompt: "Portrait of {subject}, natural lighting, bokeh background, Canon 5D Mark IV, f/1.8, professional photography",
    variables: ["subject"],
  },
  {
    id: "landscape",
    label: "🏔️ Landscape",
    category: "Nature",
    prompt: "Epic landscape photography of {location}, golden hour, dramatic clouds, wide angle lens, National Geographic style",
    variables: ["location"],
  },
  {
    id: "anime",
    label: "🎌 Anime",
    category: "Illustration",
    prompt: "{character}, anime style, Studio Ghibli inspired, soft colors, detailed background, 4K",
    variables: ["character"],
  },
  {
    id: "interior",
    label: "🏠 Interior Design",
    category: "Architecture",
    prompt: "Modern {room} interior design, minimalist style, natural light, Scandinavian aesthetic, architectural digest",
    variables: ["room"],
  },
  {
    id: "food",
    label: "🍜 Food Photography",
    category: "E-commerce",
    prompt: "Professional food photography of {dish}, overhead shot, wooden table, natural props, warm lighting, Instagram style",
    variables: ["dish"],
  },
  {
    id: "logo-concept",
    label: "🎨 Logo Concept",
    category: "Branding",
    prompt: "Minimalist logo design for {brand}, flat design, vector style, {color} color palette, white background",
    variables: ["brand", "color"],
  },
  {
    id: "cinematic",
    label: "🎬 Cinematic",
    category: "Art",
    prompt: "Cinematic still of {scene}, anamorphic lens, film grain, moody lighting, Christopher Nolan style, 2.39:1 aspect ratio",
    variables: ["scene"],
  },
];
