import React, { useState, useEffect } from "react";
import "./Adminright.css";
import AdminNavi from "./AdminComponent/AdminNavi";

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
    <section className="Adminright_adminrightsection">

      <AdminNavi />

      <div className="Adminright_info">
        <div className="Adminright_content-name">
          관리자 권한 관리
        </div>
        <hr />
        <div className="Adminright_content">
          {admins.map((admin) => (
            <div className="Adminright_profile" key={admin.memberId}>
              <div className="Adminright_profile_text">
                <div className="Adminright_profile_information">
                  <p id={`user-id-${admin.memberId}`}>{admin.userId}</p>
                  <p id={`grade-${admin.memberId}`}>
                    {admin.grade === "NO_AUTHORIZATION_ADMIN" ? "권한 없음" : "권한 있음"}
                  </p>
                </div>
              </div>
              <div className="Adminright_profile-button">
                <select
                  className="Adminright_adminstatus"
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