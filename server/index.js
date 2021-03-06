const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const hpp = require("hpp");
const helmet = require("helmet");

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const hashtagRouter = require("./routes/hashtag");

const db = require("./models");

const passportConfig = require("./passport");

dotenv.config();
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: ["http://localhost:3000", "nodebird.com", "http://52.78.213.147"],
    credentials: true, // cookie 전달
  })
);

app.use("/", express.static(path.join(__dirname, "uploads"))); // OS에 따른 차이 Window => "\", Mac => "/"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* Image, Video, File => multipart/form-data */
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
  res.send("Hello Express");
});

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/posts", postsRouter);
app.use("/api/hashtag", hashtagRouter);

/* 
  # Error 처리 middleware
  app.use((err, req, res, next) => {});
*/

app.listen(80, () => {
  console.log("서버 실행 중");
});

/* 
  # npx sequelize init
  # npx sequelize db:create
*/
