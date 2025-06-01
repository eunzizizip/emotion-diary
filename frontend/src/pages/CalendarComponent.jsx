import axios from "axios";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; // 커스텀 스타일

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [emotions, setEmotions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const res = await axios.get(`http://localhost:5000/emotions/${userId}`);
        const emotionsData = res.data.reduce((acc, emotion) => {
          const createdDate = new Date(emotion.created_at);
          const formattedDate = createdDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).replace(/\. /g, "-").replace(".", "");
          if (formattedDate) {
            acc[formattedDate] = emotion.emotion_type;
          }
          return acc;
        }, {});
        setEmotions(emotionsData);
      } catch (err) {
        console.error("감정 데이터 불러오기 실패:", err);
      }
    };
    fetchEmotions();
  }, []);

  const handleDateClick = (selectedDate) => {
    setDate(selectedDate);
    const formattedDate = selectedDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\. /g, "-").replace(".", "");
    navigate(`/diary/${formattedDate}`);
  };

  const tileClassName = ({ date }) => {
    const formattedDate = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\. /g, "-").replace(".", "");

    const emotion = emotions[formattedDate];
    return emotion === "행복"
      ? "react-calendar__tile--hasDots react-calendar__tile--happy"
      : emotion === "보통"
      ? "react-calendar__tile--hasDots react-calendar__tile--normal"
      : emotion === "슬픔"
      ? "react-calendar__tile--hasDots react-calendar__tile--sad"
      : "";
  };

  return (
    <div className="calendar-wrapper">
      <h2 className="calendar-title">📅 오늘의 감정을 기록해보세요!</h2>
      <Calendar
        onChange={handleDateClick}
        value={date}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default CalendarComponent;
