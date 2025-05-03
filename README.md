# 📸 Video Meme Generator (Chrome Extension)

A modern Chrome extension that lets you **capture funny video moments and turn them into memes** — as images or animated GIFs. Built with **Vue 3**, **Vite**, **Tailwind CSS 4.1**, and **DaisyUI 5.0**.

![screenshot](./docs/preview.png)

---

## 🚀 Features

- 🎥 Capture current video frame from `<video>` tag
- ✏️ Add top/bottom text (meme style)
- 🖼 Export as PNG or GIF
- 💡 Popup interface built with Vue + DaisyUI
- 🌗 Light/dark theme switch
- 📂 Local meme history (coming soon)

---

## 🧱 Tech Stack

| Layer      | Technology               |
|------------|--------------------------|
| Build Tool | Vite + TypeScript        |
| UI         | Vue 3 + DaisyUI + Tailwind CSS 4.1 |
| Plugin API | Chrome Extension MV3     |
| Style      | Prettier + ESLint + Git Hooks |

---

## 🛠️ Local Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start development mode

```bash
pnpm dev
```

This will build the extension into the `dist/` folder.

### 3. Load into Chrome

1. Go to `chrome://extensions/`
2. Enable "Developer Mode"
3. Click "Load unpacked"
4. Select the `dist/` folder

---

## 📦 Production Build

```bash
pnpm build
```

Output will be in `dist/`, ready to publish.

---

## 📁 Project Structure

```
video-meme-generator/
├── manifest.json          # Chrome extension config
├── vite.config.ts         # Vite build config
├── tsconfig.json          # TypeScript paths
├── src/
│   ├── popup/             # Vue popup app
│   ├── content/           # Scripts injected into web pages
│   ├── styles/            # Tailwind entry
│   └── utils/             # GIF/image generation helpers
└── dist/                  # Build output
```

---

## ✅ TODO

- [x] Frame capture from video
- [x] Meme text overlay
- [x] PNG export
- [ ] GIF recording and export
- [ ] Floating button + context menu
- [ ] Meme history & favorites

---

## 📄 License

[MIT](./LICENSE) © 2025 Your Name