import React, { useState } from "react";
import "./StyleModify.css";

const StyleModify = () => {
  const [image, setImage] = useState('https://fakeimg.pl/150/');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result); // 업로드된 이미지를 미리보기 이미지로 설정
      };
      reader.readAsDataURL(file); // 파일을 읽고 Base64로 변환
    }
  };

  // 이미지 삭제 이벤트
  const handleDeleteImage = () => {
    setImage('https://fakeimg.pl/150/'); // 기본 이미지로 되돌리기
  };

  return (
    <div className="stylemodifycontainer">
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
              <a href="/MyPage/membermodify">
                <li>회원 정보 수정</li>
              </a>
              <a href="">
                <li>로그아웃</li>
              </a>
            </ul>
          </article>
        </section>
        <section className="contentwrap">
          <div className="contentwraptitle"> 프로필 관리</div>
          <div className="typeNav">
            <ul className="menu" />
          </div>
          <form action="" method="post" target="_self">
            <div className="profile">
              <div className="wrapper">
                <img
                  src={image}  // 변경된 이미지 URL을 상태값으로 설정
                  className="image-box"
                  id="profile-image"
                />
                <div className="imagebutton">
                  <label htmlFor="file" className="upload-btn" >
                    <input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    이미지 변경
                  </label>
                  <button
                    type="button"
                    className="delete-btn"
                    id="delete-image"
                    onClick={handleDeleteImage}
                  >
                    이미지 삭제
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="profilecontent">
                프로필 이름
                <input
                  type="text"
                  className="profilename"
                  id="profilename"
                  placeholder="프로필 이름"
                />
              </div>
              <div className="profilecontent">
                이름
                <input
                  type="text"
                  className="namebox"
                  id="namebox"
                  placeholder="이름"
                />
              </div>
              <div className="profilecontent">
                소개
                <input
                  type="text"
                  className="introducebox"
                  id="introducebox"
                  placeholder="소개"
                />
              </div>
            </div>
            <div>
              <button type="submit" className="submit">저장</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default StyleModify;