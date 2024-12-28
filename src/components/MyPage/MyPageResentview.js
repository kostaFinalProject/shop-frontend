
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageResentview.css";
import MyPageNavigation from "./MyPageNavigation";

const MyPageResentview = () => {


  return (
    <div className="MyPageResentviewcontainer">
      <div id="content" className="-frame">
        <MyPageNavigation />
        <section className="contentwrap">
          <div className="contentwraptitle"> 최근 본 상품</div>
          <div className="typeNav">
            <ul className="menu">
              {/* <li class="selected">
        <a href="">
          주문내역조회
        </a>
      </li> */}
            </ul>
          </div>
          <div className="basketfield">
            <div className="basket1">
              <div className="basketitem">
                <div className="prdBox">
                  &nbsp;
                  <div className="thumbnail">
                    <a href="">
                      <img src="" alt="" width={140} height={140} />
                    </a>
                  </div>
                  <div className="description">
                    <strong className="manufacturer" title="제조사">
                      [제조사]
                    </strong>
                    <strong className="itemname" title="상품명">
                      레알마드리드
                    </strong>
                    <ul className="price">
                      <li>
                        <strong>150000</strong>원
                      </li>
                    </ul>
                    <ul className="info">
                      <li>
                        배송 :<span className="delivery">3000원</span>
                      </li>
                      <li>
                        적립금 :<span className="mileage">300원</span>
                      </li>
                    </ul>
                    <ul className="optional">
                      <li>옵션1</li>
                    </ul>
                  </div>
                  <div className="sumprice">
                    <strong>0</strong>원
                  </div>
                  <div className="buttonGroup">
                    <a href="#none" className="Basketbtn sizeS">
                      장바구니
                    </a>
                    <a href="#none" className="orderBtn sizeS">
                      주문하기
                    </a>
                  </div>
                </div>
                <div className="prdBox">
                  &nbsp;
                  <div className="thumbnail">
                    <a href="">
                      <img src="" alt="" width={140} height={140} />
                    </a>
                  </div>
                  <div className="description">
                    <strong className="manufacturer" title="제조사">
                      [제조사]
                    </strong>
                    <strong className="itemname" title="상품명">
                      레알마드리드
                    </strong>
                    <ul className="price">
                      <li>
                        <strong>150000</strong>원
                      </li>
                    </ul>
                    <ul className="info">
                      <li>
                        배송 :<span className="delivery">3000원</span>
                      </li>
                      <li>
                        적립금 :<span className="mileage">300원</span>
                      </li>
                    </ul>
                    <ul className="optional">
                      <li>옵션1</li>
                    </ul>
                  </div>
                  <div className="sumprice">
                    <strong>0</strong>원
                  </div>
                  <div className="buttonGroup">
                    <a href="#none" className="Basketbtn sizeS">
                      장바구니
                    </a>
                    <a href="#none" className="orderBtn sizeS">
                      주문하기
                    </a>
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

export default MyPageResentview;