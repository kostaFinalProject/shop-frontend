
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate 훅 임포트
import "./Reportuser.css";

const Reportuser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [activePage, setActivePage] = useState("page1"); // 활성화된 페이지

  // 모달 열기
  const openModal = () => setIsModalOpen(true);

  // 모달 닫기
  const closeModal = () => setIsModalOpen(false);

  // 모달 배경 클릭 시 닫기
  const handleBackgroundClick = (event) => {
    if (event.target.id === "popup") {
      closeModal();
    }
  };

  // 페이지 열기
  const openPage = (pageName) => setActivePage(pageName);


  return (
    <section className="reportusersection">
      <div className="list">
        <div className="introduce">
          <div className="name">
            <strong style={{ marginRight: 5, marginLeft: 10 }}>최고 관리자</strong>
            님
          </div>
        </div>
        <div className="detail">
          <div className="detail-list" />
          <div
            className="detail-select"
            onClick={() => (window.location.href = "/AdminPage/reportuser")}
          >
            <div className="item">신고 유저 관리</div>
          </div>
          <div
            className="detail-noselect"
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
        </div>
      </div>
      <div className="info">
        <div className="content-name" style={{ marginBottom: 7, fontSize: 20 }}>
          신고된 유저
        </div>
        <hr />
        <div className="content">
          <div className="reportbox">
            <div className="reportboxheader">
              <div id="date">10월 19일</div>
            </div>
            <div className="reportboxdetail">
              <div className="profile">
                <div className="profile_img">
                  <img src="https://fakeimg.pl/150x150/" alt="" />
                </div>
                <div className="profile_text">
                  <div className="profile_head">
                    <span className="profile_nickname" id="nickname">
                      j___c_y
                    </span>
                  </div>
                  <div className="profile_information">
                    <p id="id">jco0807</p>
                  </div>
                  <div>
                    <span>신고사유: </span>
                    그냥
                  </div>
                </div>
              </div>
              <a href="">
                <div>판결</div>
              </a>
            </div>
            <div className="reportboxdetail">
              <div className="profile">
                <div className="profile_img">
                  <img src="https://fakeimg.pl/150x150/" alt="" />
                </div>
                <div className="profile_text">
                  <div className="profile_head">
                    <span className="profile_nickname" id="nickname">
                      j___c_y
                    </span>
                  </div>
                  <div className="profile_information">
                    <p id="id">jco0807</p>
                  </div>
                  <div>
                    <span>신고사유: </span>
                    그냥
                  </div>
                </div>
              </div>
              <div className="profile-button">
                <button id="modal-open" onClick={openModal}>글보기</button>
              </div>
              <div id="popup" className="modal" style={{ display: "none" }}>
                <div className="modal-content">
                  {/* 탭 */}
                  <div className="tabs">
                    <button
                      className={`tab-link ${activePage === "page1" ? "active" : ""}`}
                      onClick={() => openPage("page1")}
                    >
                      게시글
                    </button>
                    <button
                      className={`tab-link ${activePage === "page2" ? "active" : ""}`}
                      onClick={() => openPage("page2")}
                    >
                      댓글
                    </button>
                  </div>
                  {/* 페이지 내용 */}
                  <div id="page1" className={`page ${activePage === "page1" ? "active" : ""}`}>
                    <article>
                      {/* ----------------------social_head----------------- */}
                      <div className="social_head">
                        {/* <div class="profile_img"><img src="https://fakeimg.pl/44x44/"  alt=""></div> */}
                        <div className="profile_img">
                          <img
                            src="https://cdn.4mation.net/profile/image/tmdals4872_7de6ba24-cec8-4862-89f3-e303a4ff8e01.png?s=100x100&q=100"
                            alt=""
                          />
                        </div>
                        <div className="profile_text">
                          <p className="profile_id">under_lapping </p>
                          <p className="registration_time">2024년 8월 20일</p>
                        </div>
                      </div>
                      {/* ----------------------social_body----------------- */}
                      <div className="social_body">
                        {/* <div class="main_img"><img src="https://fakeimg.pl/640x640/"  alt=""></div> */}
                        <div className="main_img">
                          <img
                            src="https://cdn.4mation.net/market/mainimage/sethb_72b2f7b4-6221-4b3d-8a64-319ba82bd7e1_1045x1436.jpeg"
                            alt=""
                          />
                        </div>
                      </div>
                      {/* ---------------------social_text-----------------           */}
                      <div className="social_text">
                        <h2 className="text_title">
                          코듀로이의 계절 셔츠도 코듀로이로
                        </h2>
                        <p className="text_tag">
                          #겨울데일리 #겨울코디추천 #아우터추천 #연말선물 #연말룩
                          #신발리뷰 #사이즈팁 #요즘신발 #KICKS #남자코디
                          #겨울남자코디 #남자겨울코디 #남자데일리룩
                        </p>
                      </div>
                    </article>
                  </div>
                  <div id="page2" className={`page ${activePage === "page2" ? "active" : ""}`}>
                    <div id="reportcomment">
                      {" "}
                      대충 댓글 양식 따오기 Lorem ipsum dolor sit amet consectetur
                      adipisicing elit. Ea libero numquam quae recusandae?
                      Blanditiis, temporibus? Ipsum laborum ea repudiandae magni
                      amet, accusantium harum illum dolorum animi expedita at
                      tempora suscipit?
                    </div>
                  </div>
                  {/* 모달 닫기 버튼 */}
                  <button id="close">Close</button>
                </div>
              </div>
              <div className="profile-button">
                <select
                  name="adminstatus"
                  id="\"
                  className="/"
                  style={{ height: "37.33px", marginBottom: 5, width: "81.33px" }}
                >
                  <option value="/">1일</option>
                  <option value="//">7일</option>
                  <option value="///">30일</option>
                  <option value="////">꺼져</option>
                </select>
                <a>
                  <div>적용</div>
                </a>
              </div>
            </div>
            <div className="reportbox">
              <div className="reportboxheader">
                <div id="date">10월 10일</div>
              </div>
              <div className="reportboxdetail">
                <div className="profile">
                  <div className="profile_img">
                    <img src="https://fakeimg.pl/150x150/" alt="" />
                  </div>
                  <div className="profile_text">
                    <div className="profile_head">
                      <span className="profile_nickname" id="nickname">
                        j___c_y
                      </span>
                    </div>
                    <div className="profile_information">
                      <p id="id">jco0807</p>
                      <p id="comment">@j___c_y</p>
                    </div>
                    <div>
                      <span>신고사유: </span>
                      그냥
                    </div>
                  </div>
                </div>
                <a href="">
                  <div>판결</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Reportuser;