import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./login.css";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();  // useNavigate 훅 사용

  const handleLogin = (event) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    // 임시 사용자 데이터
    const dummyUser = {
      email: "test@example.com",
      password: "1",
    };

    // 사용자 검증
    if (email === dummyUser.email && password === dummyUser.password) {
      alert("로그인 성공!");
      setIsLoggedIn(true); // 상태 변경
      console.log("로그인 후 setIsLoggedIn 호출됨");
      navigate("/"); // 로그인 성공 후 바로 홈 페이지로 이동
    } else {
      alert("이메일 또는 비밀번호가 잘못되었습니다.");
    }
  };

  

  return (
    <div className="Loginframe">
      <div className="login">
        <div className="login1">
          <form onSubmit={handleLogin}>
            <article className="memberlogin">
              <h3>로그인</h3>
              <fieldset className="-flex column">
                <label className="idePlaceholder" title="아이디">
                  <input
                    id="memberid"
                    name="memberid"
                    placeholder="아이디"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    required
                  />
                </label>
                <label className="pwePlaceholder" title="비밀번호">
                  <input
                    id="memberpw"
                    name="memberpw"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                </label>
              </fieldset>
              <button type="submit" className="btnSubmit gFull sizeL">
                로그인
              </button>
              <div className="function">
                <a href="#">아이디 찾기</a>
                <a href="#">비밀번호 찾기</a>
              </div>
              <a href="#" className="btnNormal gFull sizeL">
                회원가입
              </a>
            </article>
          </form>
        </div>
        <div className="login2">
          <form>
            <article>
              <div className="socialLogin">
                <h3>간편하게 로그인하기</h3>
                <h4>다양한 방법으로 쉽게 사이트를 이용하세요</h4>
                <a href="#">
                  <img
                    src="/img/kakaotalk_sharing_btn_small.png"
                    alt="카카오톡 로그인"
                    width="40px"
                    height="40px"
                  />
                </a>
                <a href="#">
                  <img
                    src="/img/google_icon.svg"
                    alt="구글 로그인"
                    width="40px"
                    height="40px"
                  />
                </a>
                <a href="#">
                  <img
                    src="/img/NAVER_Icon.png"
                    alt="네이버 로그인"
                    width="40px"
                    height="40px"
                  />
                </a>
              </div>
            </article>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
