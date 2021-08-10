import { Router } from "express";
import  MessageController from "./controllers/messageController";
import verifyId from "./middlewares/verifyId";
import verifyBody from "./middlewares/verifyBody";

const routes = Router();

routes.get("/messages", MessageController.listAllMessages);
routes.get("/messages/:id", verifyId, MessageController.getMessageId);

routes.post("/message", verifyBody, MessageController.addMessage);

routes.put("/messages/:id", verifyId, verifyBody, MessageController.updateMessage);

routes.delete("/messages/:id", verifyId, MessageController.deleteMessage);

export default routes;