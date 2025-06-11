import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 감정 타입을 숫자로 변환
const emotionMap = {
  "슬픔": 1,
  "보통": 2,
  "행복": 3,
};

// 숫자를 감정으로 변환하는 역방향 맵
const emotionReverseMap = {
  1: "슬픔",
  2: "보통", 
  3: "행복"
};

const EmotionLineChart = ({ data = [] }) => {
  // 데이터가 없을 때 처리
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: 300, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#666',
        fontSize: '16px'
      }}>
        📊 이번 달 감정 데이터가 없습니다
      </div>
    );
  }

  const chartData = data
    .map((item) => ({
      date: `${item.date}일`, // "01일", "02일" 형식으로 표시
      emotionValue: emotionMap[item.emotion_type] || 0,
      emotionText: item.emotion_type, // 툴팁에서 사용
      fullDate: item.fullDate // MM-DD 형식의 전체 날짜
    }))
    .filter(item => item.emotionValue > 0); // 유효한 감정 데이터만 필터링

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`날짜: ${label}`}</p>
          <p style={{ margin: 0, color: '#f7afec' }}>{`감정: ${payload[0].payload.emotionText}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd" // 시작과 끝 레이블은 항상 표시
        />
        <YAxis 
          domain={[1, 3]} 
          ticks={[1, 2, 3]}
          tickFormatter={(value) => emotionReverseMap[value] || ''}
          tick={{ fontSize: 12 }}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="emotionValue" 
          stroke="#f7afec" 
          strokeWidth={3}
          dot={{ fill: '#f7afec', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: '#f7afec', strokeWidth: 2, fill: 'white' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EmotionLineChart;