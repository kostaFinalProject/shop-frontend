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
                <span className="membergrade">{currentUser.pointGrade}&nbsp;</span>
                등급입니다.
              </p>
              <ul className="displaynone">
                <li className="displaynone">등급혜택 여기에</li>
              </ul>
              <ul className="displaynone">
                <li className="displaynone">상위 등급으로 가는 법은 여기에</li>
              </ul>
            </div>
            <div>
              <ul className="bankbook">
                <li>
                  <a href="">
                    <span className="tit">총주문</span>
                    <span className="orderprice">{currentUser.payment}&nbsp;원</span>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="tit">적립금</span>
                    <span className="mileage">{currentUser.point}&nbsp;원</span>
                  </a>
                </li>
              </ul>
            </div>
          </article>
          <article>
            <div className="title">
              최근 주문 내역
              <span className="desc">최근 5개 출력</span>
              <span className="desc" />
              <a href="">+ more</a>
            </div>
            <div className="listwrap">
              <div className="ec-base-table typelist">
                <table border={0} summary="">
                  <colgroup>
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "15%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">주문번호</th>
                      <th scope="col">이미지</th>
                      <th scope="col">상품정보</th>
                      <th scope="col">주문처리상태</th>
                      <th scope="col">주문일자</th>
                    </tr>
                  </thead>
                  <tbody className="data" />
                </table>
                <p className="loading" style={{ display: "none" }}>
                  <i className="xi-spinner-3 xi spin" />
                </p>
                <p className="empty">주문 내역이 없습니다.</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default MyPageIntro;
