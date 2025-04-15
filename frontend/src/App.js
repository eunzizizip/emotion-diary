import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup'; // 회원가입 페이지
import Home from './pages/Home'; // 홈페이지 (캘린더 포함)
import DiaryPage from "./pages/DiaryPage";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} /> {/* 홈 페이지 (캘린더) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/diary/:date" element={<DiaryPage />} /> 
            </Routes>
        </Router>
    );
};

export default App;
