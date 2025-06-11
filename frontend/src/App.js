import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DiaryPage from "./pages/DiaryPage";
import Header from './pages/Header'; // ✅ Header 컴포넌트


const App = () => {

    useEffect(() => {
         //웹사이트 진입 시 자동 로그아웃
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        localStorage.clear();
    }, []);

    return (
        <Router>
            

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/diary/:date" element={<DiaryPage />} />
            </Routes>
        </Router>
    );
};

export default App;
