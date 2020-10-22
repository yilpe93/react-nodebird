const express = require("express");

const { Post, User, Image, Comment } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { lastId } = req.body;
    const posts = await Post.findAll({
      // where: { id: lastId },
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ], // DESC, ASC
      include: [
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
        { model: User, attributes: ["id", "nickname"] },
        { model: User, attributes: ["id"], as: "Likers" },
      ],
      // offset: 0, // 1 ~ 10, 11 ~ 20, ..., 101 ~ 110
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
