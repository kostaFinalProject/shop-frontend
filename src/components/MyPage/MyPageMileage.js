
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageMileage.css";
import MyPageNavigation from "./MyPageNavigation";

const MyPageMileage = () => {


  return (
    <div className="MyPageMileagecontainer">
      <div id="content" className="-frame">
        <MyPageNavigation />
        <section className="contentwrap">
          <div className="contentwraptitle"> 마일리지</div>
          <div className="typeNav">
            <ul className="menu">
              {/* <li class="selected">
        <a href="">
          주문내역조회
        </a>
      </li> */}
            </ul>
          </div>
          <div className="couponRegister">
            <div className="couponRegisterBox">
              <ul className="order">
                <li>
                  <strong>총 적립금</strong>
                  <span className="beforecount">0</span>원
                </li>
                <li>
                  <strong>사용 적립금</strong>
                  <span className="shippedstandby">0</span>원
                </li>
                <li>
                  <strong>미사용 적립금</strong>
                  <span className="shippedbegin">0</span>원
                </li>
                <li>
                  <strong>미가용 적립금</strong>
                  <span className="shippedbegin">0</span>원
                </li>
                <li>
                  <strong>환불예정 적립금</strong>
                  <span className="shippedbegin">0</span>원
                </li>
              </ul>
            </div>
          </div>
          <div className="basketfield">
            <div className="basket1">
              <div className="basketitem">
                <div className="prdBox">
                  <h3 className="v2">
                    <span>2024-11-25</span>
                  </h3>
                  <div>
                    <table>
                      <colgroup>
                        <col style={{ width: 120 }} />
                        <col style={{ width: "auto" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th>적립금</th>
                          <td>3,000원</td>
                        </tr>
                        <tr>
                          <th>내용</th>
                          <td>신규회원 적립금</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="prdBox">
                  <h3 className="v2">
                    <span>2024-11-25</span>
                  </h3>
                  <div>
                    <table>
                      <colgroup>
                        <col style={{ width: 120 }} />
                        <col style={{ width: "auto" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th>적립금</th>
                          <td>3,000원</td>
                        </tr>
                        <tr>
                          <th>내용</th>
                          <td>신규회원 적립금</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="prdBox">
                  <h3 className="v2">
                    <span>2024-11-25</span>
                  </h3>
                  <div>
                    <table>
                      <colgroup>
                        <col style={{ width: 120 }} />
                        <col style={{ width: "auto" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th>적립금</th>
                          <td>3,000원</td>
                        </tr>
                        <tr>
                          <th>내용</th>
                          <td>신규회원 적립금</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="prdBox">
                  <h3 className="v2">
                    <span>2024-11-25</span>
                  </h3>
                  <div>
                    <table>
                      <colgroup>
                        <col style={{ width: 120 }} />
                        <col style={{ width: "auto" }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th>적립금</th>
                          <td>3,000원</td>
                        </tr>
                        <tr>
                          <th>내용</th>
                          <td>신규회원 적립금</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <p className="none">최근 본 내역이 없습니다.</p>
            </div>
          </div>
        </section>
      </div>
    </div>

  );
};

export default MyPageMileage;