require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateComfortMessage = require("./openai");

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("❌ JWT_SECRET is not defined!");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ✅ MySQL 연결
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootpw",
  database: "emotion_diary",
  charset: 'utf8mb4',
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL 연결 실패:", err);
    return;
  }
  console.log("✅ MySQL 연결 성공!");
});

// ✅ 이메일 중복 확인
app.post("/check-email", (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "서버 오류", error: err });
    if (results.length > 0) return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
    res.json({ message: "사용 가능한 이메일입니다." });
  });
});

// ✅ 회원가입
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const checkEmailSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "서버 오류", error: err });
      if (results.length > 0) return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertSql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      db.query(insertSql, [username, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: "회원가입 실패", error: err });
        res.status(201).json({ message: "회원가입 성공!" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "오류 발생", error });
  }
});

// ✅ 로그인
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "로그인 실패", error: err });
    if (results.length === 0) return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });

    const token = jwt.sign({ userId: user.user_id }, jwtSecret, { expiresIn: "1h" });
    res.json({ message: "로그인 성공!", token, userId: user.user_id, username: user.username });
  });
});

// ✅ 일기 저장 (같은 날짜의 일기는 삭제 후 저장)
app.post("/api/diary", async (req, res) => {
  const { user_id, content, date, emotion_type } = req.body;

  try {
    const finalEmotion = emotion_type && emotion_type.trim() !== "" ? emotion_type : "없음";
    const comfortMessage = await generateComfortMessage(content, finalEmotion);

    const deleteQuery = `
      DELETE d, e
      FROM diaries d
      LEFT JOIN emotions e ON d.diary_id = e.diary_id
      WHERE d.user_id = ? AND DATE(d.created_at) = ?
    `;

    db.query(deleteQuery, [user_id, date], (deleteErr) => {
      if (deleteErr) {
        console.error("기존 일기 삭제 실패:", deleteErr);
        return res.status(500).json({ message: "기존 일기 삭제 실패" });
      }

      const diaryQuery = "INSERT INTO diaries (user_id, content, created_at) VALUES (?, ?, ?)";
      db.query(diaryQuery, [user_id, content, date], (diaryErr, result) => {
        if (diaryErr) {
          console.error("일기 저장 실패:", diaryErr);
          return res.status(500).json({ message: "일기 저장 실패" });
        }

        const diaryId = result.insertId;
        const emotionQuery = "INSERT INTO emotions (diary_id, emotion_type, ai_message) VALUES (?, ?, ?)";
        db.query(emotionQuery, [diaryId, finalEmotion, comfortMessage], (emotionErr) => {
          if (emotionErr) {
            console.error("감정 저장 실패:", emotionErr);
            return res.status(500).json({ message: "감정 저장 실패" });
          }

          res.status(200).json({
            message: "기존 일기를 삭제하고 새로 저장했습니다.",
            comfortMessage,
            diaryId,
          });
        });
      });
    });
  } catch (err) {
    console.error("위로글 생성 실패:", err);
    res.status(500).json({ message: "위로글 생성 실패", error: err });
  }
});

// ✅ 일기 조회 (날짜별)
app.get("/diaries/:userId/:date", (req, res) => {
  const { userId, date } = req.params;
  const sql = `
    SELECT d.*, e.ai_message AS comfort_message
    FROM diaries d
    LEFT JOIN emotions e ON d.diary_id = e.diary_id
    WHERE d.user_id = ? AND DATE(d.created_at) = ?
    ORDER BY d.created_at DESC
  `;

  db.query(sql, [userId, date], (err, results) => {
    if (err) return res.status(500).json({ message: "일기 조회 실패", error: err });
    res.json(results);
  });
});

// ✅ 전체 일기 목록 조회 (로그인한 사용자만)
app.get("/diaries/user/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT d.*, e.emotion_type, e.ai_message AS comfort_message
    FROM diaries d
    LEFT JOIN emotions e ON d.diary_id = e.diary_id
    WHERE d.user_id = ?
    ORDER BY d.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "사용자 일기 조회 실패", error: err });
    res.json(results);
  });
});

// 🔒 로그인한 사용자의 감정 데이터만 조회
app.get("/emotions/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT e.diary_id, e.emotion_type, e.ai_message, d.created_at
    FROM emotions e
    JOIN diaries d ON e.diary_id = d.diary_id
    WHERE d.user_id = ?                -- ✅ 이 조건 추가!
    ORDER BY d.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "감정 데이터 조회 실패", error: err });
    res.json(results);
  });
});


// ✅ 기본 라우트
app.get("/", (req, res) => {
  res.send("서버가 정상적으로 실행 중입니다!");
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중`);
});
