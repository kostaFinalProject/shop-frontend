import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPageOrder.css";
import MyPageNavigation from "./MyPageNavigation";

const MyPageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    if (!hasMore) return;

    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      const response = await fetch(`http://localhost:8080/api/v1/orders?page=${page}&size=20`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
          "Refresh-Token": refreshToken,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // 이미지 경로 포맷팅 처리
        const formattedContent = data.content.map((order) => ({
          ...order,
          orderItems: order.orderItems.map((item) => ({
            ...item,
            itemRepImgUrl: item.itemRepImgUrl.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", ""),
          })),
        }));

        if (formattedContent.length === 0) {
          setHasMore(false);
        } else {
          setOrders((prevOrders) => [...prevOrders, ...formattedContent]);
          setPage((prevPage) => prevPage + 1);
        }
      } else {
        console.error("Failed to fetch orders:", response.status);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [page, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchOrders();
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [fetchOrders]);

  const handlePayment = (order) => {
    const orderData = {
      totalAmount: order.orderItems.reduce((acc, item) => acc + item.itemPrice * item.quantity, 0),
      shippingFee: 5000, // 배송비 (고정값으로 가정)
      items: order.orderItems.map((item) => ({
        itemId: item.itemId,
        imgUrl: item.itemRepImgUrl.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", ""),
        itemName: item.itemName,
        manufacturer: item.itemManufacturer,
        seller: item.itemSeller || "정보 없음",
        itemSizeId: item.itemSizeId,
        size: item.itemSize,
        quantity: item.quantity,
        price: item.itemPrice,
      })),
    };

    navigate("/CheckoutPage", { state: orderData });
  };

  const handleCancelPayment = async (paymentsId) => {
    try {
      const accesstoken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accesstoken || !refreshToken) {
        alert("로그인이 필요한 기능입니다.");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/v1/payments/${paymentsId}`, {
        method: "DELETE",
        headers: {
          Authorization: accesstoken,
          "Refresh-Token": refreshToken,
        },
      });

      if (response.ok) {
        alert("결제가 취소되었습니다.");
        // 추가로 리스트 갱신 로직을 추가
        window.location.reload(); // 간단한 새로고침으로 갱신
      } else {
        alert("결제 취소에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("결제 취소 오류:", error);
      alert("결제 취소 중 오류가 발생했습니다.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const accesstoken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accesstoken || !refreshToken) {
        alert("로그인이 필요한 기능입니다.");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: accesstoken,
          "Refresh-Token": refreshToken,
        },
      });

      if (response.ok) {
        alert("주문이 취소되었습니다.");
        // 추가로 리스트 갱신 로직을 추가
        window.location.reload(); // 간단한 새로고침으로 갱신
      } else {
        alert("주문 취소에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("주문 취소 오류:", error);
      alert("주문 취소 중 오류가 발생했습니다.");
    }
  };

  const renderButtons = (status, orderTime, order) => {
    const isPaymentCancelable = (orderTime) => {
      const currentTime = new Date();
      const orderTimeDate = new Date(orderTime);
      const timeDifference = currentTime - orderTimeDate;
      const sevenDaysInMillis = 1 * 24 * 60 * 60 * 1000;
      return timeDifference <= sevenDaysInMillis;
    };
  
    const buttons = [];
  
    // 결제 취소 버튼을 표시할 조건
    if (status === "PAID" && isPaymentCancelable(orderTime) && order.orderItems.every(item => item.itemStatus === "ACTIVE" || item.itemStatus === "SOLD_OUT")) {
      buttons.push(
        <button
          className="orderBtn sizeS"
          onClick={() => handleCancelPayment(order.paymentsId)}
          key="cancelPayment"
        >
          결제 취소
        </button>
      );
    }
  
    // 주문 취소 버튼을 표시할 조건
    if (status === "ORDERED" && order.orderItems.some(item => item.itemStatus === "ACTIVE" || item.itemStatus === "SOLD_OUT")) {
      buttons.push(
        <button
          className="orderBtn sizeS"
          onClick={() => handleCancelOrder(order.orderId)}
          key="cancelOrder"
        >
          주문 취소
        </button>
      );
    }
  
    // 결제하기 버튼을 표시할 조건
    if (status === "ORDERED" && order.orderItems.every(item => item.itemStatus === "ACTIVE")) {
      buttons.push(
        <button
          className="orderBtn sizeS"
          onClick={() => handlePayment(order)}
          key="payOrder"
        >
          결제하기
        </button>
      );
    }
  
    // 두 개 이상의 버튼을 모두 반환하도록 배열로 반환
    return buttons.length > 0 ? buttons : null;
  };

  const formatOrderTime = (orderTime) => {
    const date = new Date(orderTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 1을 더함
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}. ${month}. ${day}. ${hours}:${minutes}`;
  };


  return (
    <div className="MyPageOrdercontainer">
      <div id="content" className="-frame">
        <MyPageNavigation />
        <section className="contentwrap">
          <div className="contentwraptitle">주문조회</div>
          {orders.map((order, index) => (
            <div className="inquire" key={index}>
              <div className="inquireCard">
                <div className="status">
                  {/* <span>{order.orderStatus || "상태 없음"}</span> */}
                  <span>{formatOrderTime(order.orderTime)}</span>
                </div>
                <div className="prdBox">
                  {order.orderItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="itemCard" style={{ display: "flex", marginBottom: "20px"}}>
                      <div className="thumbnail">
                        <a href="">
                          <img
                            src={`/uploads/${item.itemRepImgUrl}`}
                            alt={item.itemName || "상품 이미지"}
                            width={140}
                            height={140}
                          />
                        </a>
                      </div>
                      <div className="description">
                        <strong className="manufacturer" title="상품명">
                          {`[${item.itemManufacturer}]`} {item.itemName || "상품명 없음"}
                        </strong>
                        <ul className="info">
                          <li>사이즈: {item.itemSize || "정보 없음"}</li>
                          <li>수량: {item.quantity}개</li>
                          <li>가격: {item.itemPrice.toLocaleString()}원</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="orderSummary">
                  <strong>
                    결제 상태: {
                      order.orderStatus === "ORDERED" ? "결제 미완료" :
                        order.orderStatus === "CANCELED" ? "주문 취소" :
                          order.orderStatus === "PAID" ? "결제 완료" :
                            "상태 불명"
                    }
                  </strong>
                  <strong>배송비: 5000원</strong>
                  <strong>
                    총 주문 금액: {(order.orderPrice + 5000).toLocaleString()}원
                  </strong>
                  <div className="buttonGroup">{renderButtons(order.orderStatus, order.orderTime, order)}</div>
                </div>
              </div>
            </div>
          ))}
          {/* <div ref={loader} className="loader">
            {hasMore ? "Loading..." : "더 이상 내역이 없습니다."}
          </div> */}
        </section>
      </div>
    </div>
  );
};

export default MyPageOrder;