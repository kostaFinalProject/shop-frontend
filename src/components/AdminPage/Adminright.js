
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./Adminright.css";

const Adminright = () => {


  return (
    <section className="adminrightsection">
      <div className="list">
        <div className="introduce">
          <div className="name">
            <strong style={{ marginRight: 5, marginLeft: 10 }}>최고 관리자</strong>
            님
          </div>
        </div>
        <div className="detail">
          <div className="detail-list" />
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/reportuser")}
          >
            <div className="item">신고 유저 관리</div>
          </div>
          <div
            className="detail-select"
            onClick={() => (window.location.href = "/AdminPage/adminright")}
          >
            <div className="item">관리자 권한 관리</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/categorymaker")}
          >
            <div className="item">카테고리 등록</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/registproduct")}
          >
            <div className="item">상품 등록</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/modifyproduct")}
          >
            <div className="item">상품 수정</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/admindelivery")}
          >
            <div className="item">배송 관리</div>
          </div>
        </div>
      </div>
      <div className="info">
        <div className="content-name" style={{ marginBottom: 7, fontSize: 20 }}>
          관리자 권한 관리
        </div>
        <hr />
        <div className="content">
          <div className="contentlist">
            <a href="" className="aaaa contentlistselected">
              <div>관리자승인</div>
            </a>
            <a href="" className="aaaa">
              <div>관리자관리</div>
            </a>
          </div>
          <div className="profile">
            <div className="profile_img">
              <img src="https://fakeimg.pl/150x150/" alt="" />
            </div>
            <div className="profile_text">
              <div className="profile_head">
                <span className="profile_nickname" id="nickname">
                  j___c_y
                </span>
              </div>
              <div className="profile_information">
                <p id="id">jco0807</p>
                <p id="comment">@j___c_y</p>
              </div>
            </div>
            <div className="profile-button">
              <a href="">
                <div>승인</div>
              </a>
              <a>
                <div>거절</div>
              </a>
            </div>
          </div>
          <div className="profile">
            <div className="profile_img">
              <img src="https://fakeimg.pl/150x150/" alt="" />
            </div>
            <div className="profile_text">
              <div className="profile_head">
                <span className="profile_nickname" id="nickname">
                  j___c_y
                </span>
              </div>
              <div className="profile_information">
                <p id="id">jco0807</p>
                <p id="comment">@j___c_y</p>
              </div>
            </div>
            <div className="profile-button">
              <select name="adminstatus" id="\" className="/">
                <option value="all">권한유지</option>
                <option value="shippedbefore">꺼져</option>
              </select>
              <a>
                <div>적용</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Adminright;