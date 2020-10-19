const express = require("express");
const { Post, Image, Comment, User } = require("../models");
const { isLoggedIn } = require("./middlewares");
const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { content } = req.body;

    const post = await Post.create({
      content,
      UserId: req.user.id,
    });

    const fullPost = await Post.findOne({
      where: { id: postId },
      include: [{ model: Image }, { model: Comment }, { model: User }],
    });

    return res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }

    const { content } = req.body;

    const comment = await Comment.create({
      content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
