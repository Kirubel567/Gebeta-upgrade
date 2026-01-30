import { handleUserMessage } from "./chat.controller.js";
import { asyncHandler } from "../../lib/middleware.js";

export const registerChatRoutes = (app) => {
    app.post("/api/chat", asyncHandler(handleUserMessage));
};
