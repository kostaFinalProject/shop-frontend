import React, { useState } from "react";
import './test.css';

const Test = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('page1');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openPage = (pageName) => setActivePage(pageName);

  return (
    <>
      {/* 모달 열기 버튼 */}
      <button id="modal-open" onClick={openModal}>Open Modal</button>

      {/* 모달 구조 (조건부 렌더링) */}
      {isModalOpen && (
        <div id="popup" className="modal" onClick={(e) => e.target.id === 'popup' && closeModal()}>
          <div className="modal-content">
            {/* 탭 */}
            <div className="tabs">
              <button className={`tab-link ${activePage === 'page1' ? 'active' : ''}`} onClick={() => openPage('page1')}>팔로우</button>
              <button className={`tab-link ${activePage === 'page2' ? 'active' : ''}`} onClick={() => openPage('page2')}>팔로잉</button>
            </div>

            {/* 페이지 내용 */}
            <div id="page1" className={`page ${activePage === 'page1' ? 'active' : ''}`}>
              {/* Page 1 내용 */}
              <div className="SearchProfile_full">
                <div className="SearchProfile_pageline">
                  {/* 반복되는 사용자 프로필 */}
                  {[...Array(7)].map((_, index) => (
                    <div key={index} className="SearchProfile_feed_user">
                    <div className="SearchProfile_user_img">
                      <img src="https://fakeimg.pl/60x60/" alt="" />
                    </div>
                    <div className="SearchProfile_user_information">
                      <a href="#">
                        <div className="SearchProfile_user_id">아이디</div>
                        <div className="SearchProfile_user_message">
                          맨시티팬이다 프로필검색시 필요
                        </div>
                      </a>
                    </div>
                    <div className="SearchProfile_btn">
                      <button className="SearchProfile_follow_btn">팔로우</button>
                    </div>
                  </div>
                  
                  ))}
                </div>
              </div>
            </div>

            <div id="page2" className={`page ${activePage === 'page2' ? 'active' : ''}`}>
              {/* Page 2 내용 */}
              <div className="SearchProfile_full">
                <div className="SearchProfile_pageline">
                  {[...Array(10)].map((_, index) => (
                    <div key={index} className="SearchProfile_feed_user">
                      <div className="SearchProfile_user_img">
                        <img src="https://fakeimg.pl/60x60/" alt="" />
                      </div>
                      <div className="SearchProfile_user_information">
                        <a href="#">
                          <div className="SearchProfile_user_id">아이디</div>
                          <div className="SearchProfile_user_message">
                            맨시티팬이다 프로필검색시 필요
                          </div>
                        </a>
                      </div>
                      <div className="SearchProfile_btn">
                        <button className="SearchProfile_follow_btn">언팔로우</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 모달 닫기 버튼 */}
            <button id="close" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Test;
