
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageBasket.css";

const MyPageBasket = () => {

  return (
    <div className="MyPageBasketcontainer">
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
          <div className="contentwraptitle"> 장바구니</div>
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
                  <input type="checkbox" className="check" />
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
                  <a href="">
                    <img src="/img/x-lg.svg" />
                  </a>
                  <div className="quentity">
                    <span className="qtyBtnTotal">
                      <button className="up">+</button>
                      <input
                        id="quentity_id_0"
                        name="quentity_name_0"
                        size={2}
                        defaultValue={1}
                        type="text"
                      />
                      <button className="down">-</button>
                    </span>
                    <button type="button">변경</button>
                  </div>
                  <div className="buttonGroup">
                    <a href="#none" className="btnSubmit sizeS">
                      주문하기
                    </a>
                  </div>
                </div>
                <div className="prdBox">
                  <input type="checkbox" className="check" />
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
                  <a href="">
                    <img src="/img/x-lg.svg" />
                  </a>
                  <div className="quentity">
                    <span className="qtyBtnTotal">
                      <button className="up">+</button>
                      <input
                        id="quentity_id_0"
                        name="quentity_name_0"
                        size={2}
                        defaultValue={1}
                        type="text"
                      />
                      <button className="down">-</button>
                    </span>
                    <button type="button">변경</button>
                  </div>
                  <div className="buttonGroup">
                    <a href="#none" className="btnSubmit sizeS">
                      주문하기
                    </a>
                  </div>
                </div>
                <div className="prdBox">
                  <input type="checkbox" className="check" />
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
                  <a href="">
                    <img src="/img/x-lg.svg" />
                  </a>
                  <div className="quentity">
                    <span className="qtyBtnTotal">
                      <button className="up">+</button>
                      <input
                        id="quentity_id_0"
                        name="quentity_name_0"
                        size={2}
                        defaultValue={1}
                        type="text"
                      />
                      <button className="down">-</button>
                    </span>
                    <button type="button">변경</button>
                  </div>
                  <div className="buttonGroup">
                    <a href="#none" className="btnSubmit sizeS">
                      주문하기
                    </a>
                  </div>
                </div>
                <div className="prdBox">
                  <input type="checkbox" className="check" />
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
                  <a href="">
                    <img src="/img/x-lg.svg" />
                  </a>
                  <div className="quentity">
                    <span className="qtyBtnTotal">
                      <button className="up">+</button>
                      <input
                        id="quentity_id_0"
                        name="quentity_name_0"
                        size={2}
                        defaultValue={1}
                        type="text"
                      />
                      <button className="down">-</button>
                    </span>
                    <button type="button">변경</button>
                  </div>
                  <div className="buttonGroup">
                    <a href="#none" className="btnSubmit sizeS">
                      주문하기
                    </a>
                  </div>
                </div>
              </div>
              <p className="none">장바구니 내역이 없습니다.</p>
            </div>
            <div className="basket2">
              <div className="totalSummary">
                <h3 className="totalSummaryTitle">주문상품</h3>
                <div className="Price">
                  <h4>총 상품금액</h4>
                  <span>
                    <strong>0</strong>원
                  </span>
                </div>
                <div className="Price">
                  <h4>총 배송비</h4>
                  <span>
                    <strong>0</strong>원
                  </span>
                </div>
                <div className="totalPrice">
                  <h4>총 배송비</h4>
                  <span>
                    <strong>0</strong>원
                  </span>
                </div>
              </div>
              <button type="button" className="submitBtn">
                전체상품주문
              </button>
              <button type="button" className="selectSubmitBtn">
                선택상품주문
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>

  );
};

export default MyPageBasket;