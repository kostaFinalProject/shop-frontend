import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageIntro.css";

const MyPageIntro = () => {


  return (
    <div className="MyPageIntrocontainer">
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
          <article>
            <div className="profile">
              <div className="profile_img">
                <img src="https://fakeimg.pl/150x150/" alt="" />
              </div>

              <div class="profile_text">

                <div className="profile_head">
                  <span className="profile_nickname" id="nickname">j___c_y</span>
                </div>

                <div className="profile_information">
                  <p id="id">jco0807</p>
                  <p id="comment">@j___c_y</p>
                </div>
              </div>

              <div className="profile-button">
                <a href="">
                  <div>
                    프로필 관리
                  </div>
                </a>
                <a>
                  <div>
                    내 스타일
                  </div>
                </a>
              </div>
            </div>
          </article>
          <article className="myinfobox">

            <div>
              <p>
                <b className="mambername">나 </b>
                님은
                <span className="membergrade">[normal] </span>
                등급입니다.
              </p>
              <ul className="displaynone">
                <li className="displaynone">등급혜택 여기에</li>
              </ul>
              <ul className="displaynone">
                <li className="displaynone">상위 등급으로 가는 법은 여기에</li>
              </ul>
            </div>
            <div>
              <ul className="bankbook">
                <li>
                  <a href="">
                    <span className="tit">총주문</span>
                    <span>
                      <span className="orderprice">0원</span>(
                      <span className="ordercount">0</span>
                      회)
                    </span>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="tit">쿠폰</span>
                    <span>
                      <span>0</span>
                      <em>개</em>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="tit">적립금</span>
                    <span className="mileage">3,000원</span>
                  </a>
                </li>
              </ul>
            </div>
          </article>
          <article>
            <div className="title">
              나의 주문처리 현황
              <span className="desc">
                최근
                <em>3개월 </em>
                기준
              </span>
            </div>
            <div className="state">
              <ul className="order">
                <li>
                  <strong>입금전</strong>
                  <a href="" className="count">
                    <span className="beforecount">0</span>
                  </a>
                </li>
                <li>
                  <strong>배송준비중</strong>
                  <a href="" className="count">
                    <span className="shippedstandby">0</span>
                  </a>
                </li>
                <li>
                  <strong>배송중</strong>
                  <a href="" className="count">
                    <span className="shippedbegin">0</span>
                  </a>
                </li>
                <li>
                  <strong>배송완료</strong>
                  <a href="" className="count">
                    <span className="shipcomplate">0</span>
                  </a>
                </li>
              </ul>
              <ul className="cs">
                <li>
                  <strong>취소주문건</strong>
                  <a href="" className="count">
                    <span id="ordercancel">0</span>
                    <em>건</em>
                  </a>
                </li>
                <li>
                  <strong>교환주문건</strong>
                  <a href="" className="count">
                    <span id="orderexchange">0</span>
                    <em>건</em>
                  </a>
                </li>
                <li>
                  <strong>반품주문건</strong>
                  <a href="" className="count">
                    <span id="orderreturn">0</span>
                    <em>건</em>
                  </a>
                </li>
              </ul>
            </div>
          </article>
          <article>
            <div className="title">
              최근 주문 내역
              <span className="desc">최근 5개 출력</span>
              <span className="desc" />
              <a href="">+ more</a>
            </div>
            <div className="listwrap">
              <div className="ec-base-table typelist">
                <table border={0} summary="">
                  <colgroup>
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "15%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">주문번호</th>
                      <th scope="col">이미지</th>
                      <th scope="col">상품정보</th>
                      <th scope="col">주문처리상태</th>
                      <th scope="col">주문일자</th>
                    </tr>
                  </thead>
                  <tbody className="data" />
                </table>
                <p className="loading" style={{ display: "none" }}>
                  <i className="xi-spinner-3 xi spin" />
                </p>
                <p className="empty">주문 내역이 없습니다.</p>
              </div>
            </div>
          </article>
          {/* <article>
            <div className="title">
              내가 쓴 게시글
              <span className="desc">최근 게시글 5개 출력 </span>
              <span className="desc" />
              <a href="">+ more</a>
            </div>
            <div className="listwrap">
              <div className="ec-base-table typelist">
                <table border={0} summary="">
                  <colgroup>
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "15%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">번호</th>
                      <th scope="col">분류</th>
                      <th scope="col">제목</th>
                      <th scope="col">작성일</th>
                    </tr>
                  </thead>
                  <tbody className="data" />
                </table>
                <p className="loading" style={{ display: "none" }}>
                  <i className="xi-spinner-3 xi spin" />
                </p>
                <p className="empty">게시물이 없습니다.</p>
              </div>
            </div>
          </article> */}
        </section>
      </div>
    </div>
  );
};

export default MyPageIntro;
