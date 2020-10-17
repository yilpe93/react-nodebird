const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const router = express.Router();

// 회원가입
router.post("/", async (req, res, next) => {
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
      - 400: 클라이언트 에러
      - 500: 서버 에러
    */
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

// 로그인
router.post("/login", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
