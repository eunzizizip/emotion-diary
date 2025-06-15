import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DiaryPage.module.css"; // CSS 모듈 임포트

const DiaryPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  const [diaryText, setDiaryText] = useState("");
  const [emotionType, setEmotionType] = useState("");
  const [comfortMessage, setComfortMessage] = useState("");
  const [existingDiary, setExistingDiary] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const userId = localStorage.getItem("user_id");

  const fetchDiary = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/diaries/${userId}/${date}`);
      if (res.data.length > 0) {
        setExistingDiary(res.data[0]);
        setDiaryText(res.data[0].content);
        setEmotionType(res.data[0].emotion_type);
        setComfortMessage(res.data[0].comfort_message || "");
        setIsEditing(false);
      } else {
        setExistingDiary(null);
        setDiaryText("");
        setEmotionType("");
        setComfortMessage("");
        setIsEditing(true);
      }
    } catch (err) {
      console.error("일기 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    if (!userId) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
    } else {
      fetchDiary();
    }
  }, [date, userId, navigate]);

  const handleSaveDiary = async () => {
    if (!diaryText || !emotionType) {
      alert("일기 내용과 감정을 모두 입력하세요.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/diary", {
        user_id: userId,
        content: diaryText,
        date,
        emotion_type: emotionType,
      });

      alert("일기가 저장되었습니다!");
      fetchDiary();
    } catch (err) {
      console.error("일기 저장 실패:", err);
      alert("일기 저장에 실패했습니다.");
    }
  };

  return (
    <div className={styles.diaryWrapper}>
      <div className={styles.diaryContainer}>
        <h2>📝 {date}</h2>

        {existingDiary && !isEditing && (
          <div className={styles.diaryInfo}>
            <p><strong>일기 내용:</strong> {existingDiary.content}</p>
            <p><strong>AI 위로글:</strong> {existingDiary.comfort_message}</p>
            <button className={styles.btn} onClick={() => setIsEditing(true)}>다시 작성하기</button>
          </div>
        )}

        {isEditing && (
          <div>
            <textarea
              className={styles.textarea}
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              placeholder="오늘 하루는 어떠셨나요? 💝"
              rows={5}
            />

            <div className={styles.emotionSelect}>
              <label>
                오늘의 감정 👉{" "}
                <select
                  className={styles.select}
                  value={emotionType}
                  onChange={(e) => setEmotionType(e.target.value)}
                >
                  <option value="">선택하세요</option>
                  <option value="행복">행복 ^^</option>
                  <option value="보통">그냥 쏘쏘 ㅡㅡ</option>
                  <option value="슬픔">흑흑 ㅠㅠ</option>
                </select>
              </label>
            </div>

            <button className={styles.btn} onClick={handleSaveDiary}>저장하기</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryPage;
