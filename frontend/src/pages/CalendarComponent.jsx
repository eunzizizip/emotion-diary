import React, { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅
import "react-calendar/dist/Calendar.css"; // 주석 해제

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate(); // useNavigate 훅 추가

  const handleDateClick = (selectedDate) => {
    setDate(selectedDate);
    const formattedDate = selectedDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\. /g, "-").replace(".", ""); // YYYY-MM-DD 포맷 변환
    navigate(`/diary/${formattedDate}`);
  };
  

  return (
    <div>
      <h2>📅 오늘의 감정을 기록해보세요!</h2>
      <Calendar onChange={handleDateClick} value={date} />
    </div>
  );
};

export default CalendarComponent;
