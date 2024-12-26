import React, { useState } from "react";
import "./Footer.css";

const Footer = () => {

  return (
    <footer>
      <div className="footerFlame">
        <div className="inner-flex">
          {/* <!-- 왼쪽 섹션 --> */}
          <div className="f01-flex">
            <div className="companyinfobox">
              <div className="companyinfo">
                <ul className="footer-ul">
                  <li>
                    <span className="footerspan"><b>상호:</b> 워라밸팀</span>
                    <span className="footerspan"><b>팀장:</b> 강인구</span>
                    <span className="footerspan"><b>팀원:</b> 곽태온, 정현수, 최연규</span>
                    <span className="footerspan"><b>개인정보취급관리자:</b> 없음</span>
                    <span className="footerspan"><b>통신판매신고번호:</b> 없음</span>
                    <span className="footerspan"><b>사업자등록번호:</b> 없음</span>
                    <span className="footerspan"><b>주소:</b> 서울특별시 어딘가</span>
                    <span className="footerspan"><b>반품주소:</b> 없음</span>
                  </li>
                  <li>
                    <span className="footerspan">"Copyright <strong>워라밸팀</strong> All rights reserved"</span>
                    <span className="footerspan">Hosting by AWS</span>
                    <span className="footerspan">Designed by KangInGu</span>
                  </li>
                </ul>

              </div>
            </div>
            <div className="quickLink">
              <ul className="footer-ul">
                <li><a href="">회사소개</a></li>
                <li><a href="">이용약관</a></li>
                <li><a href="">개인정보취급방침</a></li>
                <li><a href="">이용안내</a></li>
              </ul>
            </div>
          </div>
          {/* <!-- 오른쪽 섹션 --> */}
          <div className="f02-flex">
            <div className="csinfo">
              <h3>고객만족센터</h3>
              <ul className="footer-ul">
                <li>070-0000-0000</li>
                <li>운영 시간: MON-SAT 9:00 AM - 6:00 PM</li>
                <li>일요일 및 공휴일 휴무</li>
              </ul>
            </div>
            <div className="bankinfo">
              <h3>무통장 계좌 정보</h3>
              <ul className="footer-ul">
                <li>국민은행 000000-0000-0000</li>
                <li>예금주: 주식회사 워라밸팀</li>
              </ul>
              <div className="snsinfo">
                <a href="">SNS 링크</a>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- 하단 안내문 --> */}
        <div className="escrowInfo">
          고객님은 안전거래를 위해 현금 등으로 결제 시 저희 쇼핑몰에서 가입한 PG사의 구매안전 서비스를 이용하실 수 있습니다.
        </div>
      </div>
    </footer>
  );
};

export default Footer;