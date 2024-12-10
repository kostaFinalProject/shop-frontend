
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageResentview.css";

const MyPageResentview = () => {


  return (
    <div className="MyPageResentviewcontainer">
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