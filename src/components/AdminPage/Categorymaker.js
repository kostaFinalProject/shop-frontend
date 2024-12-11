
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./Categorymaker.css";

const Categorymaker = () => {


  return (
    <section className="categorymakersection">
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
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/adminright")}
          >
            <div className="item">관리자 권한 관리</div>
          </div>
          <div
            className="detail-select"
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
          카테고리 등록
        </div>
        <hr />
        <div className="content">
          <div className="makecategory">
            <span>카테고리 만들기 (만들 카테고리 체크하세요)</span>
            <div className="upcategory">
              <input type="checkbox" />
              <span>상위 카테고리</span>
              <input type="text" style={{ width: 300, height: 20 }} />
            </div>
            <div className="downcategory">
              <input type="checkbox" />
              <span>하위 카테고리</span>
              <div>
                <select name="orderstatus" id="orderstatus" className="fSelect">
                  <option value="all">선택</option>
                  <option value="shippedbefore">해축</option>
                  <option value="shippedstandby">국축</option>
                  <option value="shippedbegin">야구</option>
                  <option value="shipcomplate">배구</option>
                  <option value="ordercancel">ee</option>
                </select>
              </div>
              <input type="text" style={{ width: 300, height: 20 }} />
              <div>파일선택</div>
            </div>
            <button style={{ width: 100 }}>제출</button>
          </div>
          <div className="categorylist">
            <span>카테고리 리스트</span>
            <button>삭제</button>
            <div className="categoryli">
              <div>
                <input type="checkbox" />
                해외축구
              </div>
              <div>
                <input type="checkbox" />
                해외축구-맨유
              </div>
              <div>
                <input type="checkbox" />
                해외축구-맨시티
              </div>
              <div>
                <input type="checkbox" />
                해외축구-레알
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Categorymaker;