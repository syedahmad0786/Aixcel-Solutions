import { createVercelHandler } from "../server/ai-visibility-web-handler.mjs";
import { handleLeadConfig } from "../server/ai-visibility-core.mjs";

export default createVercelHandler(handleLeadConfig);
