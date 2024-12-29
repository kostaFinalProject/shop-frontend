import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, data } from "react-router-dom";
import "./MyPageIntro.css";
import MyPageNavigation from "./MyPageNavigation";

const MyPageIntro = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [header, setHeader] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
      const response = await fetch("http://localhost:8080/api/v1/members", {
        method: "GET",
        headers: headers
      });

      if (response.status === 200) {
        const data = await response.json();
        setCurrentUser(data);

        localStorage.setItem("currentUser", JSON.stringify(data));
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setCurrentUser(null);
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
          setCurrentUser((prev) => ({
            ...prev,
            ...mypagedata, // 기존 currentUser에 mypagedata 병합
          }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    initializePage();
  }, []);

  // 데이터가 로드된 후 렌더링
  if (!currentUser) return <div>Loading...</div>;

  const profileImageUrl = currentUser.memberProfileImageUrl
    ? currentUser.memberProfileImageUrl.replace(
      "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
      ""
    )
    : null;

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  console.log("currentUser", currentUser);


  return (
    <div className="MyPageIntrocontainer">
      <div id="content" className="-frame">
        <MyPageNavigation />
        <section className="contentwrap">
          <article>
            <div className="profile">
              <div className="profile_img">
                <img src={profileImageUrl ? `/uploads/${profileImageUrl}` : 'https://fakeimg.pl/150x150/'} alt="Profile" />
              </div>

              <div className="profile_text">
                <div className="profile_head">
                  <span className="profile_name" id="name">
                    {currentUser.name}
                  </span>
                </div>

                <div className="profile_information">
                  <p>{currentUser.nickname}</p>
                  <p>{currentUser.introduction}</p>
                </div>
              </div>

              <div className="profile-button">
                <a href="/Mypage/stylemodify">
                  <div>
                    프로필 관리
                  </div>
                </a>
                <a href={`Styleprofile?memberId=${currentUser.memberId}`}>
                  <div>
                    내 스타일
                  </div>
                </a>
              </div>
            </div>
          </article>
          <article className="myinfobox">
            <div>
              <p>
                <b className="mambername">{currentUser.name}&nbsp;</b>
                님은&nbsp;
                <span
                  className="membergrade"
                  style={{
                    fontWeight: "bold",
                    color:
                      currentUser.pointGrade === "BRONZE"
                        ? "#CD7F32" // 동색
                        : currentUser.pointGrade === "SILVER"
                          ? "#C0C0C0" // 은색
                          : currentUser.pointGrade === "GOLD"
                            ? "#FFD700" // 금색
                            : "#000", // 기본값: 검정색
                  }}
                >
                  {currentUser.pointGrade}&nbsp;
                </span>
                등급입니다.
              </p>
            </div>
            <div>
              <ul className="bankbook">
                <li>
                  <a href="">
                    <span className="tit">총주문: </span>
                    <span className="orderprice">{currentUser.payment}&nbsp;원</span>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="tit">포인트: </span>
                    <span className="mileage">{currentUser.point}&nbsp;원</span>
                  </a>
                </li>
              </ul>
            </div>
          </article>
          <article>
            <div className="title">
              UNI LABEL 등급 산정 기준
            </div>
            <div className="listwrap" style={{ display: "flex" }}>
              <div className="notice">
                <h3 style={{ marginBottom: "10px", fontWeight: "bold", fontSize: "16px", color: "#555" }}>
                  📌 포인트 적립 및 차감 안내
                </h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>상품 구입, 게시글 작성, 댓글 작성 시 포인트가 적립됩니다.</li>
                  <li>상품 구매 시 상품 가격의 <strong style={{ color: "#007BFF" }}>1%</strong>가 포인트로 적립됩니다.</li>
                  <li><strong style={{ color: "#DC3545" }}>단,</strong> 포인트를 사용해 상품 구매 시 포인트가 적립되지 않습니다.</li>
                  <li>게시글 작성 시 <strong style={{ color: "#28A745" }}>100P</strong>가 적립됩니다.</li>
                  <li>
                    <strong style={{ color: "#DC3545" }}>단,</strong> 게시글 삭제 시 <strong>100P</strong>, 운영 정책 위반 시
                    <strong>1000P</strong>가 차감됩니다.
                  </li>
                  <li>댓글 작성 시 <strong style={{ color: "#28A745" }}>50P</strong>가 적립됩니다.</li>
                  <li>
                    <strong style={{ color: "#DC3545" }}>단,</strong> 댓글 삭제 시 <strong>50P</strong>, 운영 정책 위반 시
                    <strong>500P</strong>가 차감됩니다.
                  </li>
                  <li>그 외, 각종 이벤트로 포인트 적립이 가능합니다.</li>
                </ul>
              </div>
              <div className="ec-base-table typelist" style={{ marginTop: "50px" }}>
                <table
                  border={0}
                  summary=""
                  style={{
                    width: "680px",
                    maxWidth: "100%",
                    margin: "0 auto",
                    borderCollapse: "collapse",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    overflow: "hidden"
                  }}
                >
                  <colgroup>
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "80%" }} />
                  </colgroup>
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                    >
                      <th scope="col" style={{ padding: "10px", color: "black" }}>등급</th>
                      <th scope="col" style={{ padding: "10px", color: "black" }}>포인트</th>
                    </tr>
                  </thead>
                  <tbody className="data" style={{ textAlign: "center" }}>
                    <tr
                      style={{
                        borderBottom: "1px solid #e0e0e0",
                        backgroundColor: "#f9f9f9"
                      }}
                    >
                      <td style={{ padding: "10px", fontWeight: "bold", color: "#CD7F32" }}>BRONZE</td>
                      <td style={{ padding: "10px" }}>
                        상품 구매 금액이 0 ~ 150,000원 사이 고객의 등급입니다.
                      </td>
                    </tr>
                  </tbody>
                  <tbody className="data" style={{ textAlign: "center" }}>
                    <tr
                      style={{
                        borderBottom: "1px solid #e0e0e0",
                        backgroundColor: "#ffffff"
                      }}
                    >
                      <td style={{ padding: "10px", fontWeight: "bold", color: "#C0C0C0" }}>SILVER</td>
                      <td style={{ padding: "10px" }}>
                        상품 구매 금액이 150,000 ~ 500,000원 사이 고객의 등급입니다.
                      </td>
                    </tr>
                  </tbody>
                  <tbody className="data" style={{ textAlign: "center" }}>
                    <tr
                      style={{
                        borderBottom: "1px solid #e0e0e0",
                        backgroundColor: "#f9f9f9"
                      }}
                    >
                      <td style={{ padding: "10px", fontWeight: "bold", color: "#FFD700" }}>GOLD</td>
                      <td style={{ padding: "10px" }}>
                        상품 구매 금액이 500,000원 이상 고객의 등급입니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default MyPageIntro;
