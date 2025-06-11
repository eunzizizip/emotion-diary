import { useState } from "react";
import axios from "axios";
import './Signup.css';

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

    const isFormValid = formData.username.trim() !== "" && emailValid && passwordValid && isEmailChecked;

    return (
        <div className="signup-container">
            <h2>회원가입 정보를 <br /> 입력해주세요</h2>
            <form onSubmit={handleSubmit}>

                <div className="inputTitle">사용자 이름</div>
                <input
                    type="text"
                    name="username"
                    placeholder="이름"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <div className="inputTitle" style={{ marginTop: '20px' }}>이메일 주소</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="test@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ flexGrow: 1 }}
                    />
                    <button type="button" onClick={checkEmailDuplicate} style={{ marginLeft: '10px' }}>
                        중복 확인
                    </button>
                </div>
                {emailCheckMessage && (
                    <p className={emailCheckMessage.includes("가능") ? "green" : "red"}>
                        {emailCheckMessage}
                    </p>
                )}

                <div className="inputTitle" style={{ marginTop: '20px' }}>비밀번호</div>
                <input
                    type="password"
                    name="password"
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {!passwordValid && formData.password.length > 0 && (
                    <p className="red">비밀번호는 특수문자를 포함한 8자 이상이어야 합니다.</p>
                )}

                <button 
                    type="submit" 
                    className={isFormValid ? "active" : ""}
                    disabled={!isFormValid}
                    style={{ marginTop: '30px' }}
                >
                    회원가입
                </button>
            </form>
        </div>
    );
};

export default Signup;
