import axios from "axios";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const CalendarComponent = ({ onDataUpdate }) => {
  const [date, setDate] = useState(new Date());
  const [emotions, setEmotions] = useState({});
  const [allEmotionsData, setAllEmotionsData] = useState([]); // 전체 감정 데이터 저장
  const [currentViewDate, setCurrentViewDate] = useState(new Date()); // 현재 보고 있는 캘린더 월
  const navigate = useNavigate();

  // 전체 감정 데이터 가져오기
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
        setAllEmotionsData(res.data); // 전체 데이터 저장
      } catch (err) {
        console.error("감정 데이터 불러오기 실패:", err);
      }
    };
    fetchEmotions();
  }, []);

  // 현재 보고 있는 월의 데이터만 필터링하여 차트에 전달
  useEffect(() => {
    if (onDataUpdate && allEmotionsData.length > 0) {
      const currentYear = currentViewDate.getFullYear();
      const currentMonth = currentViewDate.getMonth() + 1; // getMonth()는 0부터 시작

      const monthlyData = allEmotionsData
        .filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate.getFullYear() === currentYear && 
                 itemDate.getMonth() + 1 === currentMonth;
        })
        .map(item => ({
          date: new Date(item.created_at).toLocaleDateString("ko-KR", {
            day: "2-digit",
          }).replace(".", ""), // 일만 표시 (01, 02, 03...)
          fullDate: new Date(item.created_at).toLocaleDateString("ko-KR", {
            month: "2-digit",
            day: "2-digit",
          }).replace(/\. /g, "-").replace(".", ""), // MM-DD 형식
          emotion_type: item.emotion_type,
        }))
        .sort((a, b) => {
          // 일자별로 정렬
          return parseInt(a.date) - parseInt(b.date);
        });

      onDataUpdate(monthlyData);
    }
  }, [onDataUpdate, allEmotionsData, currentViewDate]);

  const handleDateClick = (selectedDate) => {
    setDate(selectedDate);
    const formattedDate = selectedDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\. /g, "-").replace(".", "");

    console.log("이동할 주소:", `/diary/${formattedDate}`);
    navigate(`/diary/${formattedDate}`);
  };

  // 캘린더 월 변경 감지
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    if (activeStartDate) {
      setCurrentViewDate(activeStartDate);
    }
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
    <div className="calendar-component">
      <Calendar
        onChange={handleDateClick}
        value={date}
        tileClassName={tileClassName}
        onActiveStartDateChange={handleActiveStartDateChange}
      />
      
      {/* 감정 범례 */}
      <div className="emotion-legend">
        <div className="legend-item">
          <div className="legend-dot legend-dot--happy"></div>
          <span>행복</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot legend-dot--normal"></div>
          <span>보통</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot legend-dot--sad"></div>
          <span>슬픔</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;