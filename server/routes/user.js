const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User, Post } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

// 유저 정보
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
          },
          {
            model: User,
            as: "Followers",
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
});

// 회원가입
router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;
    console.log("res", email, nickname, password);

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
router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

module.exports = router;
