export type FeatureDetail = {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  shortcuts?: { key: string; description: string }[];
  readMoreLink?: string;
};

export const featureDetails: Record<string, FeatureDetail> = {
  "lightning-fast-interface": {
    id: "lightning-fast-interface",
    title: "Lightning-Fast Interface",
    description: "OpenBook is designed with speed in mind. Our keyboard-first approach means you can navigate, create, edit, and organize without ever taking your hands off the keyboard. The interface responds instantly to your commands, making your learning experience seamless and efficient.",
    keyPoints: [
      "Complete keyboard navigation eliminates mouse dependency",
      "Custom keyboard shortcuts for all common actions",
      "Command palette for quick access to any feature",
      "Instant search across all your notes and resources",
      "Split-screen view for working with multiple documents",
      "Distraction-free focus mode for deep work sessions"
    ],
    shortcuts: [
      { key: "Ctrl+K", description: "Open command palette" },
      { key: "Ctrl+P", description: "Quick search" },
      { key: "Ctrl+/", description: "Show all keyboard shortcuts" },
      { key: "Ctrl+B", description: "Toggle sidebar" },
      { key: "Alt+1-9", description: "Switch between notebooks" },
      { key: "Ctrl+E", description: "Create new note" }
    ]
  },
  "ai-powered-learning": {
    id: "ai-powered-learning",
    title: "AI-Powered Learning",
    description: "Leverage the power of artificial intelligence to enhance your learning experience. Our AI assistant understands your notes and learning patterns to provide personalized support exactly when you need it.",
    keyPoints: [
      "Smart explanations that adapt to your knowledge level",
      "AI-generated practice questions based on your notes",
      "Automated concept mapping to visualize connections",
      "Personalized learning paths based on your strengths and weaknesses",
      "Intelligent summarization of complex topics",
      "Memory-optimized review schedules"
    ]
  },
  "smart-search": {
    id: "smart-search",
    title: "Smart Search",
    description: "Find exactly what you're looking for in seconds. Our semantic search understands the meaning behind your query, not just keywords, making information retrieval effortless and precise.",
    keyPoints: [
      "Search by concepts, not just keywords",
      "Filter results by notebook, date, or content type",
      "Natural language queries for complex searches",
      "Save and reuse your most frequent searches",
      "Connect related notes automatically",
      "Search within images and PDFs with OCR technology"
    ]
  }
}; 