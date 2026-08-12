import { createVercelHandler } from "../server/ai-visibility-web-handler.mjs";
import { handleLeadEvent } from "../server/ai-visibility-core.mjs";

export default createVercelHandler(handleLeadEvent);
