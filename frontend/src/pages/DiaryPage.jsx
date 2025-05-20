import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DiaryPage = () => {
  const { date } = useParams();
  const [diaryText, setDiaryText] = useState("");
  const [userId] = useState(1); // TODO: 실제 로그인 사용자 ID로 교체
  const [diaries, setDiaries] = useState([]);
  const [comfortMessage, setComfortMessage] = useState("");
  const [emotionType, setEmotionType] = useState("");
  const [emotions, setEmotions] = useState({}); // 감정 정보를 저장할 상태 추가

  const fetchDiaries = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/diaries/${userId}/${date}`);
      setDiaries(res.data);
      const emotionsData = res.data.reduce((acc, diary) => {
        acc[diary.created_at] = diary.emotion_type; // 감정 타입을 날짜별로 저장
        return acc;
      }, {});
      setEmotions(emotionsData); // 감정 데이터 상태 업데이트
    } catch (err) {
      console.error("일기 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, [date]);

  const handleSaveDiary = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/diary", {
        user_id: userId,
        content: diaryText,
        date: date,
        emotion_type: emotionType,
      });

      setComfortMessage(res.data.comfortMessage || "위로글이 제공되지 않았습니다.");
      setDiaryText("");
      fetchDiaries();
      alert("일기가 저장되었습니다!");
    } catch (err) {
      console.error("일기 저장 실패:", err);
      alert("일기 저장에 실패했습니다.");
    }
  };


  return (
    <div>
      <h2>📝 {date}의 감정 일기</h2>
      
      <textarea
        value={diaryText}
        onChange={(e) => setDiaryText(e.target.value)}
        placeholder="오늘의 감정을 기록해보세요..."
        rows={5}
        cols={40}
      />

      <div style={{ margin: "10px 0" }}>
        <label>
          오늘의 감정 👉{" "}
          <select value={emotionType} onChange={(e) => setEmotionType(e.target.value)}>
            <option value="">선택하세요</option>
            <option value="행복">행복 ^^</option>
            <option value="보통">그냥 쏘쏘 ㅡㅡ</option>
            <option value="슬픔">흑흑 ㅠㅠ</option>
          </select>
        </label>
      </div>

      <button onClick={handleSaveDiary}>일기 저장</button>

      {comfortMessage && (
        <div style={{ marginTop: "20px", background: "#f8f8f8", padding: "15px", borderRadius: "10px" }}>
          <h3>💬 AI 위로글</h3>
          <p>{comfortMessage}</p>
        </div>
      )}

      <hr />

      <h3>📚 내 일기 목록</h3>
      {diaries.length === 0 ? (
        <p>작성한 일기가 없습니다.</p>
      ) : (
        <ul>
          {diaries.map((diary) => (
            <li key={diary.diary_id}>             
              <strong>{new Date(diary.created_at).toLocaleDateString()}</strong> - {diary.content}
              {diary.comfort_message && (
                <div style={{ marginTop: "10px", fontStyle: "italic", color: "#444" }}>
                  → AI 위로글: {diary.comfort_message}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DiaryPage;
