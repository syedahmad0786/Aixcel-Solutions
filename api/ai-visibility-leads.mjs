import { createVercelHandler } from "../server/ai-visibility-web-handler.mjs";
import { handleLeadSubmission } from "../server/ai-visibility-core.mjs";

export default createVercelHandler(handleLeadSubmission);
