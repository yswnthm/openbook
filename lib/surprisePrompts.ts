const PROMPTS: string[] = [
    // Deep thinking
    'Explain quantum computing in simple words.',
    'If time travel were possible, what paradox would you solve first?',
    'Describe consciousness in one tweet.',
    'What is something commonly misunderstood about black holes?',
    // Creativity
    'Invent a new holiday and describe how people celebrate it.',
    'Write a haiku about artificial intelligence.',
    'Pitch a movie where the protagonist is a sentient toaster.',
    // Fun Facts
    'Tell me a surprising fact about octopuses.',
    'What is the strangest law still in effect today?',
    'How do plants communicate with each other?',
    // Philosophy
    'Is reality objective or subjective? Defend your answer briefly.',
    'If you could ask an all-knowing oracle one question, what would yield the most valuable answer?',
    // Personal growth
    'Give me a 30-day challenge to improve my creativity.',
    'What habit has the highest ROI for mental health?',
    // Tech & future
    'Predict one technology that will change daily life in 10 years.',
    'Explain blockchain to a 5-year-old.',
    // Random
    'Generate a random showerthought that makes people ponder.',
    'What would cats write about humans in their secret diaries?',
    'Suggest a recipe that looks gourmet but uses only five ingredients.',
];

export function getRandomPrompt(): string {
    if (PROMPTS.length === 0) {
        return "Tell me something interesting you've learned recently.";
    }
    return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
}
