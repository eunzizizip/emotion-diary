import React, { useState } from 'react';
import CalendarComponent from "./CalendarComponent";
import EmotionLineChart from './EmotionLineChart';
import './Home.css';
import Header from './Header';

const Home = () => {
    const [chartData, setChartData] = useState([]);

    // 무한루프 방지: 데이터가 변경된 경우에만 setChartData 호출
    const handleDataUpdate = (newData) => {
        const oldDataString = JSON.stringify(chartData);
        const newDataString = JSON.stringify(newData);
        if (oldDataString !== newDataString) {
            setChartData(newData);
        }
    };

    return (
        <div className="home-container">
            <Header />
            <main>
                <div className="home-content-wrapper">
                    {/* 캘린더 영역 */}
                    <div className="calendar-section">
                        <h2 className="section-title">📅 오늘의 감정을 기록해보세요!</h2>
                        <CalendarComponent onDataUpdate={handleDataUpdate} />
                    </div>
                    
                    {/* 차트 영역 */}
                    <div className="chart-section">
                        <h2 className="section-title">이번 달 감정의 흐름</h2>
                        <EmotionLineChart data={chartData} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;