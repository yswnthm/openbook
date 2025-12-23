# Track Spec: Interactive Onboarding Tutorial

## Context
New users to OpenBook need to quickly understand how to leverage the platform's unique features, such as the dual chat modes and research tools. A minimalist, interactive tutorial will guide them through the interface without being intrusive.

## Requirements
- **Overlay System:** Implement a lightweight, non-blocking overlay that highlights specific UI elements.
- **Step-by-Step Navigation:** Simple "Next" and "Previous" controls to guide the user through the tour.
- **Minimalist Design:** The tutorial UI must match OpenBook's clean aesthetic (Tailwind CSS v4).
- **Dismissible:** Users must be able to skip or close the tutorial at any time.
- **Persistence:** Track whether a user has seen the tutorial (via local storage or database) to prevent it from showing repeatedly.

## Key Highlights
1.  **AI Model Picker:** Explain how to switch between different AI providers.
2.  **Mode Toggle:** Explain the difference between "Chat" and "Research" modes.
3.  **Input Area:** Highlight rich text capabilities (attachments, LaTeX).
4.  **Sidebar:** Point out where to find history and saved notes.

## Technical Constraints
- Must use existing UI components (Radix UI) where possible.
- State management should be handled via React Context or local state.
- Ensure accessibility (keyboard navigation for the tour).
