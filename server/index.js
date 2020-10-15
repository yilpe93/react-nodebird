const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const db = require("./models");
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.listen(3065, () => {
  console.log("서버 실행 중");
});

/* 
  # npx sequelize init
  # npx sequelize db:create
*/
