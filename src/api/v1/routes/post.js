const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");


router.get("/getAllPosts", postController.getAllPosts);
router.get("/getAllPostsByUid/:uid", postController.getAllPostsByUid);
router.get("/getPostById/:id", postController.getPostById);
router.post("/addPost", postController.addPost);
router.delete("/deletePost/:id", postController.deletePost);
router.patch("/updatePost/:id", postController.updatePost);

module.exports = router;