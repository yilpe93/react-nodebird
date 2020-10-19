const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // Login 전략

          /* 
            1. 기존 유저가 있는지 체크
          */
          const user = await User.findOne({
            where: { email },
          });

          if (!user) {
            // (서버 에러, 성공, 클라이언트 에러)
            return done(null, false, { reason: "존재하지 않는 사용자입니다!" });
          }

          /* 
            2. db에 암호화된 비밀번호와 비교
          */
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }

          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
