import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('username');
        if (storedUser) {
            setUsername(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        window.location.reload();
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            backgroundColor: '#c8e6a8',
            borderBottom: '1px solid #ddd'
        }}>
            <h1 style={{ margin: 0 }}>dAy 1</h1>

            <nav style={{ display: 'flex', gap: '16px' }}>
                <button
                    onClick={() => onTabChange('write')}
                    style={{
                        backgroundColor: activeTab === 'write' ? '#8bc34a' : 'transparent',
                        border: 'none',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'write' ? 'bold' : 'normal',
                        borderRadius: '8px'
                    }}
                >
                    일기 작성하기
                </button>

                <button
                    onClick={() => onTabChange('analysis')}
                    style={{
                        backgroundColor: activeTab === 'analysis' ? '#8bc34a' : 'transparent',
                        border: 'none',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'analysis' ? 'bold' : 'normal',
                        borderRadius: '8px'
                    }}
                >
                    일기 한달 분석
                </button>
            </nav>

            {username ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{username}님 환영합니다!</span>
                    <button
                        onClick={handleLogout}
                        style={{
                            backgroundColor: '#ccc',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        backgroundColor: 'pink',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    My Page
                </button>
            )}
        </header>
    );
};

export default Header;
