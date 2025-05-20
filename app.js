require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

// 허용할 클라이언트 도메인 목록
const allowedOrigins = [
  "https://cafe.naver.com",
  "https://cafe.naver.com/dunggeure",
  "https://regulatory-jo-ann-devdanielnam-9645cb09.koyeb.app/",
];

// CORS 설정
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS 정책에 의해 차단됨"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// 보안 헤더 설정
app.use((req, res, next) => {
  // Content-Security-Policy 설정 (frame-ancestors로 iframe 허용)
  res.setHeader(
    "Content-Security-Policy",
    `frame-ancestors 'self' ${allowedOrigins.join(" ")}`
  );
  next();
});

// 최신 유튜브 동영상 embed URL로 리다이렉트
app.get("/get/dunggeure-cafe-gate-youtube", async (req, res) => {
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${process.env.CHANNEL_ID}&part=snippet,id&order=date&maxResults=1&type=video`;
    const response = await axios.get(apiUrl);
    const videoId = response.data.items[0].id.videoId;

    res.redirect(302, `https://www.youtube.com/embed/${videoId}`);
  } catch (error) {
    res.status(500).send("최신 동영상을 가져오는 데 실패했습니다.");
  }
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});
