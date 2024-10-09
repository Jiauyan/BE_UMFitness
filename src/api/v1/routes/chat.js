const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");

router.get("/getAllUsers", chatController.getAllUsers);
router.get("/getChatroomsByuser/:uid", chatController.getChatroomsByUser);
router.post("/sendMessage/:chatroomId", chatController.sendMessage);
router.get("/getMessages/:chatroomId", chatController.getMessages);
router.get("/getMessages/:chatroomId", chatController.getMessages);
router.post("/createChatroom", chatController.createChatroom);
router.get("/getAllUsersWithoutMessagesFromOrToSender/:uid", chatController.getAllUsersWithoutMessagesFromOrToSender);

module.exports = router;