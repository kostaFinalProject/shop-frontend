import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageOrder.css";


const MyPageOrder = () => {

  return (
    <div className="MyPageOrdercontainer">
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
              <a href="/StyleprofileMyInterestProduct">
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
          <div className="contentwraptitle"> 주문조회</div>
          <div className="typeNav">
            {/* <ul class="menu">
      <li class="selected">
        <a href="">
          주문내역조회
        </a>
      </li> */}
          </div>
          <form method="get" id="OrderHistoryForm" name="OrderHistoryForm">
            <div className="history">
              <fieldset>
                <legend>검색기간설정</legend>
                <div className="stateSelect">
                  <select name="orderstatus" id="orderstatus" className="fSelect">
                    <option className="OrderOption" value="all">전체 주문상태</option>
                    <option className="OrderOption" value="shippedbefore">입금전</option>
                    <option className="OrderOption" value="shippedstandby">배송준비중</option>
                    <option className="OrderOption" value="shippedbegin">배송중</option>
                    <option className="OrderOption" value="shipcomplate">배송완료</option>
                    <option className="OrderOption" value="ordercancel">취소</option>
                    <option className="OrderOption" value="orderexchange">교환</option>
                    <option className="OrderOption" value="orderreturn">반품</option>
                  </select>
                </div>
                <span className="period">
                  <a href="" className="btnNormalSizeMselected" days={0}>
                    오늘
                  </a>
                  <a href="" className="btnNormalSizeM" days={30}>
                    1개월
                  </a>
                  <a href="" className="btnNormalSizeM" days={90}>
                    3개월
                  </a>
                  <a href="" className="btnNormalSizeM" days={180}>
                    6개월
                  </a>
                </span>
                <div className="date">
                  <span className="datepicker">
                    <input
                      type="text"
                      id="hisrotyStartDate"
                      name="hisrotyStartDate"
                      className="TextDatepicker"
                      readOnly="readonly"
                      size={10}
                      defaultValue="2024-08-28"
                    />
                    <button type="button" className="datepickertrigger">
                      <img src="/img/ico_calendar.png" alt="date" width="20px " />
                    </button>
                    ~
                    <input
                      type="text"
                      id="hisrotyEndDate"
                      name="hisrotyEndDate"
                      className="TextDatepicker"
                      readOnly="readonly"
                      size={10}
                      defaultValue="2024-11-26"
                    />
                    <button type="button" className="datepickertrigger">
                      <img src="/img/ico_calendar.png" alt="date" width="20px " />
                    </button>
                  </span>
                  <span className="btnSubmitSizeMeDataSet">
                    조회
                    <input type="image" id="order_search_btn" alt="조회" />
                  </span>
                </div>
              </fieldset>
            </div>
            <ul className="help">
              <li>
                기본적으로 최근 3개월간의 자료가 조회되며, 기간 검색시 주문처리완료
                후 36개월 이내의 주문내역을 조회하실 수 있습니다.
              </li>
              <li>취소/교환/반품 신청은 배송완료일 기준 7일까지 가능합니다.</li>
            </ul>
          </form>
          <div className="inquire">
            <div className="inquireCard">
              <div className="status">
                <span>배송중 </span>
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
            <div className="inquireCard">
              <div className="status">
                <span>배송완료 </span>
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
            <div className="inquireCard">
              <div className="status">
                <span>배송준비중 </span>
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
          </div>
          <p className="none">주문 내역이 없습니다.</p>
        </section>
      </div>
    </div>

  );
}

export default MyPageOrder;