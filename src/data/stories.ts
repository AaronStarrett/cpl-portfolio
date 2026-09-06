import { extraWorkApprovalStories } from "./extra-work-approval-stories";
export type Scene = {
  title: string;
  caption: string;
  duration: number;
  nodes?: string[];
};
export type Story = {
  label: string;
  renderer: "ipermit" | "bea" | "workforce" | "process" | "job-intake-cleaner";
  scenes: Scene[];
};
const scene = (title: string, caption: string, duration = 9000): Scene => ({
  title,
  caption,
  duration,
});
export const stories: Record<string, Story> = {
  ...extraWorkApprovalStories,
  "job-intake-cleaner": {
    renderer: "job-intake-cleaner",
    label: "Fictional electrical request · scripted walkthrough · no live AI call",
    scenes: [
      scene("A messy request arrives", "Casey Morgan asks to replace two ceiling fans and examine an outdoor outlet. A phone number is supplied, but the service address is absent and Friday has no reference date.", 9000),
      scene("Details become a job card", "The prepared illustration separates the contact, phone, requested work, timing, and access notes. Exact source quotes support extracted details; they do not certify accuracy.", 9000),
      scene("Show what needs attention", "Three of four required checks are satisfied. The address is missing. Friday stays in the customer's words; no calendar date is invented. A usable phone is enough—email is not also required.", 9000),
      scene("Correct the service address", "The fictional operator supplies 24 Example Lane, Exampleton, NY 10001. This is marked as a user correction, not a source extraction. Try editing the address: the next draft and export use your current value. Human review remains outstanding.", 11000),
      scene("Prepare the relevant follow-up", "With the service address entered, the follow-up asks which calendar date Friday means. Clearing the address adds an address question again. The stated phone preference is retained; nothing is sent or booked.", 9000),
      scene("Export the current job card", "The fictional JSON download contains the current corrected address, original timing, an unresolved exact date, and draft review status. The actual application also implements copy, CSV, and printing. This walkthrough makes no provider calls.", 9000),
    ],
  },
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
