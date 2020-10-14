const express = require("express");
const postRouter = require("./routes/post");

const app = express();

app.use("/api/post", postRouter);

app.listen(3060, () => {
  console.log("서버 실행 중");
});
