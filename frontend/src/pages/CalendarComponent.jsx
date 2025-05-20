
import axios from "axios"; // axios 임포트 추가
import React, { useEffect, useState } from "react"; // useEffect 임포트 추가
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';


const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [emotions, setEmotions] = useState({}); // 감정 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 추가

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/emotions");
        console.log("응답 데이터 확인:", res.data); // 응답 데이터를 확인
        const emotionsData = res.data.reduce((acc, emotion) => {
          const createdDate = new Date(emotion.created_at); // created_at을 Date 객체로 변환
          const formattedDate = createdDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).replace(/\. /g, "-").replace(".", ""); // 날짜 포맷 YYYY-MM-DD로 변환
  
          if (formattedDate) {
            acc[formattedDate] = emotion.emotion_type; // 날짜별 감정 정보를 저장
          }
          return acc;
        }, {});
        setEmotions(emotionsData); // 감정 상태 업데이트
        console.log("emotions 객체 확인:", emotionsData); // 감정 데이터 확인
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
    }).replace(/\. /g, "-").replace(".", ""); // YYYY-MM-DD 포맷 변환
    navigate(`/diary/${formattedDate}`);
  };

  const tileClassName = ({ date, view }) => {
    const formattedDate = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\. /g, "-").replace(".", "");

    const emotion = emotions[formattedDate]; // 해당 날짜의 감정 가져오기
    
    const className =
    emotion === "행복"
      ? "react-calendar__tile--hasDots react-calendar__tile--happy"
      : emotion === "보통"
      ? "react-calendar__tile--hasDots react-calendar__tile--normal"
      : emotion === "슬픔"
      ? "react-calendar__tile--hasDots react-calendar__tile--sad"
      : "";

  if (className) {
    console.log(`${formattedDate} → ${className}`);
  }

  return className;
  };
  

  return (
    <div>
      <h2>📅 오늘의 감정을 기록해보세요!</h2>
      <Calendar onChange={handleDateClick} value={date} tileClassName={tileClassName}/>
    </div>
  );
};

export default CalendarComponent;
