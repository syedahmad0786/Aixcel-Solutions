import { createVercelHandler } from "../server/ai-visibility-web-handler.mjs";
import { handleAdminNotificationRetry } from "../server/ai-visibility-core.mjs";

export default createVercelHandler(handleAdminNotificationRetry);
