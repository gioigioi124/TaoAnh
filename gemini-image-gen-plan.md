# Gemini Image Generator — Kế hoạch dự án

> Stack: **Next.js 16.2** · **Imagen 4.0 / Gemini 3.1 Flash Image** · **Tailwind CSS v4** · **shadcn/ui**  
> Mục tiêu: Web app tạo nhiều ảnh cùng lúc với Gemini, chạy local và deploy Vercel

> ✅ **Model note (verified từ API thực tế của user):**  
> Imagen 4.0 family **vẫn active** (`imagen-4.0-generate-001`, `imagen-4.0-fast-generate-001`, `imagen-4.0-ultra-generate-001`).  
> Gemini native image generation (`gemini-3.1-flash-image`) cũng có sẵn — hỗ trợ conversational editing.

---

## 1. Tổng quan tính năng

| Tính năng | Mô tả |
|---|---|
| **Prompt Editor** | Textarea nhập prompt tự do + chèn biến nhanh |
| **Prompt Templates** | Bộ mẫu prompt sẵn phân theo chủ đề (Product, Portrait, Landscape…) |
| **Số lượng ảnh** | Chọn 1–4 ảnh / request; hỗ trợ batch nhiều request song song |
| **Aspect Ratio** | 5 tỉ lệ: `1:1`, `4:3`, `3:4`, `16:9`, `9:16` |
| **Model Selector** | Chọn giữa Nano Banana 2 (nhanh, rẻ) và Nano Banana Pro (chất lượng cao) |
| **Image Size** | `512`, `1K`, `2K`, `4K` — phụ thuộc model được chọn |
| **Negative Prompt** | Mô tả những gì không muốn xuất hiện trong ảnh |
| **Style Modifier** | Dropdown chọn phong cách nghệ thuật (photorealistic, anime, oil painting…) |
| **Seed** | Tùy chọn nhập seed số để tái tạo ảnh giống nhau |
| **Watermark toggle** | Bật/tắt SynthID invisible watermark |
| **History** | Lưu lịch sử các lần generate trong session (localStorage) |
| **Download** | Tải từng ảnh (PNG/JPG) hoặc tải tất cả dạng `.zip` |
| **Fullscreen Preview** | Click ảnh để xem full + zoom |
| **Copy Prompt** | Copy prompt từ ảnh đã generate trước đó |

---

## 2. Cấu trúc thư mục

```
gemini-image-gen/
├── app/                          ← Next.js 16 App Router
│   ├── layout.tsx                ← Root layout (font, theme)
│   ├── globals.css               ← Tailwind v4 + CSS vars
│   ├── page.tsx                  ← Trang chủ (import GeneratorPage)
│   └── api/
│       └── generate/
│           └── route.ts          ← POST /api/generate — gọi Imagen 4
│
├── components/
│   ├── generator/
│   │   ├── GeneratorLayout.tsx   ← Layout 2 cột: controls | gallery
│   │   ├── PromptPanel.tsx       ← Panel bên trái chứa tất cả inputs
│   │   ├── PromptInput.tsx       ← Textarea prompt chính + character count
│   │   ├── NegativePrompt.tsx    ← Collapsible textarea negative prompt
│   │   ├── TemplateSelector.tsx  ← Grid chọn prompt template
│   │   ├── StyleModifier.tsx     ← Dropdown style nghệ thuật
│   │   ├── ModelSelector.tsx     ← Chọn Nano Banana 2 hoặc Nano Banana Pro
│   │   ├── RatioSelector.tsx     ← Radio buttons chọn aspect ratio (có preview icon)
│   │   ├── CountSelector.tsx     ← Slider 1–4 số ảnh / request
│   │   ├── BatchSelector.tsx     ← Chọn số batch (1–5 requests song song)
│   │   ├── SizeSelector.tsx      ← Dropdown 512 / 1K / 2K / 4K (lọc theo model)
│   │   ├── SeedInput.tsx         ← Number input seed (optional)
│   │   ├── WatermarkToggle.tsx   ← Switch SynthID watermark
│   │   └── GenerateButton.tsx    ← Button + loading state + quota indicator
│   │
│   ├── gallery/
│   │   ├── ImageGallery.tsx      ← Grid hiển thị ảnh kết quả
│   │   ├── ImageCard.tsx         ← Card ảnh: thumbnail + actions (download, copy prompt)
│   │   ├── ImageModal.tsx        ← Lightbox fullscreen + zoom
│   │   └── EmptyState.tsx        ← Placeholder khi chưa có ảnh
│   │
│   ├── history/
│   │   ├── HistoryPanel.tsx      ← Sidebar hoặc drawer lịch sử session
│   │   └── HistoryItem.tsx       ← Row hiển thị 1 lần generate cũ
│   │
│   └── ui/                       ← shadcn/ui components (auto-generated)
│       ├── button.tsx
│       ├── textarea.tsx
│       ├── slider.tsx
│       ├── select.tsx
│       ├── switch.tsx
│       ├── dialog.tsx
│       ├── badge.tsx
│       └── tooltip.tsx
│
├── lib/
│   ├── gemini.ts                 ← Wrapper gọi Imagen 4 API
│   ├── templates.ts              ← Danh sách prompt templates
│   ├── styles.ts                 ← Danh sách style modifiers
│   └── utils.ts                  ← cn(), downloadImage(), downloadZip()
│
├── hooks/
│   ├── useGenerate.ts            ← Logic generate: state, loading, error, retry
│   ├── useHistory.ts             ← CRUD lịch sử trong localStorage
│   └── useDownload.ts            ← Download single / zip
│
├── types/
│   └── index.ts                  ← GenerateRequest, GenerateResult, HistoryItem, Template
│
├── public/
│   └── ratio-icons/              ← SVG icons minh họa các tỉ lệ
│
├── .env.local                    ← GEMINI_API_KEY (server-only)
├── next.config.ts
├── tailwind.config.ts
├── components.json               ← shadcn/ui config
└── package.json
```

---

## 3. Inputs chi tiết

### 3.1 Prompt chính
- `<textarea>` tự động resize, tối đa **1000 ký tự** (giới hạn Imagen)
- Character count hiển thị góc phải (đỏ khi > 900)
- Nút **"Enhance with AI"** — dùng `gemini-2.0-flash` để cải thiện prompt tự động

### 3.2 Prompt Templates
```ts
// lib/templates.ts
export const TEMPLATES = [
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
]
```

### 3.3 Style Modifiers
Append vào cuối prompt khi chọn:

| Style | Appended text |
|---|---|
| Photorealistic | `, photorealistic, hyperdetailed, 8K` |
| Oil Painting | `, oil painting, impasto texture, museum quality` |
| Watercolor | `, watercolor illustration, soft edges, wet on wet` |
| Digital Art | `, digital art, concept art, ArtStation trending` |
| Anime | `, anime style, cel shading, vibrant colors` |
| 3D Render | `, 3D render, Blender, ray tracing, octane render` |
| Sketch | `, pencil sketch, hand drawn, charcoal texture` |
| Pixel Art | `, pixel art, 16-bit, retro game style` |

### 3.4 Model Selector

| Model | API ID | Tốc độ | Chất lượng | Phù hợp |
|---|---|---|---|---|
| **Imagen 4 Fast** ⚡ | `imagen-4.0-fast-generate-001` | Nhanh nhất | Tốt | Bulk generate, thử nghiệm nhanh |
| **Imagen 4** ✅ default | `imagen-4.0-generate-001` | Trung bình | Cao | Cân bằng chất lượng/tốc độ |
| **Imagen 4 Ultra** 💎 | `imagen-4.0-ultra-generate-001` | Chậm | Cao nhất | Production, ảnh thương mại |
| **Gemini 3.1 Flash Image** 🔁 | `gemini-3.1-flash-image` | Nhanh | Cao | Conversational edit, 512px–4K |
| **Gemini 3 Pro Image** 🍌 | `gemini-3-pro-image` | Chậm + Thinking | Cao nhất + text | Poster, logo, text trong ảnh |

- Mặc định chọn **Imagen 4** (`imagen-4.0-generate-001`) — cân bằng nhất
- Badge hiển thị đặc điểm từng model khi hover
- **Gemini 3.1 Flash Image** là lựa chọn khi cần edit ảnh có sẵn hoặc size `512`
- **Gemini 3 Pro Image** tốt nhất khi cần render text chính xác trong ảnh (poster, logo)

### 3.5 Aspect Ratio
```
[1:1]  [4:3]  [3:4]  [16:9]  [9:16]
 □      ▭      ▯      ▬       ▮
Square  Land  Portrait Widescreen Story
```
Hiển thị dạng radio buttons với icon SVG minh họa tỉ lệ.

### 3.6 Số lượng ảnh
- **Images per request**: Slider 1–4 (Nano Banana API limit)
- **Batch requests**: Dropdown 1–5 (số lần gọi API song song)
- → Tổng tối đa: 4 × 5 = **20 ảnh** một lần nhấn Generate
- Hiển thị `"Sẽ tạo X ảnh · ~Y giây"` estimate

### 3.7 Image Size

| Model | Size hỗ trợ |
|---|---|
| Imagen 4 Fast | `1K` · `2K` |
| Imagen 4 Standard | `1K` · `2K` |
| Imagen 4 Ultra | `1K` · `2K` · `4K` |
| Gemini 3.1 Flash Image | `512` · `1K` · `2K` · `4K` |
| Gemini 3 Pro Image | `1K` · `2K` · `4K` |

- Dropdown tự động lọc size hợp lệ theo model đang chọn
- Server-side validate và fallback về `"1K"` nếu size không hợp lệ
- Cảnh báo toast nếu chọn `4K` (Ultra/Gemini models, render lâu hơn)

### 3.8 Negative Prompt (Collapsible)
- Mặc định ẩn, expand khi click
- Placeholder: `"blurry, low quality, watermark, text, deformed, ugly"`

### 3.9 Seed (Optional)
- Number input, placeholder `"Random"` (để trống = random)
- Nút 🎲 để random seed và hiển thị giá trị đang dùng
- Seed được lưu vào history để reproduce

### 3.10 Watermark
- Switch bật/tắt SynthID watermark
- Tooltip giải thích SynthID là gì

---

## 4. API Route

```ts
// app/api/generate/route.ts
import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// Model IDs xác nhận 100% từ tài khoản (June 2026)
const IMAGE_MODELS = {
  "imagen-4-fast":    "imagen-4.0-fast-generate-001",    // ⚡ Nhanh nhất
  "imagen-4":         "imagen-4.0-generate-001",          // ✅ Default
  "imagen-4-ultra":   "imagen-4.0-ultra-generate-001",    // 💎 Chất lượng cao nhất
  "gemini-flash-img": "gemini-3.1-flash-image",           // 🔁 Conversational edit
  "gemini-pro-img":   "gemini-3-pro-image",               // 🍌 Thinking + text rendering
} as const

// Size hợp lệ theo từng model
const SIZE_SUPPORT: Record<string, string[]> = {
  "imagen-4-fast":    ["1K", "2K"],
  "imagen-4":         ["1K", "2K"],
  "imagen-4-ultra":   ["1K", "2K", "4K"],
  "gemini-flash-img": ["512", "1K", "2K", "4K"],
  "gemini-pro-img":   ["1K", "2K", "4K"],
}

export async function POST(req: NextRequest) {
  const {
    prompt,
    negativePrompt,
    model = "imagen-4",
    numberOfImages = 4,
    aspectRatio = "1:1",
    imageSize = "1K",
    seed,
    addWatermark = true,
    batchCount = 1,
  } = await req.json()

  const modelId = IMAGE_MODELS[model as keyof typeof IMAGE_MODELS] ?? IMAGE_MODELS["imagen-4"]

  // Validate imageSize với model
  const validSizes = SIZE_SUPPORT[model] ?? ["1K"]
  const resolvedSize = validSizes.includes(imageSize) ? imageSize : "1K"

  const batches = Array.from({ length: batchCount }, () =>
    ai.models.generateImages({
      model: modelId,
      prompt,
      config: {
        numberOfImages,
        aspectRatio,
        imageSize: resolvedSize,
        negativePrompt,
        addWatermark,
        ...(seed !== undefined && { seed }),
      },
    })
  )

  const results = await Promise.allSettled(batches)

  const images = results.flatMap((r) => {
    if (r.status === "rejected") return []
    return r.value.generatedImages?.map((img) => ({
      base64: img.image?.imageBytes,
      mimeType: img.image?.mimeType ?? "image/jpeg",
    })) ?? []
  })

  const failed = results.filter((r) => r.status === "rejected").length

  return NextResponse.json({ images, count: images.length, failed })
}
```

```ts
// app/api/enhance-prompt/route.ts — dùng gemini-3.5-flash (GA, stable)
import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(req: NextRequest) {
  const { prompt, style, aspectRatio } = await req.json()

  const result = await ai.models.generateContent({
    model: "gemini-3.5-flash",   // Text model GA mới nhất — xác nhận có trong tài khoản
    contents: `You are an expert AI image prompt engineer. 
Enhance this image generation prompt to be more detailed and visually rich.
Keep it under 800 characters. Return ONLY the enhanced prompt, no explanation.

Original prompt: "${prompt}"
Target style: ${style || "photorealistic"}
Aspect ratio: ${aspectRatio || "1:1"}`,
  })

  const enhanced = result.response.text()
  return NextResponse.json({ enhanced })
}
```

---

## 5. Dependencies

### Production
```json
{
  "next": "^16.2.9",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "@google/genai": "^1.0.0",
  "tailwindcss": "^4.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0",
  "lucide-react": "^0.400.0",
  "jszip": "^3.10.1",
  "file-saver": "^2.0.5",
  "sonner": "^1.5.0"
}
```

### Dev
```json
{
  "typescript": "^5.5.0",
  "@types/node": "^22.0.0",
  "@types/react": "^19.0.0",
  "@types/file-saver": "^2.0.7"
}
```

> **Không cần** `axios`, `react-query`, `zustand` — đủ dùng với native fetch và `useState`

---

## 6. Thứ tự implementation

### Phase 1 — Skeleton (1–2h)
- [ ] `npx create-next-app@latest` với TypeScript + Tailwind + App Router
- [ ] Cài `@google/genai`, `shadcn/ui`, `sonner`, `lucide-react`
- [ ] Tạo `.env.local` với `GEMINI_API_KEY`
- [ ] Scaffold cấu trúc thư mục
- [ ] Test API route với curl

### Phase 2 — Core UI (3–4h)
- [ ] `RatioSelector` với SVG ratio icons
- [ ] `CountSelector` slider + batch dropdown
- [ ] `PromptInput` + character counter
- [ ] `NegativePrompt` collapsible
- [ ] `GenerateButton` với loading spinner
- [ ] `ImageGallery` grid responsive

### Phase 3 — Templates & Styles (1–2h)
- [ ] `TemplateSelector` — modal hoặc side drawer
- [ ] Variable injection (thay `{product}` → input động)
- [ ] `StyleModifier` dropdown

### Phase 4 — Advanced (2–3h)
- [ ] `SeedInput` + random button
- [ ] `WatermarkToggle`
- [ ] `ImageModal` lightbox với zoom
- [ ] Download single + zip
- [ ] `useHistory` — lưu/khôi phục từ localStorage
- [ ] **"Enhance Prompt"** gọi `gemini-3.5-flash` cải thiện prompt

### Phase 5 — Polish (1–2h)
- [ ] Dark/light mode
- [ ] Loading skeleton cho gallery
- [ ] Error handling + retry
- [ ] Responsive mobile
- [ ] Toast notifications (sonner)

---

## 7. Lưu ý kỹ thuật

| Vấn đề | Giải pháp |
|---|---|
| API key lộ ra client | Luôn gọi qua `/api/generate` và `/api/enhance-prompt`, **không** dùng SDK ở client |
| Size không khớp model | Server validate `SIZE_SUPPORT[model]`, fallback `"1K"` nếu không hợp lệ |
| Rate limit Gemini Pro | Debounce 500ms, disable button khi đang loading |
| Batch song song quá nhiều | Giới hạn `batchCount ≤ 5`, dùng `Promise.allSettled` (1 batch lỗi không kill toàn bộ) |
| Ảnh base64 nặng | Convert sang `Blob URL` (`URL.createObjectURL`) để render nhanh hơn |
| `gemini-3-pro-image` dùng Thinking | Thời gian generate ~10–15s; hiển thị thinking indicator riêng |
| Preview models (`-preview`) | Không dùng trong production — `gemini-3.1-flash-image-preview` và `gemini-3-pro-image-preview` đang shutdown June 25, 2026 |
| `gemini-2.0-flash` / `gemini-2.0-flash-lite` | Đã shutdown June 1, 2026 — không dùng |

---

## 8. Tóm tắt models sử dụng

Danh sách xác nhận 100% từ API của tài khoản:

**Models dùng trong app:**

| Mục đích | Model ID | Ghi chú |
|---|---|---|
| **Tạo ảnh — nhanh** | `imagen-4.0-fast-generate-001` | Imagen 4 Fast — bulk generate |
| **Tạo ảnh — default** ✅ | `imagen-4.0-generate-001` | Imagen 4 Standard — cân bằng nhất |
| **Tạo ảnh — ultra quality** | `imagen-4.0-ultra-generate-001` | Imagen 4 Ultra — production |
| **Tạo ảnh — text/poster** | `gemini-3-pro-image` | Nano Banana Pro, Thinking mode |
| **Tạo ảnh — conversational** | `gemini-3.1-flash-image` | Nhanh, edit ảnh có sẵn |
| **Enhance Prompt** | `gemini-3.5-flash` | Text model GA stable mới nhất |

**Models có sẵn trong account nhưng không dùng cho app này:**

| Model | Lý do không dùng |
|---|---|
| `gemini-2.5-flash-image` | Thế hệ cũ hơn `3.1-flash-image`, giữ làm fallback nếu cần |
| `nano-banana-pro-preview` | Preview — không ổn định cho production |
| `gemini-3.1-flash-image-preview` | Preview — đang deprecated, sẽ shutdown June 25, 2026 |
| `gemini-3-pro-image-preview` | Preview — đang deprecated, sẽ shutdown June 25, 2026 |
| `gemini-3.5-flash` (image) | Không có trong list — 3.5 chỉ là text model |

> ✅ Ưu tiên dùng model **không có suffix `-preview`** cho mọi tính năng production  
> ✅ `imagen-4.0-*` và `gemini-3.1-flash-image` là stable, không có ngày shutdown được thông báo  
> ❌ Không dùng: `gemini-2.0-flash`, `gemini-2.0-flash-lite` — đã shutdown June 1, 2026

---

## 9. Khởi tạo dự án (lệnh nhanh)

```bash
# Tạo project
npx create-next-app@latest gemini-image-gen \
  --typescript --tailwind --app --no-src-dir --import-alias "@/*"

cd gemini-image-gen

# Cài dependencies
npm install @google/genai jszip file-saver sonner lucide-react
npm install -D @types/file-saver

# Cài shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button textarea slider select switch dialog badge tooltip

# Tạo .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local

npm run dev
```
