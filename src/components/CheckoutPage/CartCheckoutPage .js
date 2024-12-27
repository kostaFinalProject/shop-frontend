import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CheckoutPageAddress from "./CheckoutPageAddress";
import "./CheckoutPage.css";

const CartCheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state: orderData } = location || {};
    const { totalAmount, shippingFee, items } = orderData || {};

    // 회원 정보 상태
    const [memberInfo, setMemberInfo] = useState(null);

    // 적립금 상태
    const [inputPoints, setInputPoints] = useState(0);
    const [appliedPoints, setAppliedPoints] = useState(0);

    // 섹션별 가시성 상태
    const [isVisible1, setIsVisible1] = useState(false); // 주문 정보
    const [isVisible2, setIsVisible2] = useState(false); // 배송지
    const [isVisible3, setIsVisible3] = useState(false); // 주문 상품
    const [isVisible5, setIsVisible5] = useState(false); // 보유 적립금
    const [isVisible6, setIsVisible6] = useState(false); // 결제 정보

    // 배송지 정보 상태
    const [selectedAddress, setSelectedAddress] = useState(null);

    // 보유 적립금
    const availablePoints = memberInfo?.point || 0;

    // 최종 결제 금액 계산
    const finalPrice = totalAmount + shippingFee - appliedPoints;

    // 회원 정보 API 호출
    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const accesstoken = localStorage.getItem("accessToken");
                const refreshtoken = localStorage.getItem("refreshToken");

                if (!accesstoken) {
                    alert("로그인이 필요합니다.");
                    return;
                }

                const response = await fetch("http://localhost:8080/api/v1/members", {
                    headers: {
                        Authorization: accesstoken,
                        "Refresh-Token": refreshtoken,
                    },
                });

                if (!response.ok) throw new Error("회원 정보를 불러오는 데 실패했습니다.");
                const data = await response.json();
                setMemberInfo(data);
            } catch (error) {
                console.error(error);
                alert("회원 정보를 불러오지 못했습니다.");
            }
        };

        fetchMemberInfo();
    }, []);

    // 적립금 전액 사용
    const handleUseAllPoints = () => {
        if (availablePoints > totalAmount) {
            setAppliedPoints(totalAmount);
        } else {
            setAppliedPoints(availablePoints);
        }
        setInputPoints(""); // 입력창 초기화
        alert("보유한 적립금 전액을 적용했습니다.");
    };

    // 적립금 입력 변경
    const handleInputChange = (e) => {
        const value = Number(e.target.value);
        if (value >= 0 && value <= availablePoints) {
            setInputPoints(value);
        } else {
            alert("보유한 적립금을 초과할 수 없습니다.");
        }
    };

    // 적립금 적용
    const handleApplyPoints = () => {
        if (inputPoints > totalAmount) {
            alert("적립금은 총 상품 금액을 초과할 수 없습니다.");
            return;
        }
        setAppliedPoints(inputPoints);
        setInputPoints(""); // 입력창 초기화
        alert(`${inputPoints}원이 적용되었습니다.`);
    };

    // 주문 제출
    const handleOrderSubmit = async () => {
        if (!selectedAddress) {
            alert("배송지를 선택하세요.");
            return;
        }

        const accesstoken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accesstoken || !refreshToken) {
            alert("로그인이 필요한 기능입니다.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/v1/carts/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accesstoken,
                    'Refresh-Token': refreshToken
                },
                body: JSON.stringify({ orderItems: items.map(({ itemSizeId, quantity }) => ({ itemSizeId, count: quantity })) })
            });

            if (!response.ok) throw new Error('Failed to create order');

            alert("결제창으로 넘어갑니다.");

            const { orderId, amount } = await response.json();

            const IMP = window.IMP;
            IMP.init('imp81860065');

            IMP.request_pay(
                {
                    pg: "html5_inicis",
                    pay_method: "card",
                    merchant_uid: `order_${orderId}`,
                    name: items.map(item => `[${item.manufacturer}] ${item.itemName} (${item.size})`).join(", "),
                    amount: amount + shippingFee,
                    buyer_email: memberInfo.email,
                    buyer_name: memberInfo.name,
                    buyer_tel: memberInfo.phone,
                    buyer_addr: selectedAddress.roadAddress + " " + selectedAddress.detailAddress,
                    buyer_postcode: selectedAddress.postCode
                },
                async (response) => {
                    if (response.success) {
                        await fetch('http://localhost:8080/api/v1/payments', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': accesstoken,
                                'Refresh-Token': refreshToken
                            },
                            body: JSON.stringify({
                                orderId: orderId,
                                impUid: response.imp_uid,
                                orderPrice: amount
                            })
                        });

                        alert("결제가 완료되었습니다!");
                        navigate("/MyPage/order");
                    } else {
                        alert(`결제 실패: ${response.error_msg}`);
                    }
                }
            );

        } catch (error) {
            console.error('Order creation error:', error);
        }
    };

    return (
        <div className="CheckoutPage_fullScreen">
            {/* 주문 정보 */}
            <div>
                <button onClick={() => setIsVisible1(!isVisible1)} className="CheckoutPage_UpDownBtn">
                    <div>주문 정보</div>
                    {isVisible1 ? "▲" : "▼"}
                </button>
                {isVisible1 && (
                    <div>
                        {memberInfo ? (
                            <>
                                <p>이름: {memberInfo.name}</p>
                                <p>이메일: {memberInfo.email}</p>
                                <p>전화번호: {memberInfo.phone}</p>
                            </>
                        ) : (
                            <p>회원 정보를 불러오는 중...</p>
                        )}
                    </div>
                )}
            </div>

            {/* 배송지 선택 */}
            <div>
                <button onClick={() => setIsVisible2(!isVisible2)} className="CheckoutPage_UpDownBtn">
                    <div>배송지</div>
                    {isVisible2 ? "▲" : "▼"}
                </button>
                {isVisible2 && (
                    <CheckoutPageAddress
                        onAddressChange={(address) => setSelectedAddress(address)}
                    />
                )}
            </div>

            {/* 주문 상품 */}
            <div>
                <button onClick={() => setIsVisible3(!isVisible3)} className="CheckoutPage_UpDownBtn">
                    <div>주문 상품</div>
                    {isVisible3 ? "▲" : "▼"}
                </button>
                {isVisible3 && (
                    <div>
                        {items.map((item) => (
                            <div key={item.itemSizeId} className="CheckoutPage_ItemBox">
                                {/* 상품 이미지 */}
                                <div className="CheckoutPage_ItemImageWrapper">
                                    <img
                                        src={`/uploads/${item.imgUrl}`}
                                        alt={item.itemName}
                                        className="CheckoutPage_ItemImage"
                                    />
                                </div>
                                {/* 상품 정보 */}
                                <p>상품명: {`[${item.manufacturer}]`} {item.itemName}</p>
                                <p>판매처: {item.seller}</p>
                                <p>사이즈: {item.size}</p>
                                <p>수량: {item.quantity}</p>
                                <p>가격: {item.quantity * item.price}원</p>
                            </div>
                        ))}
                        <div>
                            <strong>총 상품 금액: {totalAmount}원</strong>
                        </div>
                    </div>
                )}
            </div>

            {/* 적립금 */}
            <div>
                <button onClick={() => setIsVisible5(!isVisible5)} className="CheckoutPage_UpDownBtn">
                    <div>보유 적립금</div>
                    <div>{appliedPoints}원이 사용되었습니다</div>
                    {isVisible5 ? "▲" : "▼"}
                </button>
                {isVisible5 && (
                    <div>
                        <p>보유 적립금: {availablePoints}원</p>
                        <div>
                            <button onClick={handleUseAllPoints}>전액 사용</button>
                        </div>
                        <div>
                            <input
                                type="number"
                                value={inputPoints}
                                onChange={handleInputChange}
                                placeholder="적립금 입력"
                            />
                            <button onClick={handleApplyPoints}>적용</button>
                        </div>
                        <div>
                            <strong>적용된 적립금: {appliedPoints}원</strong>
                        </div>
                    </div>
                )}
            </div>

            {/* 결제 정보 */}
            <div>
                <button onClick={() => setIsVisible6(!isVisible6)} className="CheckoutPage_UpDownBtn">
                    <div>결제 정보</div>
                    <div>{finalPrice}원</div>
                </button>
                {isVisible6 && (
                    <div>
                        <p>상품 금액: {totalAmount}원</p>
                        <p>배송비: {shippingFee}원</p>
                        <p>포인트 사용: {appliedPoints}원</p>
                        <strong>최종 결제 금액: {finalPrice}원</strong>
                    </div>
                )}
            </div>

            {/* 결제 버튼 */}
            <div>
                <Link to="/MyPage/order">
                    <button>뒤로가기</button>
                </Link>
                <button onClick={handleOrderSubmit}>{finalPrice}원 결제하기</button>
            </div>
        </div>
    );
};

export default CartCheckoutPage;
