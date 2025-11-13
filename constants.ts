
import { BantStage } from './types';

export const BANT_STAGES_ORDER: BantStage[] = [
  BantStage.BUDGET,
  BantStage.AUTHORITY,
  BantStage.NEED,
  BantStage.TIMELINE,
];

export const BANT_STAGE_PROMPTS: Record<BantStage, string> = {
  [BantStage.BUDGET]: "First, let's talk about budget. What is the estimated budget for this project?",
  [BantStage.AUTHORITY]: "Great, thank you. Next, who will be the primary decision-maker for this purchase?",
  [BantStage.NEED]: "Understood. Now, could you describe the specific needs or challenges you're hoping to solve with this service?",
  [BantStage.TIMELINE]: "That's very clear. Finally, what is your ideal timeline for implementing this solution?",
  [BantStage.COMPLETED]: "Thank you for providing all the necessary information. I'm now creating your qualified lead summary.",
};
