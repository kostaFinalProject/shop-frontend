
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageAddress.css";
import MyPageNavigation from "./MyPageNavigation";

const MyPageAddress = () => {


  return (
    <div className="MyPageAddresscontainer">
      <div id="content" className="-frame">
        <MyPageNavigation />
        <section className="contentwrap">
          <div className="contentwraptitle"> 배송지 관리</div>
          <div className="typeNav">
            <ul className="menu">
              {/* <li class="selected">
        <a href="">
          주문내역조회
        </a>
      </li> */}
            </ul>
          </div>
          <div className="basketfield1">
            <div className="basket1">
              <div className="basketitem1">
                <div className="prdBox1">
                  <div>
                    <table>
                      <colgroup>
                        <col style={{ width: '27px' }} />
                        <col style={{ width: '105px' }} />
                        <col style={{ width: '95px' }} />
                        <col style={{ width: '120px' }} />
                        <col style={{ width: '120px' }} />
                        <col style={{ width: '580px' }} />
                        <col style={{ width: '76px' }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th className="th1">
                            <span>
                              <input type="checkbox" id="allCheck" />
                            </span>
                          </th>
                          <th scope="col" className="th1">배송지명</th>
                          <th scope="col" className="th1">수령인</th>
                          <th scope="col" className="th1">일반전화</th>
                          <th scope="col" className="th1">휴대전화</th>
                          <th scope="col" className="th1">주소</th>
                          <th scope="col" className="th1">수정</th>
                        </tr>
                      </thead>
                      <tbody className="center">
                        <tr className="addresssave">
                          <td>
                            <span>
                              <input type="checkbox" id="oneCheck" />
                            </span>
                          </td>
                          <td>예제1</td>
                          <td>나나나</td>
                          <td>02</td>
                          <td>010-1234-5678</td>
                          <td>
                            경남 진주시 진주대로 1317 이현하이클래스웰가아파트 105동
                            2002호
                          </td>
                          <td>
                            <a href="">수정</a>
                          </td>
                        </tr>
                      </tbody>
                      <tbody className="center">
                        <tr className="addresssave">
                          <td>
                            <span>
                              <input type="checkbox" id="oneCheck" />
                            </span>
                          </td>
                          <td>예제1</td>
                          <td>나나나</td>
                          <td>02</td>
                          <td>010-1234-5678</td>
                          <td>
                            경남 진주시 진주대로 1317 이현하이클래스웰가아파트 105동
                            2002호
                          </td>
                          <td>
                            <a href="">수정</a>
                          </td>
                        </tr>
                      </tbody>
                      <tbody className="center">
                        <tr className="addresssave">
                          <td>
                            <span>
                              <input type="checkbox" id="oneCheck" />
                            </span>
                          </td>
                          <td>
                            <img src="/img/ico_addr_default.gif" alt="" />
                            예제1
                          </td>
                          <td>나나나</td>
                          <td>02</td>
                          <td>010-1234-5678</td>
                          <td>
                            경남 진주시 진주대로 1317 이현하이클래스웰가아파트 105동
                            2002호
                          </td>
                          <td>
                            <a href="">수정</a>
                          </td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr>
                          <td colSpan={7} className="none">
                            등록된 주소가 없습니다.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="buttonGroup">
                      <a href="#none" className="selectDeleteBtn sizeS">
                        선택 주소록 삭제
                      </a>
                      <a href="/MyPage/address/addressregist" className="addressRegistbtn sizeS">
                        배송지 등록
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="help">
                <h3>배송 이용 안내</h3>
                <div className="inner">
                  <ul>
                    <li>
                      배송 주소록은 최대 10개까지 등록할 수 있으며, 별도로 등록하지
                      않을 경우 최근 배송 주소록 기준으로 자동 업데이트 됩니다.
                    </li>
                    <li>
                      기본 배송지는 1개만 저장됩니다. 다른 배송지를 기본 배송지로
                      설정하시면 기본 배송지가 변경됩니다.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

  );
};

export default MyPageAddress;