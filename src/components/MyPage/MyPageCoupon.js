
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageCoupon.css";

const MyPageCoupon = () => {


  return (
    <div className="MyPageCouponcontainer">
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
          <div className="contentwraptitle"> 내 쿠폰 정보</div>
          <div className="typeNav">
            <ul className="menu">
              {/* <li class="selected">
        <a href="">
          주문내역조회
        </a>
      </li> */}
            </ul>
          </div>
          <div className="couponfield">
            <div className="coupon">
              <form action="">
                <div className="couponRegister">
                  <div className="couponRegisterBox">
                    <fieldset>
                      <legend>쿠폰 번호 등록</legend>
                      <input
                        type="text"
                        id="couponCode"
                        name="couponCode"
                        className="couponCode"
                        placeholder=""
                        maxLength={35}
                      />
                      <a href="" className="couponsubmit">
                        {" "}
                        쿠폰번호인증
                      </a>
                      <p className="textInfo">
                        반드시 쇼핑몰에서 발행한 쿠폰번호만 입력해주세요!!
                      </p>
                    </fieldset>
                  </div>
                </div>
              </form>
              <div className="couponlist">
                <div className="basketitem">
                  <div className="couponbox">
                    <div className="prdBox">
                      <div className="description">
                        <div className="coupondetail">
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
                          <ul className="optional">
                            <li>
                              <strong>2022.02.02</strong>
                              까지
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="prdBox">
                      <div className="description">
                        <div className="coupondetail">
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
                          <ul className="optional">
                            <li>
                              <strong>2022.02.02</strong>
                              까지
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="prdBox">
                      <div className="description">
                        <div className="coupondetail">
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
                          <ul className="optional">
                            <li>
                              <strong>2022.02.02</strong>
                              까지
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="prdBox">
                      <div className="description">
                        <div className="coupondetail">
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
                          <ul className="optional">
                            <li>
                              <strong>2022.02.02</strong>
                              까지
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="none">쿠폰이 없습니다.</p>
              </div>
            </div>
            <div>대충 여기 &lt;&gt;넣자</div>
            <div className="help">
              <h3>쿠폰 이용 안내</h3>
              <div className="inner">
                <ul>
                  <li>
                    쿠폰인증번호 등록하기에서 쇼핑몰에서 발행한
                    종이쿠폰/시리얼쿠폰/모바일쿠폰 등의 인증번호를 등록하시면
                    온라인쿠폰으로 발급되어 사용이 가능합니다
                  </li>
                  <li>
                    쿠폰은 주문 시 1회에 한해 적용되며, 1회 사용 시 재 사용이
                    불가능합니다.
                  </li>
                  <li>
                    쿠폰은 적용 가능한 상품이 따로 적용되어 있는 경우 해당 상품 구매
                    시에만 사용이 가능합니다.
                  </li>
                  <li>
                    특정한 종이쿠폰/시리얼쿠폰/모바일쿠폰의 경우 단 1회만 사용이
                    가능할 수 있습니다.
                  </li>
                  <li>
                    기본 배송비 할인쿠폰은 배송구분이 '기본배송'인 상품에 부과된
                    배송비만 할인이 적용됩니다.
                  </li>
                  <li>
                    전체 배송비 할인쿠폰은 배송구분이 '기본배송', '개별배송',
                    '공급사배송'인 상품에 부과된 배송비 할인이 적용됩니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

  );
};

export default MyPageCoupon;