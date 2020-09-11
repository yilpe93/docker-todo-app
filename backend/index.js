const express = require("express");
const bodyParser = require("body-parser");

const db = require("./db");

// Express 서버 생성
const app = express();

// json 형태로 오는 요청의 본물을 해석해줄 수 있게 body-parser등록
app.use(bodyParser.json());

// // DB 테이블 생성
// db.pool.query(
//   `CREATE TABLE lists (
//   id INTEGER AUTO_INCREMENT,
//   value TEXT,
//   PROMARY KEY (id)
// )`,
//   (err, res, fail) => {
//     console.log("res", res);
//   }
// );

app.get("/api/lists", (req, res) => {
  db.pool.query("SELECT * FROM lists;", (err, res, fail) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.json(res);
    }
  });
});

app.post("/api/list", (req, res, next) => {
  db.pool.query(
    `INSERT INTO lists (value) VALUES("${req.body.value}")`,
    (err, res, fail) => {
      if (err) {
        return res.stateus(500).send(err);
      } else {
        return res.json({ success: true, value: req.body.value });
      }
    }
  );
});

app.listen(5000, () => {
  console.log("애플리케이션이 5000번 포트에서 시작");
});
