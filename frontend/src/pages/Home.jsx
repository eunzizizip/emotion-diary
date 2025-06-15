import React, { useState } from 'react';
import CalendarComponent from "./CalendarComponent";
import EmotionLineChart from './EmotionLineChart';
import './Home.css';
import Header from './Header';

const Home = () => {
    const [activeTab, setActiveTab] = useState('write'); // 기본값 '일기 작성하기'
    const [chartData, setChartData] = useState([]);

    const handleDataUpdate = (newData) => {
        const oldDataString = JSON.stringify(chartData);
        const newDataString = JSON.stringify(newData);
        if (oldDataString !== newDataString) {
            setChartData(newData);
        }
    };

    return (
        <div className="home-container">
            <Header activeTab={activeTab} onTabChange={setActiveTab} />

            <main style={{ padding: '20px' }}>
                {activeTab === 'write' && (
                    <div className="write-section" style={{ display: 'flex', gap: '40px' }}>
                        <div className="calendar-section" style={{ flex: 1 }}>
                            <h2 className="section-title">🗓️ 캘린더에서 날짜를 콕! 눌러 일기를 작성하세요♡</h2>
                            <CalendarComponent onDataUpdate={handleDataUpdate} />
                        </div>
                        <div className="description-section" style={{ flex: 1, padding: '0 20px' }}>
                            <h2>"하루 끝에 남는 건… AI의 위로뿐이야 😌"</h2>
                            <p>
                                dAy 1 = day + AI 💡<br></br>
                                감정을 꾹꾹 눌러 담은 일기,  
                                AI가 읽고 조용히 위로를 건네요 💌  
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'analysis' && (
                    <div className="analysis-section">
                        <h2 className="section-title">이번 달 감정의 흐름</h2>
                        <EmotionLineChart data={chartData} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
