import React, { useState } from 'react';
import "./Admindelivery.css";

const Admindelivery = () => {



  return (
    <section className="admindeliverysection">

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
            className="detail-select"
            onClick={() => (window.location.href = "/AdminPage/admindelivery")}
          >
            <div className="item">배송 관리</div>
          </div>
        </div>
      </div>

      <div className="info">
        <div className="content-name" style={{ marginBottom: 7, fontSize: 20 }}>
          상품수정
        </div>
        <hr />
        <div className="typelist">
          <table border={0} summary="">
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">아이디</th>
                <th scope="col">상품명</th>
                <th scope="col">배송상태</th>
                <th scope="col">수정버튼</th>
              </tr>
            </thead>
            <tbody className="data">
              <tr>
                <td scope="col">test1234</td>
                <td scope="col">ADIDAS 아르헨티나 1994 RETRO AWAY #10 (XS~2XL)</td>
                <td scope="col">
                  <select id="AdminOrderOption" name="AdminOrderOption" required>
                    <option className="AdminOrderOption" value="shippedbefore">입금전</option>
                    <option className="AdminOrderOption" value="shippedstandby">배송준비중</option>
                    <option className="AdminOrderOption" value="shippedbegin">배송중</option>
                    <option className="AdminOrderOption" value="shipcomplate">배송완료</option>
                    <option className="AdminOrderOption" value="ordercancel">취소</option>
                    <option className="AdminOrderOption" value="orderexchange">교환</option>
                    <option className="AdminOrderOption" value="orderreturn">반품</option>
                  </select>
                </td>
                <td scope="col">
                  <button>적용</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="loading" style={{ display: "none" }}>
            <i className="xi-spinner-3 xi spin" />
          </p>
          <p className="empty">주문 내역이 없습니다.</p>
        </div>
      </div>
    </section >
  );
};

export default Admindelivery;
