import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageBasket.css";

const MyPageBasket = () => {
  const [userBasket, setUserBasket] = useState(null);
  const [header, setHeader] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목
  const [selectedTotalPrice, setSelectedTotalPrice] = useState(0); // 선택된 상품의 총 금액
  const navigate = useNavigate(); // useNavigate 훅 사용


  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const getHeaders = async () => {
    const headers = { "Content-Type": "application/json" };

    if (accessToken && refreshToken) {
      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          headers["Authorization"] = newAccessToken;
          headers["Refresh-Token"] = refreshToken;
        } else {
          localStorage.clear();
          window.location.href = "/login";
          return null;
        }
      } catch (error) {
        console.error("Error handling tokens:", error);
        localStorage.clear();
        window.location.href = "/login";
        return null;
      }
    }

    return headers;
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/members/refresh-token", {
        method: "POST",
        headers: {
          "Refresh-Token": refreshToken
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        return data.newToken;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  const extractTargetId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('targetId');
  };

  const fetchCurrentUser = async () => {
    const headers = await getHeaders();
    if (!headers) return;

    try {
      const response = await fetch("http://localhost:8080/api/v1/carts", {
        method: "GET",
        headers: headers
      });

      if (response.status === 200) {
        const data = await response.json();
        setUserBasket(data);
        console.log("data", data);
      } else {
        setUserBasket(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserBasket(null);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      const headers = await getHeaders();
      if (!headers) return;

      setHeader(headers);
      await fetchCurrentUser();

      const targetId = extractTargetId();

      if (targetId) {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/items`, {
            method: "GET",
            headers: headers,
          });
          const basketdata = await response.json();
          setUserBasket((prev) => ({
            ...prev,
            ...basketdata,
          }));
          console.log("basketdata", basketdata);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    initializePage();
  }, []); // 빈 배열로 설정하여 컴포넌트가 처음 마운트될 때만 실행

  //수량

  useEffect(() => {
    if (userBasket) {
      const initialQuantities = userBasket.reduce((acc, item) => {
        acc[item.cartId] = item.count;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }

  }, [userBasket]);

  const updateQuantity = async (cartId, newCount) => {
    if (newCount < 1) {
      alert("최소 수량은 1개입니다.");
      return;
    }

    const headers = await getHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/carts/${cartId}?count=${newCount}`, {
        method: "PUT",
        headers: headers,
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: JSON.stringify({ count: newCount }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const message = await response.text();
      alert(message);

      // 상태 업데이트
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [cartId]: newCount,
      }));
    } catch (error) {
      console.error(error);
      alert("수량 업데이트에 실패했습니다.");
    }
  };

  // 체크박스 클릭 시 선택된 항목 업데이트
  const handleCheckboxChange = (cartId, price) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(cartId)) {
        // 항목이 이미 선택되었으면 제거
        setSelectedTotalPrice(prevPrice => prevPrice - price);
        return prevSelectedItems.filter((id) => id !== cartId);
      } else {
        // 항목이 선택되지 않았으면 추가
        setSelectedTotalPrice(prevPrice => prevPrice + price);
        return [...prevSelectedItems, cartId];
      }
    });
  };

  // 상품 삭제 처리
  const handleDelete = async (cartId) => {
    const headers = await getHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/carts?cartIds=${cartId}`, {
        method: "DELETE",
        headers: headers,
      });

      if (response.ok) {
        const updatedBasket = userBasket.filter(item => item.cartId !== cartId);
        setUserBasket(updatedBasket);
        alert("상품이 삭제되었습니다.");
        window.location.reload(); // 페이지 새로 고침
      } else {
        alert("상품 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("상품 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSingleItemOrder = (cartId) => {
    const selectedProduct = userBasket.find((item) => item.cartId === cartId);

    if (!selectedProduct) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }

    // 선택된 상품만 포함한 orderData 생성
    const orderData = {
      totalAmount: selectedProduct.price * (quantities[cartId] || selectedProduct.count), // 개별 상품 총 금액
      shippingFee: 5000, // 단일 상품의 배송비
      items: [
        {
          itemId: selectedProduct.itemId,
          imgUrl: selectedProduct.repImgUrl,
          itemName: selectedProduct.name,
          manufacturer: selectedProduct.manufacturer,
          seller: selectedProduct.seller,
          itemSizeId: selectedProduct.itemSizeId,
          size: selectedProduct.size,
          quantity: quantities[cartId] || selectedProduct.count,
          price: selectedProduct.price,
        },
      ],
    };

    console.log("Single item orderData:", orderData); // 디버깅용
    navigate("/CartCheckoutPage", { state: orderData }); // 바로 구매용 CheckoutPage로 이동
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      alert("결제할 상품을 선택하세요.");
      return;
    }

    const selectedProducts = userBasket.filter((item) =>
      selectedItems.includes(item.cartId)
    );

    const totalAmount = selectedProducts.reduce(
      (acc, item) =>
        acc +
        item.price * (quantities[item.cartId] || item.count),
      0
    );

    const orderData = {
      totalAmount: totalAmount,
      shippingFee: 5000,
      items: selectedProducts.map((item) => ({
        itemId: item.itemId, // 상품 ID
        imgUrl: item.repImgUrl, // 상품 이미지
        itemName: item.name, // 상품명
        manufacturer: item.manufacturer, // 제조사
        seller: item.seller, // 판매처
        itemSizeId: item.itemSizeId, // 사이즈 ID
        size: item.size, // 사이즈 이름
        quantity: quantities[item.cartId] || item.count, // 수량
        price: item.price, // 단가
      })),
    };

    console.log("Navigating to CheckoutPage with orderData:", orderData); // 디버깅용
    navigate("/CartCheckoutPage", { state: orderData });
  };




  // 데이터가 로드된 후 렌더링
  if (!userBasket) return <div>Loading...</div>;



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
              <div className="basketitem">


                <div className="basketContainer">
                  {userBasket.length === 0 ? (
                    <p className="none">장바구니 내역이 없습니다.</p>
                  ) : (
                    // 장바구니 아이템을 표시하는 코드
                    userBasket.map((userBasket, index) => (
                      <div className="prdBox" key={userBasket.cartId}>
                        <input
                          type="checkbox"
                          className="check"
                          onChange={() => handleCheckboxChange(userBasket.cartId, userBasket.currentPrice)}
                        />
                        &nbsp;
                        <div className="thumbnail">
                          <a href="">
                            <img
                              src={userBasket.repImgUrl.replace(
                                "C:\\kostafinalfrontend\\frontend-jhs\\public\\",
                                "/"
                              )}
                              alt={userBasket.name}
                              width={140}
                              height={140}
                            />
                          </a>
                        </div>
                        <div className="description">
                          <span className="itemid">{userBasket.cartId}</span>
                          <strong className="itemname" title="상품명">
                            {userBasket.name}
                          </strong>
                          <ul className="price">
                            <li>
                              <strong>{userBasket.price}</strong>원
                            </li>
                          </ul>
                          <ul className="info">
                            <li>
                              적립금 :<span className="mileage">{Math.floor(userBasket.price * 0.01)}원</span>
                            </li>
                          </ul>
                          <ul className="optional">
                            <li>{userBasket.itemSizeId}</li>
                          </ul>
                        </div>
                        <div className="sumprice">
                          <strong>
                            {userBasket.price * (quantities[userBasket.cartId] || userBasket.count)}
                          </strong>원
                        </div>
                        <a href="#" onClick={() => handleDelete(userBasket.cartId)}>
                          <img src="/img/x-lg.svg" alt="삭제" />
                        </a>
                        <div className="quentity">
                          <span className="qtyBtnTotal">
                            <button
                              className="up"
                              onClick={async () => {
                                const newCount = quantities[userBasket.cartId] + 1;
                                await updateQuantity(userBasket.cartId, newCount);
                              }}
                            >
                              +
                            </button>
                            <input
                              id={`quentity_id_${index}`}
                              name={`quentity_name_${index}`}
                              size={2}
                              value={quantities[userBasket.cartId] !== undefined ? quantities[userBasket.cartId] : 0}
                              type="text"
                              readOnly
                            />
                            <button
                              className="down"
                              onClick={async () => {
                                const newCount = quantities[userBasket.cartId] - 1;
                                if (newCount > 0) {
                                  await updateQuantity(userBasket.cartId, newCount);
                                }
                              }}
                            >
                              -
                            </button>
                          </span>
                        </div>
                        
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
            <div className="basket2">
              <div className="totalSummary">
                <h3 className="totalSummaryTitle">주문상품</h3>
                <div className="Price">
                  <h4>선택 상품금액</h4>
                  <span>
                    <strong>{selectedTotalPrice}</strong>원
                  </span>
                </div>
                <div className="Price">
                  <h4>택배비</h4>
                  <span>
                    <strong>{selectedTotalPrice === 0 ? 0 : 5000}</strong>원
                  </span>
                </div>
                <div className="totalPrice">
                  <h4>총 가격</h4>
                  <span>
                    <strong>    {selectedTotalPrice === 0 ? 0 : Math.floor(selectedTotalPrice + 5000)}</strong>원
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="submitBtn"
                onClick={() => handleProceedToCheckout()}
              >
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