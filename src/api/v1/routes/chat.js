const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");

router.get("/getAllUsers", chatController.getAllUsers);
router.get("/getChatroomsBySender/:uid", chatController.getChatroomsBySender);
router.post("/sendMessage/:chatroomId", chatController.sendMessage);
router.get("/getMessages/:chatroomId", chatController.getMessages);
router.get("/getMessages/:chatroomId", chatController.getMessages);
router.get("/getAllUsersWithoutMessagesFromSender/:uid", chatController.getAllUsersWithoutMessagesFromSender);
router.post("/createChatroom", chatController.createChatroom);

module.exports = router;