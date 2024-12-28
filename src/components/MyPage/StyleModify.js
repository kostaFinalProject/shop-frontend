import React, { useState, useEffect } from "react";
import "./StyleModify.css";
import MyPageNavigation from "./MyPageNavigation";

const StyleModify = () => {
  const [image, setImage] = useState('https://fakeimg.pl/150/');
  const [memberProfile, setMemberProfile] = useState(null);
  const [memberIntroduction, setMemberIntroduction] = useState('');

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    // GET /profile API 호출
    fetch('http://localhost:8080/api/v1/members/profile', {
      headers: {
        Authorization: accessToken,
        'Refresh-Token': refreshToken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        return response.json();
      })
      .then((data) => {
        const {
          memberId,
          memberNickname,
          memberIntroduction,
          memberProfileImageUrl,
          memberStatus,
        } = data;
  
        // 프로필 상태 설정
        setMemberProfile({
          memberId,
          memberNickname,
          memberIntroduction: memberIntroduction || '', // 소개글 없으면 기본값으로 빈 문자열
          memberProfileImageUrl: memberProfileImageUrl
            ? memberProfileImageUrl.replace(
                'C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\',
                '',
              )
            : null, // 이미지 없으면 null
          memberStatus,
        });
  
        // 프로필 이미지와 소개글 상태 개별 설정
        setImage(
          memberProfileImageUrl
            ? `/uploads/${memberProfileImageUrl.replace(
                'C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\',
                '',
              )}`
            : 'https://fakeimg.pl/150/',
        );
        setMemberIntroduction(memberIntroduction || ''); // 소개글 없을 때 기본값
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result); // 업로드된 이미지를 미리보기 이미지로 설정
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImage('https://fakeimg.pl/150/'); // 기본 이미지로 되돌리기
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    const formData = new FormData();
    const fileInput = document.getElementById("file");

    formData.append("profile", new Blob([JSON.stringify({ introduction: memberIntroduction })], { type: "application/json" }));

    // 파일이 선택되었으면 추가
    if (fileInput && fileInput.files[0]) {
      formData.append("file", fileInput.files[0]);
    }

    // 둘 다 입력하지 않더라도 비어있는 FormData를 전송
    fetch('http://localhost:8080/api/v1/members/profile', {
      method: 'PUT',
      headers: {
        Authorization: accessToken,
        'Refresh-Token': refreshToken,
      },
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('프로필 수정 실패');
        }
        return response.text(); // 서버의 응답 데이터
      })
      .then(data => {
        alert('프로필이 성공적으로 수정되었습니다.');
        window.location.reload(); 
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        alert('프로필 수정 중 오류가 발생했습니다.');
      });
  };

  const handleStatusChange = (event) => {
    const status = event.target.value; // 선택된 status 값 가져오기
  
    fetch('http://localhost:8080/api/v1/members/account-status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken, // accessToken 사용
        'Refresh-Token': refreshToken, // refreshToken 사용
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update status');
        }
        return response.json(); // 응답에서 데이터를 JSON으로 파싱
      })
      .then(data => {
        console.log('Status updated:', data);
        setMemberProfile(prevState => ({
          ...prevState,
          memberStatus: status, // 로컬 상태를 변경된 status 값으로 업데이트
        }));
      })
      .catch(error => console.error('Error updating status:', error));
  };
  
  return (
    <div className="stylemodifycontainer">
      <div id="content" className="-frame">
        <MyPageNavigation />
        <section className="contentwrap">
          <div className="contentwraptitle"> 프로필 관리</div>
          <div className="typeNav">
            <ul className="menu" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="profile">
              <div className="wrapper">
                <img
                  src={image}  // 변경된 이미지 URL을 상태값으로 설정
                  className="image-box"
                  id="profile-image"
                />
                <div className="imagebutton">
                  <label htmlFor="file" className="upload-btn" >
                    <input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    이미지 변경
                  </label>
                  <button
                    type="button"
                    className="delete-btn"
                    id="delete-image"
                    onClick={handleDeleteImage}
                  >
                    이미지 삭제
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="profilecontent">
                소개
                <input
                  type="text"
                  className="introducebox"
                  id="introducebox"
                  placeholder="소개를 작성해보세요"
                  value={memberIntroduction}
                  onChange={(e) => setMemberIntroduction(e.target.value)} // 입력값 반영
                />
              </div>
            </div>
            <div>
              <button type="submit" className="submit">저장</button>
            </div>
          </form>
          <div className="privacy-toggle">
            <label>
              <input
                type="radio"
                name="privacy"
                value="PUBLIC"
                checked={memberProfile && memberProfile.memberStatus === 'PUBLIC'}
                onChange={handleStatusChange}
              />
              공개
            </label>
            &nbsp;
            <label>
              <input
                type="radio"
                name="privacy"
                value="PRIVATE"
                checked={memberProfile && memberProfile.memberStatus === 'PRIVATE'}
                onChange={handleStatusChange}
              />
              비공개
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StyleModify;