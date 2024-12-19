
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageBasket.css";

const MyPageBasket = () => {

  const [basketItems, setBasketItems] = useState([
    {
      id: 1,
      imageUrl: "https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202404/35b52732a4971e965f2ce448033d881a.jpg", // 상품 이미지 URL 예시
      manufacturer: "제조사",
      itemName: "레알마드리드",
      price: 150000,
      deliveryPrice: 3000,
      mileage: 300,
      options: ["size : XL"],
      quantity: 1,
    }, {
      id: 2,
      imageUrl: "https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202404/35b52732a4971e965f2ce448033d881a.jpg", // 상품 이미지 URL 예시
      manufacturer: "제조사",
      itemName: "레알마드리드",
      price: 150000,
      deliveryPrice: 3000,
      mileage: 300,
      options: ["size : XL"],
      quantity: 1,
    }, {
      id: 3,
      imageUrl: "https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202404/35b52732a4971e965f2ce448033d881a.jpg", // 상품 이미지 URL 예시
      manufacturer: "제조사",
      itemName: "레알마드리드",
      price: 150000,
      deliveryPrice: 3000,
      mileage: 300,
      options: ["size : XL"],
      quantity: 1,
    }
  ]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // CheckoutPage로 이동하기 위해 사용


  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    const fetchBasketItems = async () => {
      try {
        const response = await fetch("/api/basket"); // 백엔드 엔드포인트
        if (!response.ok) {
          throw new Error("데이터를 불러오는 데 실패했습니다.");
        }
        const data = await response.json();
        setBasketItems(data); // 받아온 데이터를 state에 저장
      } catch (error) {
        console.error("Error fetching basket items:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchBasketItems();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  // 수량 업데이트 함수
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity >= 1) {
      try {
        const response = await fetch(`/api/basket/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        });

        if (!response.ok) {
          throw new Error("수량 업데이트에 실패했습니다.");
        }

        // 업데이트된 데이터를 가져와 state에 반영
        const updatedItem = await response.json();
        setBasketItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: updatedItem.quantity } : item
          )
        );
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };



  // 장바구니 항목 삭제 함수
  const handleRemoveItem = async (id) => {
    try {
      const response = await fetch(`/api/basket/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("장바구니 항목 삭제에 실패했습니다.");
      }

      // 로컬 상태에서 해당 항목 제거
      setBasketItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  // 총 가격 계산
  const calculateTotalPrice = () => {
    return basketItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // 총 배송비는 1회만 적용
  const totalDeliveryPrice = basketItems.length > 0 ? basketItems[0].deliveryPrice : 0;

  // 총 적립금 계산
  const calculateTotalMileage = () => {
    return basketItems.reduce(
      (total, item) => total + item.mileage * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    // 선택된 항목만 필터링 (체크박스 상태 필요)
    const selectedItems = basketItems.filter((item) => item.isSelected);

    // CheckoutPage로 데이터 전달하며 이동
    navigate("/checkoutPage", { state: { items: selectedItems } });
  };

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
              <a href="/StyleprofileMyInterestProduct">
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

              {basketItems.length > 0 ? (
                basketItems.map((item) => (
                  <div key={item.id} className="basketitem">
                    <div className="prdBox">
                      <div className="prdBox_Size">
                        <input type="checkbox" className="check" />
                        &nbsp;
                        <div className="thumbnail">
                          <a href="">
                            <img
                              src={item.imageUrl}
                              alt={item.itemName}

                            />
                          </a>
                        </div>
                      </div>


                      <div className="description">
                        <strong className="manufacturer" title="제조사">
                          {item.manufacturer}
                        </strong>
                        <strong className="itemname" title="상품명">
                          {item.itemName}
                        </strong>
                        <div className="price">
                          <strong>{item.price}</strong>원
                        </div>
                        <ul className="info">
                          <li>
                            배송비 :<span className="delivery">{item.deliveryPrice}</span>원
                          </li>
                          <li>
                            적립금 :<span className="mileage">{calculateTotalMileage()}</span>원
                          </li>

                          {item.options.map((option, index) => (
                            <li key={index}>{option}</li>
                          ))}
                        </ul>
                        <ul className="optional">

                        </ul>

                        <div className="quentity">
                          <div className="qtyBtnTotal">
                            <button
                              className="up"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                            <input
                              id={`quantity_${item.id}`}
                              name={`quantity_${item.id}`}
                              size={2}
                              value={item.quantity}
                              type="text"
                              readOnly
                            />
                            <button
                              className="down"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                          </div>
                          <button type="button">변경</button>
                        </div>
                      </div>

                      <div className="sumprice">
                        <strong>{item.price * item.quantity}원</strong>
                        <div className="buttonGroup">
                          <a href="#none" className="btnSubmit sizeS">
                            주문하기
                          </a>
                        </div>

                      </div>

                      <a href="#" onClick={() => handleRemoveItem(item.id)} className="ReMoveItem">
                        <img src="/img/x-lg.svg" alt="삭제" />
                      </a>

                    </div>
                  </div>
                ))
              ) : (
                <p className="none">장바구니 내역이 없습니다.</p>
              )}
            </div>


            <div className="basket2">
              <div className="totalSummary">
                <h3 className="totalSummaryTitle">주문상품</h3>
                <div className="Price">
                  <h4>총 상품금액</h4>
                  <span>
                    <strong>{calculateTotalPrice()}</strong>원
                  </span>
                </div>
                <div className="Price">
                  <h4>총 배송비</h4>
                  <span>
                    <strong>{totalDeliveryPrice}</strong>원
                  </span>
                </div>
                <div className="totalPrice">
                  <h4>총 결제금액</h4>
                  <span>
                    <strong>
                      {calculateTotalPrice() + totalDeliveryPrice}
                    </strong>
                    원
                  </span>
                </div>
              </div>
              <button type="button" className="submitBtn" onClick={handleCheckout}>
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