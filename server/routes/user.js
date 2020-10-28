const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Op } = require("sequelize");

const { User, Post, Comment, Image } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

// 내 정보
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });

      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
}); // GET /user

// 회원가입
router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;

    // 중복 email 체크
    const exUser = await User.findOne({
      where: { email },
    });

    if (exUser) {
      /* 
        - Header => 상태, 용량, 시간, 쿠키
        - Body => 데이터
      */
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      nickname,
      password: hashedPassword,
    });

    // res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(201).send("ok");

    /* 
      # status
      - 200: 성공, 201: 잘 생성됨
      - 300: 리다이렉트
      - 400: 클라이언트 에러, 401: 허용되지 않은 요청(로그인 등), 403: 금지
      - 500: 서버 에러
    */
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

// 로그인
router.post("/login", isNotLoggedIn, (req, res, next) => {
  // Middleware 확장
  passport.authenticate("local", (err, user, info) => {
    // server error
    if (err) {
      console.error(err);
      return next(err);
    }

    // client error
    if (info) {
      return res.status(401).send(info.reason);
    }

    // passport module 자체 로그인
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });

      /* 
        - 프론트에선 보안 위협을 최소로 하기위한 Token === "cookie"
        - 서버 쪽에선 통으로 들고 있는 데이터 === "session"
      */
      res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

// 로그아웃
router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");

    if (err) {
      return res.status(403).send("관리자에게 문의해주세요.");
    }

    res.send("Logged out");
  });
});

// 회원정보 수정
router.patch("/info", isLoggedIn, async (req, res, next) => {
  try {
    const { nickname } = req.body;
    await User.update(
      {
        nickname,
      },
      { where: { id: req.user.id } }
    );

    res.status(200).json({ nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Follow
router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit),
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
}); // GET /user/followers

router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit),
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
}); // GET /user/followings

// 유저 정보
router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId) },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
    });

    if (user) {
      /* 개인정보 침해 예방 */
      const data = user.toJSON();

      data.Posts = data.Posts.length;
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;

      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
}); // GET /user/1

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });

    if (!user) {
      res.status(403).send("존재하지 않는 회원입니다.");
    }

    await user.addFollowers(req.user.id);

    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
}); // PATCH /user/1/follow

// Un Follow
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });

    if (!user) {
      res.status(403).send("존재하지 않는 회원입니다.");
    }

    await user.removeFollowers(req.user.id);

    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
}); // DELETE /user/1/follow

// Delete Follower
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
      res.status(403).send("존재하지 않는 회원입니다.");
    }

    await user.removeFollowings(req.user.id);

    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
}); // DELETE /user/follower/1

/* USER POSTS */
router.get("/:userId/posts", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId, 10) },
      attributes: {
        attributes: ["id"],
      },
    });

    if (!user) {
      return res.status(404).json("존재하지 않는 사용자입니다.");
    }

    const where = { UserId: parseInt(req.params.userId, 10) };

    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }

    const posts = await Post.findAll({
      where,
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
