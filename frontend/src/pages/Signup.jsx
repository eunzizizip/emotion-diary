import { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [emailCheckMessage, setEmailCheckMessage] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "email") {
            setEmailValid(emailRegex.test(value));
            setIsEmailChecked(false);  // 이메일 변경 시 중복 체크 초기화
            setEmailCheckMessage("");
        }

        if (name === "password") {
            setPasswordValid(passwordRegex.test(value));
        }
    };

    const checkEmailDuplicate = async () => {
        if (!emailValid) {
            setEmailCheckMessage("올바른 이메일 형식이 아닙니다.");
            return;
        }
        try {
            const res = await axios.post("http://localhost:5000/check-email", { email: formData.email });
            setEmailCheckMessage(res.data.message);
            setIsEmailChecked(true);
        } catch (error) {
            setEmailCheckMessage("이미 사용 중인 이메일입니다.");
            setIsEmailChecked(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailValid) {
            alert("이메일 형식이 올바르지 않습니다.");
            return;
        }

        if (!passwordValid) {
            alert("비밀번호는 특수문자를 포함하여 8자 이상이어야 합니다.");
            return;
        }

        if (!isEmailChecked) {
            alert("이메일 중복 확인을 해주세요.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/register", formData);
            alert(res.data.message);
        } catch (error) {
            alert(error.response?.data?.message || "회원가입 실패!");
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="이름" onChange={handleChange} required />

                <div>
                    <input type="email" name="email" placeholder="이메일" onChange={handleChange} required />
                    <button type="button" onClick={checkEmailDuplicate}>중복 확인</button>
                    <p style={{ color: emailCheckMessage.includes("가능") ? "green" : "red" }}>{emailCheckMessage}</p>
                </div>

                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호 (8자 이상, 특수문자 포함)"
                    onChange={handleChange}
                    required
                />
                {!passwordValid && formData.password.length > 0 && (
                    <p style={{ color: "red" }}>비밀번호는 특수문자를 포함한 8자 이상이어야 합니다.</p>
                )}

                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default Signup;
