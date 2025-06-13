# Amida Kuji (Ghost Leg)

A modern web application for creating and animating Amida Kuji (Ghost Leg) ladders with SVG animations powered by GSAP.

## Features

- ✨ Interactive Amida Kuji creation with up to 20 items
- 🎨 Beautiful SVG animations with GSAP
- 🌓 Dark/Light theme toggle
- 📱 Responsive design with Tailwind CSS
- ⚡ Built with Vite for fast development and production builds
- 🎯 TypeScript for type safety

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animation**: GSAP 3
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

```bash
# Deploy to GitHub Pages
npm run deploy
```

## Usage

1. **Setup Phase**: Add start items and goal items (2-20 items each, must be equal count)
2. **Animation Phase**: Watch the SVG ladder draw itself and trace the path
3. **Result**: See which start item connects to which goal item

## Algorithm

The Amida algorithm generates horizontal connecting lines with a 1.5x ratio (e.g., 6 items = 9 horizontal lines) while ensuring:
- No adjacent horizontal lines on the same row
- No duplicate lines at the same position
- Proper path tracing from start to goal

## License

MIT License