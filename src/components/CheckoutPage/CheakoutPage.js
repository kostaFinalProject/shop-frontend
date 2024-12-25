import React, { useState } from 'react';
import './CheakoutPage.css';

const CheckoutPage = () => {
    // 각 섹션의 토글 상태를 관리하는 useState 훅
    const [isVisible1, setIsVisible1] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);
    const [isVisible4, setIsVisible4] = useState(false);
    const [isVisible5, setIsVisible5] = useState(false);
    const [isVisible6, setIsVisible6] = useState(false);
    const [isVisible7, setIsVisible7] = useState(false);
    const [isVisible8, setIsVisible8] = useState(false);

    // 각 버튼 클릭 시 섹션을 토글하는 함수
    const handleToggle1 = () => setIsVisible1(!isVisible1);
    const handleToggle2 = () => setIsVisible2(!isVisible2);
    const handleToggle3 = () => setIsVisible3(!isVisible3);
    const handleToggle4 = () => setIsVisible4(!isVisible4);
    const handleToggle5 = () => setIsVisible5(!isVisible5);
    const handleToggle6 = () => setIsVisible6(!isVisible6);
    const handleToggle7 = () => setIsVisible7(!isVisible7);
    const handleToggle8 = () => setIsVisible8(!isVisible8);
    // -----------------------------------------------------------------------

    //배송지 선택 
    const [deliveryOption, setDeliveryOption] = useState("sameAsOrderer");
    const [newAddress, setNewAddress] = useState("");

    const handleOptionChange = (e) => {
        setDeliveryOption(e.target.value);
    };

    const handleAddressChange = (e) => {
        setNewAddress(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (deliveryOption === "newAddress" && !newAddress.trim()) {
            alert("새로운 배송지를 입력해주세요!");
            return;
        }
        alert(`선택한 옵션: ${deliveryOption}\n배송지: ${deliveryOption === "sameAsOrderer" ? "주문자 배송지" : newAddress}`);
    };
    // ------------------------------------------------------------------

    // 보유포인트 적용 및 확인 
    const [inputPoints, setInputPoints] = useState(0); // 입력된 포인트 상태
    const [appliedPoints, setAppliedPoints] = useState(0); // 적용된 포인트 상태
    
    const availablePoints = 50000; //보유포인트 설정 다음에 DB에서 받아온 값으로 대체
    const handleInputChange = (e) => {
        const value = Number(e.target.value);
        // 입력값이 숫자이며, 0 이상 보유 포인트 이내인 경우만 업데이트
        if (value >= 0 && value <= availablePoints) {
            setInputPoints(value);
        }
    };

    const handleApplyPoints = () => {
        // 적용 버튼 클릭 시 입력된 포인트를 적용
        setAppliedPoints(inputPoints);
        alert(`${inputPoints} 포인트가 적용되었습니다.`);
    };

    // ------------------------------------------------------------------
       // 결제 정보 계산
       const [totalPrice] = useState(200000); // 예시로 총 금액 200,000원
       const [shippingFee] = useState(5000); // 예시로 배송비 5,000원
       const [discountAmount] = useState(10000); // 예시로 할인 금액 10,000원
       const finalPrice = totalPrice + shippingFee - discountAmount - appliedPoints;

    //    임시로 넣어둠 추후에 정리 필요 DB에서 받아오고 아이템 선택에따라 금액변동 배송비 할인금액등등 다 변동되어야함
    return (
        <div className="CheakoutPage_fullScreen">
            <div className="CheakoutPage_header">
                <div className='CheakoutPage_Title'>
                    주문/결제
                    <div className='CheakoutPage_Basket'>장바구니</div>
                    <div className='CheakoutPage_MyPage'>마이페이지</div>
                </div>

            </div>

            {/* 주문 정보 섹션 */}
            <div>
                <button onClick={handleToggle1} className='CheakoutPage_UpDownBtn'>
                    <div>주문 정보 </div>{isVisible1 ? '▲' : '▼'}
                </button>
                {isVisible1 && (
                    <div className='CheakoutPage_Order_inpormation'>
                        <div>
                            <label htmlFor="orderer">주문자</label>
                            <input type="text" id="orderer" />
                        </div>

                        <div className=''>
                            <label htmlFor="email">이메일</label>
                            <input type="text" id="email" />
                        </div>

                        <div className=''>
                            <label htmlFor="phone">휴대전화</label>
                            <input type="text" id="phone" />
                        </div>

                        <div className=''>
                            <label htmlFor="zipcode">주소</label>
                            <input type="text" id="zipcode" placeholder="우편번호" />
                            <input type="text" id="address1" placeholder="기본주소" />
                            <input type="text" id="address2" placeholder="나머지주소" />
                        </div>
                    </div>
                )}
            </div>

            {/* 배송지 섹션 */}
            <div className='CheakoutPage_Address'>
                <button onClick={handleToggle2}>
                    <div>배송지</div>{isVisible2 ? '▲' : '▼'}
                </button>
                {isVisible2 && (
                    <div>
                        <div>
                            <div>최근배송지</div>
                            <div>직접입력</div>
                        </div>

                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="deliveryOption"
                                    value="sameAsOrderer"
                                    checked={deliveryOption === "sameAsOrderer"}
                                    onChange={handleOptionChange}
                                />
                                주문자 배송지와 동일
                            </label>
                            <br />
                            <label>
                                <input
                                    type="radio"
                                    name="deliveryOption"
                                    value="newAddress"
                                    checked={deliveryOption === "newAddress"}
                                    onChange={handleOptionChange}
                                />
                                새로운 배송지
                            </label>
                            <br />
                            {deliveryOption === "sameAsOrderer" && (
                                <div className=''>
                                    <div>
                                        <label htmlFor="orderer">주문자</label>
                                        <input type="text" id="orderer" />
                                    </div>

                                    <div className=''>
                                        <label htmlFor="zipcode">주소</label>
                                        <input type="text" id="zipcode" placeholder="우편번호" />
                                        <input type="text" id="address1" placeholder="기본주소" />
                                        <input type="text" id="address2" placeholder="나머지주소" />
                                    </div>

                                    <div className=''>
                                        <label htmlFor="phone">휴대전화</label>
                                        <input type="text" id="phone" />
                                    </div>


                                </div>
                            )}
                            <br />
                            {deliveryOption === "newAddress" && (
                                <div className=''>
                                    <div>
                                        <label htmlFor="orderer">주문자</label>
                                        <input type="text" id="orderer" />
                                    </div>

                                    <div className=''>
                                        <label htmlFor="zipcode">주소</label>
                                        <input type="text" id="zipcode" placeholder="우편번호" />
                                        <input type="text" id="address1" placeholder="기본주소" />
                                        <input type="text" id="address2" placeholder="나머지주소" />
                                    </div>

                                    <div className=''>
                                        <label htmlFor="phone">휴대전화</label>
                                        <input type="text" id="phone" />
                                    </div>


                                </div>
                            )}
                        </div>

                        <div>
                            <select id="omessage_select" name="omessage_select" fw-filter="" fw-label="배송 메세지" fw-msg="">
                                <option value="oMessage-0" selected="selected">-- 메시지 선택 (선택사항) --</option>
                                <option value="oMessage-1">배송 전에 미리 연락바랍니다.</option>
                                <option value="oMessage-2">부재 시 경비실에 맡겨주세요.</option>
                                <option value="oMessage-3">부재 시 문 앞에 놓아주세요.</option>
                                <option value="oMessage-4">빠른 배송 부탁드립니다.</option>
                                <option value="oMessage-5">택배함에 보관해 주세요.</option>
                                <option value="oMessage-input">직접 입력</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* 주문 상품 섹션 */}
            <div className='CheakoutPage_Ordered_Items'>
                <button onClick={handleToggle3}>
                    <div>주문상품</div>  {isVisible3 ? '▲' : '▼'}
                </button>
                {isVisible3 && (
                    <div>

                        <div className="">
                            <div className="">
                                <input id="" name="" value="" type="checkbox" disabled="" />
                            </div>

                            <div className="">
                                <a href=""><img src="" alt="" /></a>
                            </div>

                            <div className="">
                                <strong className="" title="">
                                    <a href="" className="">NIKE 리버풀 24/25 STADIUM HOME KIT [프리미어리그]</a>
                                </strong>
                                <ul className="">
                                    <li title="">
                                        <p className=" ">[옵션: 프리미어리그 패치 (-129,000)]</p>
                                    </li>
                                    <li>수량: 1개</li>
                                    <li id="" className="">
                                        할인금액: <span className="">-<span id="">0</span>원 </span>
                                        <span className="">()</span>
                                    </li>

                                </ul>
                                <div className="proPrice">
                                    <span className="">20,000원</span>
                                </div>
                            </div>
                            <button type="button" className="btnRemove " id="" >삭제</button>
                        </div>
                    </div>
                )}
            </div>


            {/* 할인/부가결제  */}
            <div className="CheakoutPage_Discounts">
                <button onClick={handleToggle4}>
                    <div>할인/부가결제</div>   {isVisible4 ? '▲' : '▼'}
                </button>
                {isVisible4 && (
                    <div>
                        <select id="omessage_select" name="omessage_select" fw-filter="" fw-label="할인 쿠폰" fw-msg="">
                            <option value="oMessage-0" selected="selected">-- 할인쿠폰 --</option>
                            <option value="oMessage-1">할인쿠폰1</option>
                            <option value="oMessage-2">할인쿠폰2</option>
                            <option value="oMessage-3">할인쿠폰3</option>
                            <option value="oMessage-4">할인쿠폰4</option>
                        </select>
                    </div>
                )}
            </div>

            {/* 보유포인트 */}
            <div className="CheakoutPage_Payment_Information">
                <button onClick={handleToggle5}>
                    <div>보유포인트</div> {isVisible5 ? '▲' : '▼'}
                </button>
                {isVisible5 && ( // 여기를 수정
                    <div>
                        <div className="points-section">
                            {/* 보유 포인트 표시 */}
                            <div className="available-points">
                                <span>보유 포인트: </span>
                                <strong>5000점</strong> {/* 예제 값을 직접 표시하거나 state로 변경 */}
                            </div>

                            {/* 포인트 입력 칸 */}
                            <div className="points-input">
                                <label htmlFor="inputPoints">사용할 포인트:</label>
                                <input
                                    type="number"
                                    id="inputPoints"
                                    value={inputPoints}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                />
                            </div>

                            {/* 적용 버튼 */}
                            <div className="apply-points">
                                <button onClick={handleApplyPoints}>적용</button>
                            </div>

                            {/* 적용된 포인트 표시 */}
                            <div className="applied-points">
                                <span>적용된 포인트: </span>
                                <strong>{appliedPoints}점</strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/*결제정보 */}
            <div className="CheakoutPage_Payment_Information">
                <button onClick={handleToggle6}>
                    <div>결제정보</div>   {isVisible6 ? '▲' : '▼'}
                </button>
                {isVisible6 && (
                        <div>
                        <div className="payment-summary">
                            <div>
                                <strong>주문 상품 총 금액: </strong>
                                <span>{totalPrice}원</span>
                            </div>
                            <div>
                                <strong>배송비: </strong>
                                <span>{shippingFee}원</span>
                            </div>
                            <div>
                                <strong>할인/부가결제: </strong>
                                <span>{discountAmount}원</span>
                            </div>
                            <div>
                                <strong>포인트 적용 금액: </strong>
                                <span>{appliedPoints}원</span>
                            </div>
                            <div>
                                <strong>최종 결제 금액: </strong>
                                <span>{finalPrice}원</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 결제수단*/}
            <div className="CheakoutPage_Payment_Methods">
                <button onClick={handleToggle7}>
                    <div>결제수단</div>   {isVisible7 ? '▲' : '▼'}
                </button>
                {isVisible7 && (
                    <div>
                        

                    </div>
                )}
            </div>

            {/* 적립혜택*/}
            <div className="CheakoutPage_Rewards_Benefits">
                <button onClick={handleToggle8}>
                    <div>적립혜택</div>   {isVisible8 ? '▲' : '▼'}
                </button>
                {isVisible8 && (
                    <div>


                    </div>
                )}
            </div>

            <div>
                <button>200,000원 결제하기</button>
            </div>
        </div>
    );
};

export default CheckoutPage;
