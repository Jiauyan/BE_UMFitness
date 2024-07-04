const postService = require("../services/postService");

// add post
const addPost = async (req, res) => {
    try {
        const {postDetails, uid} = req.body;
        const addNewPost = await postService.addPost(
            postDetails,
            uid
        );
        return res.status(200).json(addNewPost);
    }catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// edit post
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { postDetails, uid } = req.body;
        const updatePost = await postService.updatePost(
            id,
            uid,
            postDetails
        );
        return res.status(200).json(updatePost);
    }catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// delete post
const deletePost = async (req, res) => {
    try {
      const { id } = req.params;
      const deletePost= await postService.deletePost(id);
      return res.status(200).json(deletePost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

// get post by uid
const getAllPostsByUid = async (req, res) => {
    try {
      const { uid } = req.params;
      const allPostsByUid = await postService.getPostByUid(uid);
      return res.status(200).json(allPostsByUid);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      return res.status(400).json({ message: err.message });
    }
};

// get post by id
const getPostById= async (req, res) => {
    try {
      const { id } = req.params;
      const findOnePost= await postService.getPostById(id);
      return res.status(200).json(findOnePost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

// get all post
const getAllPosts= async (req, res) => {
    try {
      const findAllPosts = await postService.getAllPosts();
      return res.status(200).json(findAllPosts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

module.exports = {
    addPost,
    updatePost,
    deletePost,
    getAllPostsByUid,
    getPostById,
    getAllPosts
};