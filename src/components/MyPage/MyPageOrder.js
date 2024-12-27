import React, { useState, useEffect, useRef, useCallback } from "react";
import "./MyPageOrder.css";

const MyPageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

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

  const renderButtons = (status) => {
    if (status === "PAID") {
      return (
        <a href="#none" className="orderBtn sizeS">
          결제 취소
        </a>
      );
    }
    if (status === "ORDERED") {
      return (
        <a href="#none" className="orderBtn sizeS">
          결제하기
        </a>
      );
    }
    return null;
  };

  return (
    <div className="MyPageOrdercontainer">
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
          <div className="contentwraptitle">주문조회</div>
          <form method="get" id="OrderHistoryForm" name="OrderHistoryForm">
            <div className="history">
              <fieldset>
                <legend>검색기간설정</legend>
                <div className="stateSelect">
                  <select name="orderstatus" id="orderstatus" className="fSelect">
                    <option className="OrderOption" value="all">
                      전체 주문상태
                    </option>
                    <option className="OrderOption" value="shippedbefore">
                      입금전
                    </option>
                    <option className="OrderOption" value="shippedstandby">
                      배송준비중
                    </option>
                    <option className="OrderOption" value="shippedbegin">
                      배송중
                    </option>
                    <option className="OrderOption" value="shipcomplate">
                      배송완료
                    </option>
                    <option className="OrderOption" value="ordercancel">
                      취소
                    </option>
                    <option className="OrderOption" value="orderexchange">
                      교환
                    </option>
                    <option className="OrderOption" value="orderreturn">
                      반품
                    </option>
                  </select>
                </div>
                <span className="period">
                  <a href="" className="btnNormalSizeMselected" days={0}>
                    오늘
                  </a>
                  <a href="" className="btnNormalSizeM" days={30}>
                    1개월
                  </a>
                  <a href="" className="btnNormalSizeM" days={90}>
                    3개월
                  </a>
                  <a href="" className="btnNormalSizeM" days={180}>
                    6개월
                  </a>
                </span>
                <div className="date">
                  <span className="datepicker">
                    <input
                      type="text"
                      id="hisrotyStartDate"
                      name="hisrotyStartDate"
                      className="TextDatepicker"
                      readOnly="readonly"
                      size={10}
                      defaultValue="2024-08-28"
                    />
                    <button type="button" className="datepickertrigger">
                      <img src="/img/ico_calendar.png" alt="date" width="20px" />
                    </button>
                    ~
                    <input
                      type="text"
                      id="hisrotyEndDate"
                      name="hisrotyEndDate"
                      className="TextDatepicker"
                      readOnly="readonly"
                      size={10}
                      defaultValue="2024-11-26"
                    />
                    <button type="button" className="datepickertrigger">
                      <img src="/img/ico_calendar.png" alt="date" width="20px" />
                    </button>
                  </span>
                  <span className="btnSubmitSizeMeDataSet">
                    조회
                    <input type="image" id="order_search_btn" alt="조회" />
                  </span>
                </div>
              </fieldset>
            </div>
            <ul className="help">
              <li>
                기본적으로 최근 3개월간의 자료가 조회되며, 기간 검색시 주문처리완료
                후 36개월 이내의 주문내역을 조회하실 수 있습니다.
              </li>
              <li>취소/교환/반품 신청은 배송완료일 기준 7일까지 가능합니다.</li>
            </ul>
          </form>
          {orders.map((order, index) => (
            <div className="inquire" key={index}>
              <div className="inquireCard">
                <div className="status">
                  <span>{order.orderStatus || "상태 없음"}</span>
                </div>
                <div className="prdBox">
                  {order.orderItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="itemCard">
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
                  <strong>배송비: 5000원</strong>
                  <strong>
                    총 주문 금액: {(order.orderPrice + 5000).toLocaleString()}원
                  </strong>
                  <div className="buttonGroup">{renderButtons(order.orderStatus)}</div>
                </div>
              </div>
            </div>
          ))}
          <div ref={loader} className="loader">
            {hasMore ? "Loading..." : "더 이상 내역이 없습니다."}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyPageOrder;
