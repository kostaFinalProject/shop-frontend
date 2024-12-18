import React, { useState, useEffect } from "react";
import "./Adminright.css";

const Adminright = () => {
  const [admins, setadmins] = useState([]); // 상태에 데이터를 저장할 배열
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");



  useEffect(() => {
    // 데이터 가져오기
    fetch("http://localhost:8080/api/v1/members/admin-request", {
      method: 'GET',
      headers: {
        'Authorization': accessToken,
        'Refresh-Token': refreshToken,
      },
    })
      .then((response) => response.json()) // JSON으로 응답 처리
      .then((data) => {
        console.log("데이터 확인:", data); // 전체 데이터 출력
        setadmins(data.content); // content를 상태로 저장
      })
      .catch((error) => {
        console.error("데이터 요청 중 에러 발생:", error); // 에러 출력
      });
  }, []);

  const handleStatusChange = (targetId, newStatus) => {
    if (newStatus === "rightO") {
      console.log("Target ID:", targetId); // 확인용 로그

      // 관리자 승격 요청
      fetch(`http://localhost:8080/api/v1/members/promotion/${targetId}`, {
        method: 'PUT',
        headers: {
          'Authorization': accessToken,
          'Refresh-Token': refreshToken,
          'Content-Type': 'application/json', // PUT 요청 시 body가 없을 경우 생략 가능
        },
      })
        .then((response) => response.text()) // 응답을 JSON 형식으로 파싱
        .then((data) => {
          alert(data); // "관리자로 승인했습니다." 메시지 표시
          // 상태 업데이트 로직 (필요 시)
        })
        .catch((error) => {
          console.error("관리자 승인 중 에러 발생:", error);
          alert("승인 처리에 실패했습니다.");
        });
    } else {
      console.log("Target ID:", targetId); // 확인용 로그

      // 관리자 승격 요청
      fetch(`http://localhost:8080/api/v1/members/relegation/${targetId}`, {
        method: 'PUT',
        headers: {
          'Authorization': accessToken,
          'Refresh-Token': refreshToken,
          'Content-Type': 'application/json', // PUT 요청 시 body가 없을 경우 생략 가능
        },
      })
        .then((response) => response.text())
        .then((data) => {
          alert(data); 
        })
        .catch((error) => {
          console.error("관리자 해제 중 에러 발생:", error);
          alert("해제 처리에 실패했습니다.");
        });
    }
  };



  return (
    <section className="adminrightsection">
      <div className="list">
        <div className="introduce">
          <div className="name">
            <strong style={{ marginRight: 5, marginLeft: 10 }}>최고 관리자</strong>님
          </div>
        </div>
        <div className="detail">
          <div className="detail-list" />
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/reportuser")}
          >
            <div className="item">신고 유저 관리</div>
          </div>
          <div
            className="detail-select"
            onClick={() => (window.location.href = "/AdminPage/adminright")}
          >
            <div className="item">관리자 권한 관리</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/categorymaker")}
          >
            <div className="item">카테고리 등록</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/registproduct")}
          >
            <div className="item">상품 등록</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/modifyproduct")}
          >
            <div className="item">상품 수정</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/admindelivery")}
          >
            <div className="item">배송 관리</div>
          </div>
        </div>
      </div>
      <div className="info">
        <div className="content-name" style={{ marginBottom: 7, fontSize: 20 }}>
          관리자 권한 관리
        </div>
        <hr />
        <div className="content">
          {admins.map((admin) => (
            <div className="profile" key={admin.memberId}>
              <div className="profile_text">
                <div className="profile_information">
                  <p id={`user-id-${admin.memberId}`}>{admin.userId}</p>
                  <p id={`grade-${admin.memberId}`}>
                    {admin.grade === "NO_AUTHORIZATION_ADMIN" ? "권한 없음" : "권한 있음"}
                  </p>
                </div>
              </div>
              <div className="profile-button">
                <select
                  name="adminstatus"
                  defaultValue={
                    admin.grade === "NO_AUTHORIZATION_ADMIN" ? "rightX" : "rightO"
                  }
                  onChange={(e) => handleStatusChange(admin.memberId, e.target.value)}
                >
                  <option value="rightX">권한X</option>
                  <option value="rightO">권한O</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Adminright;
