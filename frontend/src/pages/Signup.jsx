import { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [emailCheckMessage, setEmailCheckMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const checkEmailDuplicate = async () => {
        if (!formData.email) return;
        try {
            const res = await axios.post("http://localhost:5000/check-email", { email: formData.email });
            setEmailCheckMessage(res.data.message);
        } catch (error) {
            setEmailCheckMessage("이미 사용 중인 이메일입니다.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/register", formData);
            alert(res.data.message);
        } catch (error) {
            alert(error.response.data.message || "회원가입 실패!");
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="이름" onChange={handleChange} required />
                <input type="email" name="email" placeholder="이메일" onChange={handleChange} required onBlur={checkEmailDuplicate} />
                <p>{emailCheckMessage}</p>
                <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required />
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default Signup;
