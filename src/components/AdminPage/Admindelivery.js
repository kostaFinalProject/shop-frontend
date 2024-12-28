import React, { useState } from 'react';
import "./Admindelivery.css";
import AdminNavi from './AdminComponent/AdminNavi';

const Admindelivery = () => {



  return (
    <section className="admindeliverysection">

      <AdminNavi />

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
