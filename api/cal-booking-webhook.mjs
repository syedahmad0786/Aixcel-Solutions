import { createVercelHandler } from "../server/ai-visibility-web-handler.mjs";
import { handleCalWebhook } from "../server/ai-visibility-core.mjs";

export default createVercelHandler(handleCalWebhook);
