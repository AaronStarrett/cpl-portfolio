export type Scene = {
  title: string;
  caption: string;
  duration: number;
  nodes?: string[];
};
export type Story = {
  label: string;
  renderer: "ipermit" | "bea" | "workforce" | "process";
  scenes: Scene[];
};
const scene = (title: string, caption: string, duration = 9000): Scene => ({
  title,
  caption,
  duration,
});
export const stories: Record<string, Story> = {
  ipermit: {
    renderer: "ipermit",
    label: "Animated workflow walkthrough - illustrative data",
    scenes: [
      scene(
        "A job arrives",
        "A fictional Zoho job enters one shared intake. Keep the source information together before preparing it for the city.",
      ),
      scene(
        "Make the data usable",
        "Split the job from the incoming batch, trim extra spaces, and normalize city and company fields.",
      ),
      scene(
        "Validate and enrich",
        "Check company information, identify the city, then retrieve and merge contractor details. Required fields must be complete.",
      ),
      scene(
        "One router. The right city.",
        "The parent workflow routes this supported pilot job to Dublin. Other or inactive city routes go to review.",
      ),
      scene(
        "Prepare the Dublin payload",
        "The child workflow applies city configuration, maps permit types and fees, and assembles the payload and PDF-fill request.",
      ),
      scene(
        "Ready for a handoff",
        "A readiness check separates incomplete jobs for review. A complete job becomes a prepared UiPath queue item.",
      ),
      scene(
        "UiPath takes the browser work",
        "Conceptual downstream scene: UiPath uses the prepared data for browser/UI automation. The screenshots establish preparation, not a completed run.",
      ),
      scene(
        "Designed to grow city by city",
        "Keep the shared intake. Add city-specific child workflows as future expansion. Dublin is the pilot shown in the evidence.",
      ),
    ],
  },
  bea: {
    renderer: "bea",
    label: "Animated product walkthrough - illustrative data and behavior",
    scenes: [
      scene(
        "A clear view of the work",
        "An operations overview puts customer context, work requiring attention, and recent activity in one workspace.",
      ),
      scene(
        "Focus on one customer",
        "A fictional Cedar House project needs a follow-up. The selected row brings the customer into the conversation.",
      ),
      scene(
        "Ask in context",
        "“Show me the latest report for this customer.” The sample request stays connected to the selected project.",
      ),
      scene(
        "Make room for the report",
        "The orb and command area move aside while the report opens in the adjacent workspace. Context stays visible.",
      ),
      scene(
        "Understand the finding",
        "A scripted explanation highlights the report’s open item: a missing site photo. The operator can inspect the source before acting.",
      ),
      scene(
        "Prepare the next step",
        "An illustrative email draft asks for the missing photo. It remains a draft awaiting a person’s decision.",
      ),
      scene(
        "Keep the human in control",
        "The operator reviews the recipient and wording, then approves the illustrated next action. Nothing is sent by this portfolio.",
      ),
      scene(
        "Close the loop",
        "An illustrative activity entry records the reviewed action, then the workspace returns to the overview. This is a scripted product story.",
      ),
    ],
  },
  workforce: {
    renderer: "workforce",
    label: "Illustrated workforce workflow - sample task",
    scenes: [
      scene(
        "Aaron sets the brief",
        "A scoped request starts the assignment: research a practical business opportunity. The organization begins in standby.",
      ),
      scene(
        "The right work, to the right manager",
        "CEO Bot routes the research assignment to Marcus, who leads Revenue Ventures.",
      ),
      scene(
        "Three focused contributions",
        "Marcus assigns demand research to Logan, viability evaluation to Claire, and offer framing to Blake.",
      ),
      scene(
        "Bring the evidence together",
        "Research notes, an evaluation checklist, and an offer outline return to Marcus. These tool interactions are illustrated.",
      ),
      scene(
        "One recommendation",
        "Marcus consolidates evidence, assumptions, and open questions. Specialists finish their scoped stage.",
      ),
      scene(
        "Aaron decides what happens next",
        "Human review authorizes the next step. A recommendation does not itself authorize a launch or outreach.",
      ),
      scene(
        "Record the decision",
        "After the research stage closes, Jack updates durable knowledge in a separate stage. The decision remains available for later work.",
      ),
      scene(
        "Back to standby",
        "The assignment closes with a recorded result. Configured digital employees are dormant by default, not continuously operating.",
      ),
    ],
  },
};
