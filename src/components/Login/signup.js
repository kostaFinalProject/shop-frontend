
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./signup.css";

const signup = () => {


  return (
    <div className="form-wrap">
      <div className="firstmenu">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid black"
          }}
        >
          <h2 id="join">회원 가입</h2>
        </div>
        <div id="menu1">
          <h3>간편하게 로그인하기</h3>
        </div>
        <div id="form1">
          <form>
            <h5 style={{ color: "#757575" }}>
              간편한 회원가입으로 쉽게 본 사이트를 이용할 수 있습니다.
              <br />
              카카오톡으로 쉽게 시작하기
            </h5>
          </form>
          <a href="*">
            <img src="/img/kakao_login_medium_wide.png" width="340px" />
          </a>
        </div>
      </div>
      <div className="secondmenu">
        <div
          style={{
            display: "block",
            justifyContent: "center",
            borderBottom: "1px solid black",
            marginBottom: 10
          }}
        >
          <h3 style={{ textAlign: "center" }}>기본정보</h3>
          <p style={{ textAlign: "right" }}>
            <span style={{ color: "#ed4848" }}>*</span> 필수입력사항
          </p>
        </div>
        {/* 아이디 섹션 */}
        <div className="form-section">
          <div className="form-row">
            <label htmlFor="userid">
              아이디 <span style={{ color: "#ed4848" }}>*</span>
            </label>
            <input
              type="text"
              maxLength={16}
              id="userid"
              name="userid"
              style={{ width: 250 }}
              placeholder="(영문소문자/숫자, 4~16자)"
              required=""
            />
            <div id="useridMessage" /> {/* 이름 경고 문구 출력할 div 추가 */}
          </div>
          <div className="form-row">
            <label htmlFor="pw">
              비밀번호 <span style={{ color: "#ed4848" }}>*</span>
            </label>
            <input
              type="password"
              maxLength={16}
              id="pw"
              name="pw"
              placeholder="(영문 대소문자/숫자/특수문자 중 3가지 이상 조합, 8자~16자)"
              onpaste="return false;"
              oncopy="return false;"
            />
            <div id="pwMessage" /> {/* 비밀번호 경고 문구 출력할 div 추가 */}
          </div>
          <div className="form-row">
            <label htmlFor="re_pw">
              비밀번호 확인 <span style={{ color: "#ed4848" }}>*</span>
            </label>
            <input
              type="password"
              maxLength={16}
              id="re_pw"
              name="re_pw"
              onpaste="return false;"
              oncopy="return false;"
            />
            <div id="re_pwMessage" />{" "}
            {/* 비밀번호 확인 경고 문구 출력할 div 추가 */}
          </div>
          <div className="form-row">
            <label htmlFor="name">
              이름 <span style={{ color: "#ed4848" }}>*</span>
            </label>
            <input
              type="text"
              maxLength={31}
              id="name"
              name="name"
              style={{ width: 250 }}
            />
            <div id="nameMessage" /> {/* 이름 확인 경고 문구 출력할 div 추가 */}
          </div>
          <div className="form-row">
            <label htmlFor="nickname">
              닉네임 <span style={{ color: "#ed4848" }}>*</span>
            </label>
            <input
              type="text"
              maxLength={25}
              id="nickname"
              name="nickname"
              style={{ width: 250 }}
            />
            <div id="nicknameMessage" /> {/* 닉네임 경고 문구 출력할 div 추가 */}
          </div>
          <div className="form-row">
            <label htmlFor="address">주소</label>
            <div className="address">
              <input
                type="text"
                id="postcode"
                name="postcode"
                style={{ width: 165 }}
                placeholder="우편번호"
                readOnly=""
                required=""
              />
              <button type="button" onclick="execDaumPostcode()">
                주소 찾기
              </button>
              <br />
              <input
                type="text"
                id="roadAddress"
                name="roadAddress"
                style={{ width: 250 }}
                placeholder="기본주소"
                readOnly=""
                required=""
              />
              <br />
              <input
                type="text"
                maxLength={77}
                id="detailAddress"
                name="detailAddress"
                style={{ width: 250 }}
                placeholder="나머지 주소(선택 입력 가능)"
              />
              <div id="addressMessage" /> {/* 경고 메시지 출력용 */}
            </div>
          </div>
        </div>
        {/* 추가 입력 섹션 */}
        <div className="form-section">
          <div className="form-row">
            <label htmlFor="phone">휴대전화</label>
            <select name="phoneNo">
              <option value="010">010</option>
              <option value="017">017</option>
              <option value="011">011</option>
            </select>
            -
            <input
              type="text"
              id="phoneNo1"
              name="phoneNo1"
              size={3}
              maxLength={4}
              pattern="\d*"
              style={{ width: 39 }}
            />
            -
            <input
              type="text"
              id="phoneNo2"
              name="phoneNo2"
              size={4}
              maxLength={4}
              pattern="\d*"
              style={{ width: 39 }}
            />
            <div id="phoneMessage1" />{" "}
            {/* 메시지 출력 id="phoneNo1" id="phoneNo2"이 없어 input창 크기 조절 오래걸림*/}
            <br />
            <div id="phoneMessage2" />
          </div>
          <div className="form-row">
            <label htmlFor="email">
              이메일 <span style={{ color: "#ed4848" }}>*</span>
            </label>
            <input
              type="text"
              maxLength={20}
              id="email1"
              name="email1"
              style={{ width: 300 }}
            />{" "}
            @
            <input
              type="text"
              maxLength={20}
              id="email2"
              name="email2"
              placeholder="직접 입력"
            />
            <select id="emailist" name="emailist">
              <option value="" disabled="" selected="">
                도메인 선택
              </option>
              <option value="naver.com">네이버</option>
              <option value="daum.net">다음</option>
              <option value="nate.com">네이트</option>
              <option value="gmail.com">구글</option>
              <option value="">직접입력</option>
            </select>
          </div>
          <div id="emailMessage1" /> {/* 이메일 경고 문구 출력할 div 추가 */}
          <div id="emailMessage2" />
        </div>
        <submit className="join-button">회원가입</submit>
      </div>
    </div>

  );
};

export default signup;