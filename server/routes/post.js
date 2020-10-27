const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Image, Comment, User, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");
const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더 생성합니다.");
  fs.mkdirSync("uploads");
}

router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: parseInt(req.params.postId) },
    });

    if (!post) {
      return res.status(404).send("존재하지 않는 게시글입니다.");
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        { model: User, attributes: ["id"], as: "Likers" }, // 좋아요 누른 사람
      ],
    });

    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      // ex) 킴재쿤.png
      /* 파일명이 중복 될 경우 node는 앞에 파일을 엎어쓰기에 처리하는 과정 */
      const ext = path.extname(file.originalname); // 확장자 추출(png)
      const basename = path.basename(file.originalname, ext); // 파일명 추출(킴재쿤)
      done(null, basename + "_" + new Date().getTime() + ext); // 킴재쿤15184712891.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

/* 
  - none : text, json
  - single : 한 개의 파일
  - array : 여러 개의 파일
  - fields : File Input이 여러 개 일 경우
*/

/* 
  # multer key
  File => req.(file, files)
  text => req.body
*/

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    if (!req.user.id) {
      return res.status(403).send("로그인이 필요합니다.");
    }

    const { content } = req.body;
    const hashtags = content.match(/#[^\s#]+/g);

    const post = await Post.create({
      content,
      UserId: req.user.id,
    });

    /* Hashtag */
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          // Hashtag.create({ name: tag.slice(1).toLowerCase() })
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      ); // [[노드, true], [리액트,true]]

      await post.addHashtags(result.map((tag) => tag[0]));
    }

    /* Image Upload */
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러 개 올린 경우 image: [킴재쿤.png, 리재쿤,png]
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);
      } else {
        // 이미지 하나인 경우 image: 킴재쿤.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
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
}); // POST /post

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    if (!req.user.id) {
      return res.status(403).send("로그인이 필요합니다.");
    }

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
}); // POST /post/1/comment

router.delete("/:postId", isLoggedIn, async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(403).send("로그인이 필요합니다.");
    }

    Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });

    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
}); // DELETE /post/1

/* LIKE */
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    if (!req.user.id) {
      return res.status(403).send("로그인이 필요합니다.");
    }

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
}); // PATCH /post/1/like

/* UN LIKE */
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    if (!req.user.id) {
      return res.status(403).send("로그인이 필요합니다.");
    }

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
}); // DELETE /post/1/like

/* IMAGES UPLOAD */
router.post("/images", isLoggedIn, upload.array("image"), (req, res, next) => {
  if (!req.user.id) {
    return res.status(403).send("로그인이 필요합니다.");
  }

  // 이미지 업로드 후
  res.json(req.files.map((file) => file.filename));
}); // POST /post/images

/* RETWEET */
router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    if (!req.user.id) {
      return res.status(403).send("로그인이 필요합니다.");
    }

    const post = await Post.findOne({
      where: { id: parseInt(req.params.postId) },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });

    if (!post) {
      return res.status(403).send("존재하지 않는 게시글잆니다.");
    }

    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      /* 
        - 자신의 게시글 Retweet 할 수 없도록 체크
        - 남이 자신의 게시글 Retweet 한 것을 다시 Retweet 할 수 없도록 체크
      */
      return res.status(403).send("자신의 글은 리트윗할 수 없습니다.");
    }

    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });

    if (exPost) {
      return res.status(403).sned("이미 리트윗한 게시글입니다.");
    }

    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });

    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            { model: User, attributes: ["id"], as: "Likers" },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        // {
        //   model: User, // 좋아요 누른 사람
        //   as: "Likers",
        //   attributes: ["id"],
        // },
      ],
    });

    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
}); // POST /post/1/retweet

module.exports = router;
