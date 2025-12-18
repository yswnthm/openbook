# OpenBook

<p align="center">
  <img src="./public/screenshots/openbook.png" alt="OpenBook Logo" width="350" />
</p>

<p align="center">
  <a href="https://deepwiki.com/yeswanth49/openbook">
    <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" />
  </a>
</p>

An AI-powered knowledge exploration platform providing an interactive interface for information search, AI conversations, and academic research.

<p align="center">
  <a href="https://waitlist.gooopenbook.in" target="_blank">
    <strong>👉 Sign up for early access 👈</strong>
  </a>
</p>

## 🔍 Overview

OpenBook is a modern web application built with Next.js that offers powerful AI-assisted research and conversation capabilities. The platform integrates multiple AI models and provides advanced search tools for both casual inquiries and academic research.

## ✨ Features

- **Multiple AI Models**: Seamless integration with OpenAI, Google AI, Anthropic, Groq, and XAI
- **Advanced Form System**: Rich text input with file attachments, drag-and-drop functionality, and clipboard paste support
- **Dual Search Modes**:
  - Standard Chat: Quick conversations and information retrieval
  - Academic Research: Specialized tools for scholarly exploration
- **Research Tools**: Paper search, citation formatting, content analysis, and knowledge synthesis
- **Real-time Streaming**: Live updates for long-running operations
- **Rich Media Support**: Renders LaTeX, code blocks, tables, and embedded media
- **Modern UI**: Clean, responsive design with Tailwind CSS v4

<p align="center">
  <img src="./public/screenshots/main-interface.png" alt="OpenBook Interface" width="600" />
</p>

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm (recommended package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/openbook-model.git
   cd openbook-model
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` to add your API keys for AI services.

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000.

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

- [Documentation Overview](./docs/overview.md)
- [AI Models Integration](./docs/ai-models.md)
- [Form Component System](./docs/form-component.md)
- [Search Functionality](./docs/search-functionality.md)
- [Project Structure](./docs/project-structure.md)

## 🧰 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v15+)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **AI Integration**: AI SDK with multiple provider support
- **Editor**: TipTap rich text editor
- **Data Visualization**: Recharts
- **Analytics**: Vercel Analytics and Speed Insights
- **Deployment**: Vercel

## 📊 Project Structure

```
openbook/
├── app/              # Next.js application routes and pages
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── lib/             # Utility functions and service integrations
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── public/          # Static assets
    └── screenshots/ # Application screenshots
```

## 🎯 Implementation Plan

See the project [task list](./journal_tasks.md) for development progress and upcoming features.

## 🤝 Contributing

We welcome contributions to OpenBook! Please check out our [contributing guidelines](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📸 Screenshots

<p align="center">
  <img src="./public/screenshots/main-interface.png" alt="OpenBook Main Interface" width="600" />
</p>

<p align="center">
  <img src="./public/screenshots/journal-interface.png" alt="OpenBook Journal Interface" width="600" />
</p>

<p align="center">
  <img src="./public/screenshots/waitlist-opengraph.png" alt="OpenBook Waitlist" width="600" />
</p>
