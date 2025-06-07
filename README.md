# SkyeGUIs

A modern Next.js 15 static website with beautiful UI components, built with React 19, Tailwind CSS, and Radix UI.

## Features
- Static site export for fast, CDN-friendly deployment
- Modern UI components (Accordion, Dialog, Carousel, Chart, etc.)
- TypeScript support
- Tailwind CSS for styling
- Radix UI for accessible primitives
- Easy deployment to Cloudflare Pages

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended)

### Install dependencies
```bash
pnpm install
```

### Development
```bash
pnpm dev
```

### Build for production (static export)
```bash
pnpm build
```

The static site will be output to the `out/` directory.

### Clean build artifacts
```bash
pnpm run clean
```

### Deploy to Cloudflare Pages
1. Set the build command to `pnpm build` (or `pnpm run build:static` if you use the custom script).
2. Set the output directory to `out`.
3. Ensure `.cfignore` excludes `.next`, `node_modules`, and other non-static files.

## Project Structure
- `app/` - Next.js app directory (pages, layouts)
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions
- `public/` - Static assets
- `styles/` - Global styles

## License
MIT
