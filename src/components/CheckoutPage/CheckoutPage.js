import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CheckoutPageAddress from "./CheckoutPageAddress";
import "./CheckoutPage.css";

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state: orderData } = location || {};
    const {
        itemId,
        imgUrl,
        itemName,
        manufacturer,
        seller,
        totalAmount,
        items,
        shippingFee,
    } = orderData || {};

    // 회원 정보 저장 상태
    const [memberInfo, setMemberInfo] = useState(null);

    // 적립금 입력값 및 적용 상태
    const [inputPoints, setInputPoints] = useState(0);
    const [appliedPoints, setAppliedPoints] = useState(0);

    // 섹션별 토글 상태
    const [isVisible1, setIsVisible1] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);
    const [isVisible5, setIsVisible5] = useState(false);
    const [isVisible6, setIsVisible6] = useState(false);

    // 보유 적립금 (회원 정보에서 가져옴)
    const availablePoints = memberInfo?.point || 0;

    // 할인 및 최종 결제 금액 계산
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

    // 배송지 정보 상태
    const [selectedAddress, setSelectedAddress] = useState(null);

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

    // 직접 입력 처리
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

    const handleOrderSubmit = async () => {
        const orderItems = items.map(item => ({
            itemSizeId: item.itemSizeId,
            count: item.quantity,
        }));

        const orderRequest = {
            orderItems: orderItems,
        };

        // 주소가 비어있을 경우 alert 띄우고 return
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
            const response = await fetch('http://localhost:8080/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accesstoken,
                    'Refresh-Token': refreshToken
                },
                body: JSON.stringify(orderRequest)
            });

            if (!response.ok) throw new Error('Failed to create order');

            alert("결제창으로 넘어갑니다.");

            const { orderId, amount } = await response.json();

            const IMP = window.IMP;
            IMP.init('imp81860065');

            IMP.request_pay(
                {
                    pg: "html5_inicis", // PG사 선택 (KG이니시스)
                    pay_method: "card", // 결제 수단
                    merchant_uid: `order_${orderId}`, // 주문 고유번호
                    name: items.map(item => {
                        return `[${manufacturer}] ${itemName} (${item.size})`;
                    }).join(", "), // 상품명 (여러 개일 경우 조합)
                    amount: amount, // 결제 금액
                    buyer_email: memberInfo.email, // 실제 사용자 이메일
                    buyer_name: memberInfo.name, // 실제 사용자 이름
                    buyer_tel: memberInfo.phone, // 실제 사용자 전화번호
                    buyer_addr: selectedAddress.roadAddress + " " + selectedAddress.detailAddress, // 실제 사용자 주소
                    buyer_postcode: selectedAddress.postCode // 실제 사용자 우편번호
                },
                async (response) => {
                    if (response.success) {
                        // 결제 성공 시 서버로 결제 정보 전달
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
                        navigate(`/detailPage?itemId=${itemId}`); // 결제 완료 페이지로 이동
                    } else {
                        // 결제 실패 처리
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
            {/* 헤더 */}
            <div className="CheckoutPage_header">
                <div className="CheckoutPage_header_02">
                    <div className="CheckoutPage_Title">주문/결제</div>
                </div>
            </div>

            {/* 경계선 */}
            <div className="CheckoutPage_BoundaryLine"></div>

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

            {/* 경계선 */}
            <div className="CheckoutPage_BoundaryLine"></div>

            {/* 배송지 선택 섹션 */}
            <div>
                <button onClick={() => setIsVisible2(!isVisible2)} className="CheckoutPage_UpDownBtn">
                    <div>배송지</div>
                    {isVisible2 ? "▲" : "▼"}
                </button>
                {isVisible2 && (
                    <CheckoutPageAddress
                        onAddressChange={(address) => setSelectedAddress(address)} // 선택된 주소를 받아오는 핸들러
                    />
                )}
            </div>

            {/* 경계선 */}
            <div className="CheckoutPage_BoundaryLine"></div>

            {/* 주문 상품 */}
            <div>
                <button onClick={() => setIsVisible3(!isVisible3)} className="CheckoutPage_UpDownBtn">
                    <div>주문상품</div>
                    <div>{items.length} 아이템</div>
                    {isVisible3 ? "▲" : "▼"}
                </button>
                {isVisible3 && (
                    <div>
                        {/* 상품 이미지 */}
                        <div className="CheckoutPage_ItemImageWrapper">
                            <img
                                src={`/uploads/${imgUrl}`}
                                alt={itemName}
                                className="CheckoutPage_ItemImage"
                            />
                        </div>
                        {/* 상품 목록 */}
                        {items.map((item) => (
                            <div key={item.itemSizeId} className="CheckoutPage_ItemBox">
                                <p>상품명: {`[${manufacturer}]`} {itemName}</p>
                                <p>판매처: {seller} </p>
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

            {/* 경계선 */}
            <div className="CheckoutPage_BoundaryLine"></div>

            {/* 보유 적립금 */}
            <div>
                <button onClick={() => setIsVisible5(!isVisible5)} className="CheckoutPage_UpDownBtn">
                    <div>보유적립금</div>
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

            {/* 경계선 */}
            <div className="CheckoutPage_BoundaryLine"></div>

            {/* 결제 정보 */}
            <div>
                <button onClick={() => setIsVisible6(!isVisible6)} className="CheckoutPage_UpDownBtn">
                    <div>결제정보</div>
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
                <Link to="/StyleMain">
                    <button>뒤로가기</button>
                </Link>
                <button onClick={handleOrderSubmit}>{finalPrice}원 결제하기</button>
            </div>
        </div>
    );
};

export default CheckoutPage;