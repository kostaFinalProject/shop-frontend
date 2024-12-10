
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./membermodify.css";

const Membermodify = () => {


  return (
    <div className="membermodifyformwrap">
      <div id="content" className="-frame">
        <section className="manuwrap">
          <h3>마이페이지</h3>
          <article className="myshopmain">
            <h4>나의 쇼핑활동</h4>
            <ul>
              <a href="/MyPage/order">
                <li>주문/배송조회</li>
              </a>
              <a href="/MyPage/basket">
                <li>장바구니</li>
              </a>
              <a href="/MyPage/interest">
                <li>관심상품</li>
              </a>
              <a href="/MyPage/resentview">
                <li>최근 본 상품</li>
              </a>
            </ul>
          </article>
          <article className="myshopmain">
            <h4>쇼핑혜택 안내</h4>
            <ul>
              <a href="/MyPage/coupon">
                <li>내 쿠폰정보</li>
              </a>
              <a href="/MyPage/mileage">
                <li>적립금 내역</li>
              </a>
            </ul>
          </article>
          <article className="myshopmain">
            <h4>스타일</h4>
            <ul>
              <a href="/MyPage/stylemodify">
                <li>프로필 관리</li>
              </a>
              <a href="">
                <li>내 스타일</li>
              </a>
            </ul>
          </article>
          <article className="myshopmain">
            <h4>나의 정보 관리</h4>
            <ul>
              <a href="/MyPage/address">
                <li>배송지 관리</li>
              </a>
              <a href="">
                <li>회원 정보 수정</li>
              </a>
              <a href="">
                <li>로그아웃</li>
              </a>
            </ul>
          </article>
        </section>
        <section className="contentwrap">
          <div className="contentwraptitle"> 회원 수정</div>
          <div className="membermodifycontainer">
            {/* 아이디 섹션 */}
            <div className="form-section">
              <div className="form-row">
                <label htmlFor="pre_pw">
                  현재 비밀번호 <span style={{ color: "#ed4848" }}>*</span>
                </label>
                <input
                  type="password"
                  maxLength={16}
                  id="pre_pw"
                  name="pre_pw"
                  onpaste="return false;"
                  oncopy="return false;"
                />
                <button>확인</button>
                <div id="pre_pwMessage" /> {/* 비밀번호 경고 문구 출력할 div 추가 */}
              </div>
              <div className="form-row">
                <label htmlFor="pw">
                  새비밀번호 <span style={{ color: "#ed4848" }}>*</span>
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
                  새비밀번호 확인 <span style={{ color: "#ed4848" }}>*</span>
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
                  readOnly=""
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
                  readOnly=""
                />{" "}
                @
                <input
                  type="text"
                  maxLength={20}
                  id="email2"
                  name="email2"
                  placeholder="직접 입력"
                  readOnly=""
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
            <div className="button-container">
              <button
                type="submit"
                className="cancel-button"
                style={{ backgroundColor: "white", color: "black" }}
              >
                취소
              </button>
              <button type="submit" className="join-button">
                회원정보수정
              </button>
            </div>
          </div>

        </section>
      </div>
    </div>

  );
};

export default Membermodify;