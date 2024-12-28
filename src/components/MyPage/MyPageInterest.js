
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./MyPageInterest.css";

const MyPageInterest = () => {
  const [userWishlist, setUserWishlist] = useState(null);
  const [header, setHeader] = useState(null);

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // headers를 가져오는 함수
  const getHeaders = async () => {
    const headers = { "Content-Type": "application/json" };

    if (accessToken && refreshToken) {
      try {
        // refreshToken으로 accessToken 갱신 시도
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          headers["Authorization"] = newAccessToken;
          headers["Refresh-Token"] = refreshToken;
        } else {
          // 갱신 실패 시 로그아웃 처리
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

  // 사용자 정보를 가져오는 함수
  const fetchCurrentUser = async () => {
    const headers = await getHeaders();
    if (!headers) return;

    try {
      const response = await fetch("http://localhost:8080/api/v1/wish-lists", {
        method: "GET",
        headers: headers
      });

      if (response.status === 200) {
        const data = await response.json();
        setUserWishlist(data);
        console.log("data", data)
      } else {
        setUserWishlist(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserWishlist(null);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      const headers = await getHeaders();
      if (!headers) return;

      setHeader(headers);

      // 현재 사용자 정보 가져오기
      await fetchCurrentUser();

      const targetId = extractTargetId();

      // 특정 targetId에 대한 데이터 가져오기
      function extractTargetId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('targetId');
      }

      if (targetId) {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/members/profile/${targetId}`, {
            method: "GET",
            headers: headers,
          });
          const mypagedata = await response.json();
          setUserWishlist((prev) => ({
            ...prev,
            ...mypagedata,
          }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    initializePage();
  }, []);

  // 상품 삭제 처리
  const handleDelete = async (wishListItemId) => {
    const headers = await getHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/wish-lists/${wishListItemId}`, {
        method: "DELETE",
        headers: headers,
      });

      if (response.ok) {
        const updatedWishlist = userWishlist.filter(item => item.wishListItemId !== wishListItemId);
        setUserWishlist(updatedWishlist);
        alert("상품이 삭제되었습니다.");
      } else {
        alert("상품 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("상품 삭제 중 오류가 발생했습니다.");
    }
  };



  // 데이터가 로드된 후 렌더링
  if (!userWishlist) return <div>Loading...</div>;


  return (
    <div className="MyPageInterestcontainer">
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
          <div className="contentwraptitle"> 관심상품</div>
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



                <div className="interestContainer">
                  {userWishlist.length === 0 ? (
                    <p className="none">관심상품 내역이 없습니다.</p>
                  ) : (
                    // 관심상품 아이템을 표시하는 코드
                    userWishlist.map((item) => (
                      <div className="prdBox" key={item.wishListItemId}>
                        <input type="checkbox" className="check" />
                        &nbsp;
                        <div className="thumbnail">
                          <a href="">
                            {/* 이미지 경로 수정 */}
                            <img
                              src={`/uploads/${item.itemRepImageUrl.replace(
                                "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                                ""
                              )}`}
                              alt={item.itemName}
                              width={100}
                              height={100}
                              style={{marginTop: "10px"}}
                            />
                          </a>
                        </div>
                        <div className="description">
                          <strong className="manufacturer" title="제조사">
                            {`[${item.manufacturer}] `}
                          </strong>
                          <strong className="itemname" title="상품명">
                            {item.itemName}
                          </strong>
                          <ul className="price">
                            <li>
                              <strong>{item.itemPrice}</strong>원
                            </li>
                          </ul>
                          <ul className="info">
                            <li>
                              <span>{item.itemSeller}</span>
                            </li>
                            <li>
                              배송 : <span className="delivery">5000원</span>
                            </li>
                            <li>
                              적립금 : <span className="mileage">{item.points}원</span>
                            </li>
                          </ul>
                        </div>
                        <div className="sumprice">
                          <strong>{item.itemPrice}</strong>원
                        </div>
                        <div className="buttonGroup">
                          <a href="#none" onClick={() => handleDelete(item.wishListItemId)}>
                            <img src="/img/x-lg.svg" alt="삭제" />
                          </a>
                          <div className="orderBtn">
                            <a href={`/DetailPage?itemId=${item.itemId}`} className="btnSubmit sizeS">
                              상세보기
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>



              </div>
              {/* <div className="deleteBtn">
                <button type="button" className="selectDeleteBtn">
                  선택삭제
                </button>
                <button type="button" className="allDeleteBtn">
                  전체삭제
                </button>
              </div> */}
            </div>
          </div>
        </section>
      </div>
    </div>

  );
};

export default MyPageInterest;