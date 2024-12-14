import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import "./login.css";

const Login = ({ setIsLoggedIn }) => {
  const [userId, setUserId] = useState(""); // 아이디 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    // 카카오 SDK 초기화 (카카오 개발자 사이트에서 제공받은 JavaScript 키 사용)
    if (window.Kakao) {
      window.Kakao.init("43e5ae5eb19ddba3591f27d05f280f6a"); 
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    // 입력 값 유효성 검사
    if (!userId || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/members/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // 오류 메시지
        alert("로그인 실패: " + errorMessage);
        return;
      }

      const data = await response.json(); // 응답 데이터 파싱
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setIsLoggedIn(true);
        navigate("/");
      } else {
        alert("로그인 실패: 응답 데이터에 문제가 있습니다.");
      }
    } catch (error) {
      alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleKakaoLogin = () => {
    if (window.Kakao) {
      // 카카오 로그인 요청
      window.Kakao.Auth.login({
        success: async function (authObj) {
          const accessToken = authObj.access_token;
  
          // 카카오 로그인 성공 후, 서버로 토큰 전송하여 DB에 사용자 정보 저장
          try {
            const response = await fetch("http://localhost:8080/api/v1/members/oauth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                accessToken, 
              }),
            });
  
            if (response.ok) {
              const data = await response.json();
              // 서버에서 사용자 인증 및 DB 저장이 성공하면 토큰 저장
              localStorage.setItem("accessToken", data.accessToken);
              localStorage.setItem("refreshToken", data.refreshToken);
              
              setIsLoggedIn(true); // 로그인 상태 변경
              navigate("/"); // 홈 페이지로 이동
            } else {
              const errorMessage = await response.text();
              alert("카카오 로그인 실패: " + errorMessage);
            }
          } catch (error) {
            alert("서버와의 통신 오류가 발생했습니다. 다시 시도해주세요.");
          }
        },
        fail: function (err) {
          alert("카카오 로그인 실패: " + err); // 로그인 실패 시 오류 메시지
        },
      });
    } else {
      alert("카카오 SDK가 로드되지 않았습니다.");
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
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)} // 상태 업데이트
                    type="text"
                    required
                  />
                </label>
                <label className="pwePlaceholder" title="비밀번호">
                  <input
                    id="password"
                    name="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // 상태 업데이트
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
              <a href="/signup" className="btnNormal gFull sizeL">
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
                <a href="#" onClick={handleKakaoLogin}>
                  <img
                    src="/img/kakaotalk_sharing_btn_small.png"
                    alt="카카오톡 로그인"
                    width="40px"
                    height="40px"
                  />
                </a>
                {/* 아래는 구글, 네이버 로그인 추가 부분 */}
                {/* <a href="#">
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
                </a> */}
              </div>
            </article>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;