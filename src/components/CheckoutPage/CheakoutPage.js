import React, { useState } from 'react';
import './CheakoutPage.css';
import CheakoutPageAddress from './CheakoutPageAddress';
import CheakoutPageBuyerAddress from './CheakoutPageBuyerAddress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

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

    // 보유적립금 적용 및 확인 
    const [inputPoints, setInputPoints] = useState(0); // 입력된 적립금 상태
    const [appliedPoints, setAppliedPoints] = useState(0); // 적용된 적립금 상태

    const availablePoints = 50000; //보유적립금 설정 다음에 DB에서 받아온 값으로 대체
    const handleInputChange = (e) => {
        const value = e.target.value;
        // 입력값이 숫자이며, 0 이상 보유 적립금 이내인 경우만 업데이트
        if (/^\d*$/.test(value) >= 0 && Number(value) <= availablePoints) {
            setInputPoints(value);
        }
    };

    const handleApplyPoints = () => {
        // 적용 버튼 클릭 시 입력된 적립금를 적용
        setAppliedPoints(inputPoints);
        alert(`${inputPoints} 적립금가 적용되었습니다.`);
    };



    // ------------------------------------------------------------------
    // 주문 상품 정보
    const [orderedItems, setOrderedItems] = useState([
        { id: 1, name: "NIKE 리버풀 24/25 STADIUM HOME KIT", quantity: 1, price: 129000 },
        { id: 2, name: "다른 상품", quantity: 3, price: 59000 }
    ]);

    const removeItem = (itemId) => {
        // 해당 아이템을 제거하는 함수
        setOrderedItems(orderedItems.filter(item => item.id !== itemId));
    };
    // 총 가격 계산
    const totalPrice = orderedItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);  // 초기값은 0

    // ------------------------------------------------------------------
    // 할인쿠폰결제
    const [coupon, setCoupon] = useState(null);
    const availableCoupons = [
        { id: 1, name: '할인쿠폰 10000', discount: 10000 },
        { id: 2, name: '할인쿠폰 15000', discount: 15000 },
    ];
    const handleCouponChange = (e) => {
        const selectedCoupon = availableCoupons.find(c => c.id === Number(e.target.value));
        setCoupon(selectedCoupon);
    };

    // ------------------------------------------------------------------
    // 결제 정보 계산
    // 총 금액 계산
    const totalItemPrice = orderedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = 5000;
    const discountAmount = coupon ? coupon.discount : 0;
    const finalPrice = totalItemPrice + shippingFee - discountAmount - appliedPoints;


    //    임시로 넣어둠 추후에 정리 필요 DB에서 받아오고 아이템 선택에따라 금액변동 배송비 할인금액등등 다 변동되어야함

    // ------------------------------------------------------------------
    // 결제 수단 핸들러
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // 선택된 결제 수단

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
    };


    // ------------------------------------------------------------------

    // 최종 결제 금액 표시
    const handleCheckout = () => {
        alert(`최종 결제 금액: ${finalPrice}원`);
    };


    // ------------------------------------------------------------------
    // 적립금 토탈 보여주기
    const calculateTotalPoints = () => {
        return totalPrice * 0.01;
    };

    return (
        <div className="CheakoutPage_fullScreen">

            <div className='CheakoutPage_header'>
                <div className="CheakoutPage_header_01">
                    <Link to='/StyleMain'>  <button><FontAwesomeIcon icon={faArrowLeft} /></button> </Link>
                   
                    <div className='CheakoutPage_Basket_MyPage'>
                    <Link to="/BoardshoppingLi"><button className='CheakoutPage_Basket'><FontAwesomeIcon icon={faShoppingCart} /> </button> </Link>    
                    <Link to="/QnA"><button className='CheakoutPage_MyPage'><FontAwesomeIcon icon={faUser} /> </button> </Link>   
                
                    </div>

                </div>

                <div className='CheakoutPage_header_02'>
                    <div className='CheakoutPage_Title'>
                        주문/결제

                    </div>

                </div>
            </div>




            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine' style={{ marginTop: '100px' }}> </div>
            {/* 주문 정보 섹션 */}
            <div>
                <button onClick={handleToggle1} className='CheakoutPage_UpDownBtn'>
                    <div>주문 정보 </div>{isVisible1 ? '▲' : '▼'}
                </button>
                {isVisible1 && (
                    <div>
                        <CheakoutPageAddress />
                    </div>
                )}
            </div>
            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine' > </div>
            {/* 배송지 섹션 */}
            <div className='CheakoutPage_Address'>
                <button onClick={handleToggle2} className='CheakoutPage_UpDownBtn'>
                    <div>배송지</div>{isVisible2 ? '▲' : '▼'}
                </button>
                {isVisible2 && (
                    <div>
                        <div className='CheakoutPage_Address_select_address'>
                            <div className='CheakoutPage_Address_select_01'>최근배송지</div>
                            <div className='CheakoutPage_Address_select_01'>직접입력</div>
                        </div>

                        <div className='CheakoutPage_Address_Final_select'>
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
                        </div>
                        <div className='CheakoutPage_BuyerAddress_Box'>
                            {deliveryOption === "sameAsOrderer" && (
                                <div className=''>
                                    <CheakoutPageBuyerAddress
                                    />
                                </div>
                            )}

                            {deliveryOption === "newAddress" && (
                                <div className=''>
                                    <CheakoutPageBuyerAddress />
                                </div>
                            )}
                        </div>

                        <div className='CheakoutPage_Delivery'>
                            <select id="omessage_select" name="omessage_select" fw-filter="" fw-label="배송 메세지" fw-msg="" className='CheakoutPage_Delivery_select'>
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
            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine'> </div>
            {/* 주문 상품 섹션 */}
            <div className='CheakoutPage_Ordered_Items'>
                <button onClick={handleToggle3} className='CheakoutPage_UpDownBtn'>
                    <div>주문상품</div>
                    <div>{orderedItems.length} 개</div> {isVisible3 ? '▲' : '▼'}
                </button>
                {isVisible3 && (
                     <div className="CheakoutPage_Ordered_Items">
                     <button onClick={handleToggle3} className="CheakoutPage_UpDownBtn">
                         <div>주문상품</div>
                         <div>{orderedItems.length} 아이템</div> {isVisible3 ? '▲' : '▼'}
                     </button>
                     {isVisible3 && (
                         <div>
                             {/* 결제창 아이템 박스 ------------------ */}
                             {orderedItems.map((item) => (
                                 <div key={item.id} className="CheakoutPage_Ordered_Items_ItemBox">
                                     <div className="CheakoutPage_Ordered_Items_CheakBox">
                                         <input type="checkbox" disabled />
                                     </div>
         
                                     <div className="CheakoutPage_Ordered_Items_TextBox">
                                         <div className="CheakoutPage_Ordered_Items_Iemag">
                                             <a href="">
                                                 <img
                                                     src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fcdn.footballist.co.kr%2Fnews%2Fphoto%2F202307%2F170147_100300_4428.jpg&type=sc960_832"
                                                     alt=""
                                                 />
                                             </a>
                                         </div>
         
                                         {/* 텍스트 박스------------ */}
                                         <div className="CheakoutPage_Ordered_Items_content">
                                             <strong className="CheakoutPage_Ordered_Items_Title">
                                                 <a href="">{item.name}</a>
                                             </strong>
                                             <ul className="CheakoutPage_Ordered_Items_Body">
                                                 <li>
                                                     <p className="CheakoutPage_Ordered_Items_Price">
                                                         [옵션: 프리미어리그 패치 (-129,000)]
                                                     </p>
                                                 </li>
                                                 <li className="CheakoutPage_Ordered_Items_Quantity">수량: {item.quantity}개</li>
                                                 <li className="CheakoutPage_Ordered_Items_Sale">
                                                     <div>{item.name} ({item.quantity}개) - {item.price * item.quantity}원</div>
                                                 </li>
                                             </ul>
                                             <div>
                                                 <span className="CheakoutPage_Ordered_Items_TotalPrice">
                                                     {item.price * item.quantity}원
                                                 </span>
                                             </div>
                                         </div>
         
                                         <button
                                             type="button"
                                             className="CheakoutPage_Ordered_Items_BtnRemove"
                                             onClick={() => removeItem(item.id)}
                                         >
                                             x
                                         </button>
                                     </div>
                                 </div>
                             ))}
                             <div className="CheakoutPage_Ordered_Items_Total">
                                 <strong>총 가격: {totalPrice}원</strong>
                             </div>
                         </div>
                     )}
                 </div>
                )}
            </div>
            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine'> </div>
            {/* 할인/부가결제  */}
            <div className="CheakoutPage_Discounts">
                <button onClick={handleToggle4} className='CheakoutPage_UpDownBtn'>
                    <div>할인쿠폰</div>
                    <div>{coupon ? `${coupon.name}가 선택되었습니다.` : "할인쿠폰을 선택해주세요."}</div> {isVisible4 ? '▲' : '▼'}
                </button>
                {isVisible4 && (

                    <div className='CheakoutPage_Discount_Box'>
                        <select onChange={handleCouponChange} className='CheakoutPage_Discount_Select'>
                            <option value="">-- 할인 쿠폰 선택 --</option>
                            {availableCoupons.map((coupon) => (
                                <option key={coupon.id} value={coupon.id}>{coupon.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine'> </div>
            {/* 보유적립금 */}
            <div className="CheakoutPage_Payment_Information">
                <button onClick={handleToggle5} className='CheakoutPage_UpDownBtn'>
                    <div>보유적립금</div>
                    <div>적립금 {appliedPoints}원이 사용되었습니다</div> {isVisible5 ? '▲' : '▼'}
                </button>
                {isVisible5 && ( // 여기를 수정

                    <div>
                        <div className="CheakoutPage_Payment_Information_point">
                            <div className='CheakoutPage_Payment_Information_point_Flex'>
                                {/* 보유 적립금 표시 */}
                                <div className='CheakoutPage_Payment_Information_point_Title'>보유 적립금</div>
                                <div className='CheakoutPage_Payment_Information_point_Content'>{availablePoints}원</div>
                            </div>

                            <div className='CheakoutPage_Payment_Information_point_Flex'>
                                {/* 적립금 입력 칸 */}
                                <div className='CheakoutPage_Payment_Information_point_Title'>사용할 적립금</div>
                                <div className='CheakoutPage_Payment_Information_point_Content'><input
                                    className='CheakoutPage_Payment_Points_Input'
                                    type="number"
                                    id="inputPoints"
                                    value={inputPoints}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                />
                                </div>

                            </div>
                            <div className='CheakoutPage_Payment_Information_point_Flex'>
                                <div className='CheakoutPage_Payment_Information_point_Content_BtnBox'>   {/* 적용 버튼 */}
                                    <div className="CheakoutPage_Payment_Information_Apply_Points">
                                        <button onClick={handleApplyPoints}>적용</button>
                                    </div>
                                </div>

                            </div>
                            <div className='CheakoutPage_Payment_Information_point_Flex_Final' >
                                <div className='CheakoutPage_Payment_Information_point_Title'>적용된 적립금</div>
                                <div className='CheakoutPage_Payment_Information_point_Content'>{appliedPoints}점</div>

                            </div>

                        </div>
                    </div>


                )}
            </div>
            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine'> </div>
            {/*결제정보 */}
            <div className="CheakoutPage_Payment_Information">
                <button onClick={handleToggle6} className='CheakoutPage_UpDownBtn'>
                    <div>결제정보</div> 
                    <div>{finalPrice}원</div>  {isVisible6 ? '▲' : '▼'}
                </button>
                {isVisible6 && (
                    <div>
                        <div className="CheakoutPage_Payment_payment">
                            <div className='CheakoutPage_Payment_payment_Flex'>
                                <div className='CheakoutPage_Payment_payment_Title'>주문 상품 총 금액 </div>
                                <div className='CheakoutPage_Payment_payment_Content'>{totalPrice}원</div>
                            </div>
                            <div className='CheakoutPage_Payment_payment_Flex'>
                                <div className='CheakoutPage_Payment_payment_Title'>배송비</div>
                                <div className='CheakoutPage_Payment_payment_Content'>+ {shippingFee}원</div>

                            </div>
                            <div className='CheakoutPage_Payment_payment_Flex'>
                                <div className='CheakoutPage_Payment_payment_Title'>할인/부가결제</div>
                                <div className='CheakoutPage_Payment_payment_Content'>- {discountAmount}원</div>

                            </div>
                            <div className='CheakoutPage_Payment_payment_Flex' >
                                <div className='CheakoutPage_Payment_payment_Title'>적립금 적용 금액 </div>
                                <div className='CheakoutPage_Payment_payment_Content'>- {appliedPoints}원</div>

                            </div>
                            <div className='CheakoutPage_Payment_payment_Flex_Final'>
                                <div className='CheakoutPage_Payment_payment_Title'>최종 결제 금액 </div>
                                <div className='CheakoutPage_Payment_payment_Content'>{finalPrice}원</div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine'> </div>
            {/* 결제수단*/}
            <div className="CheakoutPage_Payment_Methods">
                <button onClick={handleToggle7} className='CheakoutPage_UpDownBtn'>
                    <div>결제수단</div>   {isVisible7 ? '▲' : '▼'}
                </button>
                {isVisible7 && (
                    <div>
                        <div>
                            <div className="payment-methods">
                                <button onClick={() => handlePaymentMethodChange('bankTransfer')}>무통장입금</button>
                                <button onClick={() => handlePaymentMethodChange('mobilePayment')}>휴대폰결제</button>
                                <button onClick={() => handlePaymentMethodChange('cardPayment')}>카드결제</button>
                                <button onClick={() => handlePaymentMethodChange('realTimeTransfer')}>실시간계좌이체</button>
                            </div>

                            {/* 결제 방법에 따른 추가 입력 폼 표시 */}
                            {selectedPaymentMethod === 'bankTransfer' && (
                                <div className="bank-transfer-section">
                                    <label>입금자명:</label>
                                    <input type="text" placeholder="입금자명을 입력해주세요" />
                                    <label>입금액:</label>
                                    <input type="number" placeholder="입금액을 입력해주세요" />
                                </div>
                            )}

                            {selectedPaymentMethod === 'mobilePayment' && (
                                <div className="mobile-payment-section">
                                    <label>휴대폰 번호:</label>
                                    <input type="text" placeholder="휴대폰 번호를 입력해주세요" />
                                </div>
                            )}

                            {selectedPaymentMethod === 'cardPayment' && (
                                <div className="card-payment-section">
                                    <label>카드 번호:</label>
                                    <input type="text" placeholder="카드 번호를 입력해주세요" />
                                    <label>유효기간:</label>
                                    <input type="text" placeholder="유효기간을 입력해주세요" />
                                    <label>카드 비밀번호:</label>
                                    <input type="password" placeholder="카드 비밀번호를 입력해주세요" />
                                </div>
                            )}

                            {selectedPaymentMethod === 'realTimeTransfer' && (
                                <div className="real-time-transfer-section">
                                    <label>은행 선택:</label>
                                    <select>
                                        <option value="bank1">은행 1</option>
                                        <option value="bank2">은행 2</option>
                                        <option value="bank3">은행 3</option>
                                    </select>
                                    <label>계좌번호:</label>
                                    <input type="text" placeholder="계좌번호를 입력해주세요" />
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>

            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine'> </div>
            {/* 적립혜택*/}
            <div className="CheakoutPage_Rewards_Benefits">
                <button onClick={handleToggle8} className='CheakoutPage_UpDownBtn'>
                    <div>적립혜택</div>
                    <div>{calculateTotalPoints()}원 예정</div>   {isVisible8 ? '▲' : '▼'}
                </button>
                {isVisible8 && (

                    <div>
                        {/* 총 적립금 */}

                        <div className='CheakoutPage_Rewards_Flex'>
                            <div className='CheakoutPage_Rewards_Title'>총 적립금</div>
                            <div className='CheakoutPage_Rewards_Content'>{calculateTotalPoints()}원</div>
                        </div>
                    </div>


                )}

            </div>
            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine'> </div>

            <div className='CheakoutPage_Agree_Title_01'>
                <p className='CheakoutPage_Agree_01'>구매조건 확인 및 결제진행 동의</p>
                <p className='CheakoutPage_Agree_02'>주문 내용을 확인하였으며 약관에 동의합니다.</p>
            </div>


            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine'> </div>

            {/* 결제하기 버튼 */}
            <div className='CheakoutPage_BuyBtnBox'>
                <button className='CheakoutPage_BuyBtn' onClick={handleCheckout}>{finalPrice}원 결제하기</button>
            </div>

            {/* 경계선-------------------- */}
            <div className='CheakoutPage_BoundaryLine'> </div>

            <div className='CheakoutPage_Agree_Title_02'>
                <p className='CheakoutPage_Agree_03'>-무이자할부가 적용되지 않은 상품과 무이자할부가 가능한 상품을 동시에 구매할 경우 전체 주문 상품 금액에 대해 무이자할부가 적용되지 않습니다. 무이자할부를 원하시는 경우 장바구니에서 무이자할부 상품만 선택하여 주문하여 주시기 바랍니다.</p>
                <p className='CheakoutPage_Agree_04'>-최소 결제 가능 금액은 결제금액에서 배송비를 제외한 금액입니다.</p>

            </div>
        </div>
    );
};

export default CheckoutPage;
