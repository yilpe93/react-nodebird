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
      include: [
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }],
        }, // 댓글 작성자
        { model: User, attributes: ["id", "nickname"] }, // 게시글 작성자
        { model: User, attributes: ["id"], as: "Likers" }, // 좋아요 누른 사람
      ],
    });

    res.status(201).json(fullPost);
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
      PostId: parseInt(req.params.postId),
      UserId: req.user.id,
    });

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });

    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/", (req, res) => {
  res.json({ id: 1 });
});

/* LIKE */
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const id = parseInt(req.params.postId);
    const post = await Post.findOne({ where: { id } });

    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }

    await post.addLikers(req.user.id);
    res.json({ PostId: id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* UN LIKE */
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const id = parseInt(req.params.postId);
    const post = await Post.findOne({ where: { id } });

    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }

    await post.removeLikers(req.user.id);
    res.json({ PostId: id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
