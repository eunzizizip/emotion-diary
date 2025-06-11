import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
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
            <h1 style={{ margin: 0 }}>dAy1</h1>

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
