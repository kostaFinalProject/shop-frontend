
import React, { useState, useRef } from "react";
import "./AddressRegisterForm.css";
import MyPageNavigation from "./MyPageNavigation";

const AddressRegisterForm = () => {

  const addressNameRef = useRef(null);
  const userNameRef = useRef(null);
  const addressNumberRef = useRef(null);
  const addressRef = useRef(null);
  const detailAddressRef = useRef(null);
  const phonenumber2Ref = useRef(null);
  const phonenumber3Ref = useRef(null);

  const handleSearchAddress = () => {
    if (!window.daum || !window.daum.Postcode) {
      console.error("Daum Postcode script is not loaded!");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        let addr = "";
        let extraAddr = "";

        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === "R") {
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr += extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
          }
          if (extraAddr !== "") {
            extraAddr = ` (${extraAddr})`;
          }
        }

        if (addressNumberRef.current) {
          addressNumberRef.current.value = data.zonecode;
        }
        if (addressRef.current) {
          addressRef.current.value = addr + extraAddr;
        }
      },
    }).open();
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // 기본 폼 제출 방지

    // 필수 입력 필드 확인
    if (
      !addressNameRef.current.value.trim() ||
      !userNameRef.current.value.trim() ||
      !addressNumberRef.current.value.trim() ||
      !addressRef.current.value.trim() ||
      !phonenumber2Ref.current.value.trim() ||
      !phonenumber3Ref.current.value.trim()
    ) {
      alert("모든 필수 입력 항목을 채워주세요.");
      return;
    }

    // 전화번호 유효성 검사
    const phoneRegex = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;

    const phone1 = document.getElementById("phone1").value; // 선택된 지역번호
    const phone2 = phonenumber2Ref.current.value; // 두 번째 입력값
    const phone3 = phonenumber3Ref.current.value; // 세 번째 입력값

    const fullPhoneNumber = `${phone1}-${phone2}-${phone3}`;

    if (!phoneRegex.test(fullPhoneNumber)) {
      alert("올바른 휴대전화 번호를 입력해주세요.");
      return;
    }

    // 폼 데이터를 처리하는 로직 추가
    alert("폼이 성공적으로 제출되었습니다!");
  };
  return (
    <div className="addressRegistFormcontainer">
      <div id="content" className="-frame">
          <MyPageNavigation />
        <section className="contentwrap">
          <div className="contentwraptitle"> 배송지 등록</div>
          <div className="typeNav">
          </div>
          <form action="" method="post" target="_self">
            <div className="addressregistfield">
              <table>
                <colgroup>
                  <col style={{ width: 170 }} />
                  <col style={{ width: "auto" }} />
                </colgroup>
                <tbody>
                  <tr>
                    <th scope="row">
                      배송지명
                      <img src="/img/ico_required.svg" alt="" />
                    </th>
                    <td>
                      <input type="text" className="inputTypeText" placeholder="" ref={addressNameRef} />
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      성명
                      <img src="/img/ico_required.svg" alt="" />
                    </th>
                    <td>
                      <input type="text" className="inputTypeText" placeholder="" ref={userNameRef} />
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      주소
                      <img src="/img/ico_required.svg" alt="" />
                    </th>
                    <td>
                      <ul>
                        <li>
                          <input
                            type="text"
                            id="addressnumber"
                            className="inputTypeText"
                            placeholder="우편번호"
                            readOnly=""
                            ref={addressNumberRef}
                          />
                          <button
                            id="SearchAddress"
                            className="btnBasic"
                            type="button"
                            style={{ cursor: "pointer" }}
                            onClick={handleSearchAddress}
                          >
                            주소검색
                          </button>
                        </li>
                        <li>
                          <input
                            type="text"
                            className="addressBox"
                            id="address"
                            placeholder="기본주소"
                            readOnly=""
                            ref={addressRef}
                          />
                        </li>
                        <li>
                          <input
                            type="text"
                            className="addressBox"
                            id="detailaddress"
                            placeholder="상세주소"
                            ref={detailAddressRef}
                          />
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">일반전화</th>
                    <td>
                      <select name="" id="homeNumber1" className="callbox">
                        <option value="02">02</option>
                        <option value="031">031</option>
                        <option value="032">032</option>
                        <option value="033">033</option>
                        <option value="041">041</option>
                        <option value="042">042</option>
                        <option value="043">043</option>
                        <option value="044">044</option>
                        <option value="051">051</option>
                        <option value="052">052</option>
                        <option value="053">053</option>
                        <option value="054">054</option>
                        <option value="055">055</option>
                        <option value="061">061</option>
                        <option value="062">062</option>
                        <option value="063">063</option>
                        <option value="064">064</option>
                        <option value="0502">0502</option>
                        <option value="0503">0503</option>
                        <option value="0504">0504</option>
                        <option value="0505">0505</option>
                        <option value="0506">0506</option>
                        <option value="0507">0507</option>
                        <option value="070">070</option>
                      </select>
                      -
                      <input type="text" id="homeNumber2" className="callbox" />
                      -
                      <input type="text" id="homeNumber3" className="callbox" />
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      휴대전화
                      <img src="/img/ico_required.svg" alt="" />
                    </th>
                    <td>
                      <select name="" id="phone1" className="callbox">
                        <option value="010">010</option>
                        <option value="011">011</option>
                        <option value="016">016</option>
                        <option value="017">017</option>
                        <option value="018">018</option>
                        <option value="019">019</option>
                      </select>
                      -
                      <input type="text" id="phone2" className="callbox"
                        ref={phonenumber2Ref} />
                      -
                      <input type="text" id="phone3" className="callbox"
                        ref={phonenumber3Ref} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="addressSave">
              <input type="checkbox" />
              <label htmlFor="">기본 배송지로 저장</label>
            </div>
          </form>
          <div className="buttonGroup">
            <a href="#none" className="Registbtn sizeS" onClick={handleSubmit}>
              배송지 등록
            </a>
          </div>
          <div className="help">
            <h3>배송주소록 유의사항</h3>
            <div className="inner">
              <ul>
                <li>
                  배송 주소록은 최대 10개까지 등록할 수 있으며, 별도로 등록하지 않을
                  경우 최근 배송 주소록 기준으로 자동 업데이트 됩니다.
                </li>
                <li>
                  기본 배송지는 1개만 저장됩니다. 다른 배송지를 기본 배송지로
                  설정하시면 기본 배송지가 변경됩니다.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>

  );
};

export default AddressRegisterForm;