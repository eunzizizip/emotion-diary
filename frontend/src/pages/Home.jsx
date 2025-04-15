// src/pages/Home.jsx
import React from 'react';
import { Link } from "react-router-dom";
import CalendarComponent from "./CalendarComponent";

const Home = () => {
    return (
        <div>
            <h1>AI 감정 일기</h1>
            <CalendarComponent />
            <Link to="/login">
                <button>로그인 페이지로 이동</button>
            </Link>
        </div>
    );
};

export default Home;
