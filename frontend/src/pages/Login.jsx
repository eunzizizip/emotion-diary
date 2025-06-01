import { useState } from "react"; 
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", credentials);
      alert(res.data.message);

      // 여기 key명을 DiaryPage와 맞게 user_id로 저장
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("user_id", res.data.userId);
      localStorage.setItem("token", res.data.token); 

      // 로그인 성공 후 메인으로 이동 (원하는 경로로 변경 가능)
      navigate("/");
    } catch (error) {
      alert("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div>
      <h2>이메일과 비밀번호를 <br />입력해주세요</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="test@gmail.com" onChange={handleChange} required />
        <input type="password" name="password" placeholder="영문, 숫자, 특수문자 포함 8자 이상" onChange={handleChange} required />
        <button type="submit">확인</button>
      </form>
      <p>처음이신가요? <Link to="/signup">회원가입</Link></p>
    </div>
  );
};

export default Login;
