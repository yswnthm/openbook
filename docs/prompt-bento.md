# Features Section Refactor Prompt

## Goal
Refactor `components/landing/features-section.tsx` into a premium "Bento Grid" layout.

## Layout & Architecture
**Grid Structure:** 2 Rows, 5 Cards Total.
- **Row 1 (Top):** 2 Cards (Large Left, Small Right)
- **Row 2 (Bottom):** 3 Cards (Equal Grid)

## Feature Mapping & Content
### 1. Top Left (Large) - Chat Mode
- **Content:** "Explain the Chat Mode."
- **Visuals:** Use the existing `ChatCompactConfirmation` component (from `@/components/features/chat`) if suitable, or a similar mocked chat interface.
- **Animation:** Meaningful Lottie animation showing the chat "thinking" or "typing".

### 2. Top Right (Small) - Journal Mode
- **Content:** "Explain the Journal Mode."
- **Visuals:** Mockup or component representing the Journal interface.
- **Animation:** Lottie animation (e.g., writing, organizing).

### 3. Bottom Left - Socratic Tutor (Study Mode 1)
- **Content:** "Socratic Tutor explanation."
- **Visuals:** Card style.
- **Animation:** Lottie animation representing Socratic questioning or dialogue.

### 4. Bottom Middle - Feynman Method (Study Mode 2)
- **Content:** "Feynman Method explanation."
- **Visuals:** Card style.
- **Animation:** Lottie animation representing simplifying concepts (e.g., untangling nodes).

### 5. Bottom Right - Smart Search
- **Content:** "Smart Search grid."
- **Visuals:** Reuse existing `Search` component logic or visuals.
- **Animation:** Lottie animation for searching/finding.

## Technical Implementation
- **Components:** Reuse existing components from `@/components/features/...` where possible to save time and maintain consistency.
- **Animations:** Use **Lottie** for all animations. (Install `lottie-react` if needed).
- **Styling:** Premium, glassmorphic or clean card style consistent with the rest of the landing page.
- **Responsive:** Stack vertically on mobile.
