import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/login", credentials);
            alert(res.data.message);
        } catch (error) {
            alert("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
        }
    };

    return (
        <div>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="이메일" onChange={handleChange} required />
                <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required />
                <button type="submit">로그인</button>
            </form>
            <p>아직 회원이 아니신가요? <Link to="/signup">회원가입</Link></p>
        </div>
    );
};

export default Login;
