import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // localStorage에서 username 읽기
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

    const handleMyPageClick = () => {
        if (!username) {
            navigate('/login');
        }
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ddd'
        }}>
            <h1 style={{ margin: 0 }}>dAy1</h1>

            {username ? (
                <div style={{ position: 'relative' }}>
                    <span
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {username}님 환영합니다!
                    </span>
                    {showDropdown && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                padding: '8px',
                                zIndex: 1000
                            }}
                        >
                            <button onClick={handleLogout}>로그아웃</button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={handleMyPageClick}
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
