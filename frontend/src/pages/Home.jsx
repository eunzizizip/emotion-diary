// src/pages/Home.jsx
import React from 'react';
import { Link } from "react-router-dom";
import CalendarComponent from "./CalendarComponent";
import './Home.css'; // 추가한 CSS 파일
import Header from './Header';


const Home = () => {
    return (
        <div className="home-container">
            <Header />
            <main>
                <CalendarComponent />
            </main>
        </div>
    );
};

export default Home;
