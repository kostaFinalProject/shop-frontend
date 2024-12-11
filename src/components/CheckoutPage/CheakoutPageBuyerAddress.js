import React, { useRef } from "react";
import './CheakoutPageBuyerAddress.css';

const CheakoutPageBuyerAddress = () => {

    const addressNameRef = useRef(null);
    const userNameRef = useRef(null);
    const userEmailRef = useRef(null);
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
            !userEmailRef.current.value.trim() ||
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
        <>
            <div className="CheakoutPageAddress_Form">
                <form action="" method="post" target="_self" >
                    <div className="CheakoutPageAddress_body">

                    
                        {/* 배송지 성명 칸--------------------- */}
                        <div className='CheakoutPageAddress_Buyer_Name'>
                            <div className="CheakoutPageAddress_Buyer_Name_Title">
                                <label htmlFor="name">받는사람</label>
                            </div>
                            <input type="text" className="CheakoutPageAddress_Buyer_Name_Body" placeholder="" ref={userNameRef} />
                        </div>


                        {/* 주소 칸------------------------- */}
                        <div className='CheakoutPageAddress_Address_address'>
                            <div className="CheakoutPageAddress_Address_address_Form">
                                <div className="CheakoutPageAddress_Address_address_label">
                                    <label htmlFor="address">주소</label>
                                </div>

                                <div className="CheakoutPageAddress_Address_address_inpuit">
                                    <input
                                        type="text"
                                        id="addressnumber"
                                        className="CheakoutPageAddress_AddressNumber"
                                        placeholder="우편번호"
                                        readOnly=""
                                        ref={addressNumberRef}
                                    />
                                    <button
                                        id="SearchAddress"
                                        className="CheakoutPageAddress_SearchBtn"
                                        type="button"
                                        style={{ cursor: "pointer" }}
                                        onClick={handleSearchAddress}
                                    >
                                        주소검색
                                    </button>
                                    <div>
                                        <input
                                            type="text"
                                            className="CheakoutPageAddress_AddressBox"
                                            id="address"
                                            placeholder="기본주소"
                                            readOnly=""
                                            ref={addressRef}
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            className="CheakoutPageAddress_AddressBox"
                                            id="detailaddress"
                                            placeholder="상세주소"
                                            ref={detailAddressRef}
                                        />

                                    </div>

                                </div>
                            </div>

                        </div>
                        {/* 일반전화 --------------------- */}


                        <div className='CheakoutPageAddress_callNumber'>
                            <div className="CheakoutPageAddress_callNumber_label">
                                <label htmlFor="address">일반전화</label>
                            </div>
                            <select name="" id="homeNumber1" className="CheakoutPageAddress_callNumber_callbox">
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
                            <p className="CheakoutPageAddress_callNumber_p">-</p>
                            <input type="text" id="homeNumber2" className="CheakoutPageAddress_callNumber_callbox" />
                            <p className="CheakoutPageAddress_callNumber_p">-</p>
                            <input type="text" id="homeNumber3" className="CheakoutPageAddress_callNumber_callbox" />
                        </div>

                        <div className='CheakoutPageAddress_callNumber'>
                            <div className="CheakoutPageAddress_callNumber_label">
                                <label htmlFor="address">휴대전화</label>
                            </div>
                            <select name="" id="phone1" className="CheakoutPageAddress_callNumber_callbox">
                                <option value="010">010</option>
                                <option value="011">011</option>
                                <option value="016">016</option>
                                <option value="017">017</option>
                                <option value="018">018</option>
                                <option value="019">019</option>
                            </select>
                            <p className="CheakoutPageAddress_callNumber_p">-</p>
                            <input type="text" id="phone2" className="CheakoutPageAddress_callNumber_callbox" ref={phonenumber2Ref} />
                            <p className="CheakoutPageAddress_callNumber_p">-</p>
                            <input type="text" id="phone3" className="CheakoutPageAddress_callNumber_callbox" ref={phonenumber3Ref} />
                        </div>

                    </div>
                </form>

            </div>

        </>
    );
};

export default CheakoutPageBuyerAddress;