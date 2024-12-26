import React, {useState} from 'react';
import './ProfileDiv.css';

const ProfileDiv = ({ headers, profile, setProfile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePage, setActivePage] = useState('page1');
    
    if (!profile) {
        return <div>Loading...</div>;
    }

    const handleFollowToggle = async () => {
        try {
            if (profile.follow === "Followed") {
                // 언팔로우 요청
                const response = await fetch(
                    `http://localhost:8080/api/v1/followers/${profile.followerId}`,
                    {
                        method: "DELETE",
                        headers: headers,
                    }
                );

                if (response.ok) {
                    // 언팔로우
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        follow: "Not Follow",
                        followeeCount: prevProfile.followeeCount - 1,
                        followerId: null,
                    }));
                    alert("언팔로우 되었습니다.");
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "언팔로우 요청 실패");
                }
            } else {
                // 팔로우
                const response = await fetch(
                    `http://localhost:8080/api/v1/followers/${profile.memberId}`,
                    {
                        method: "POST",
                        headers: headers,
                    }
                );

                if (response.ok) {
                    const data = await response.json();

                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        follow: "Followed",
                        followeeCount: prevProfile.followeeCount + 1,
                        followerId: data.followerId,
                    }));
                    alert("팔로우 요청을 보냈습니다.");
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "팔로우 요청 실패");
                }
            }
        } catch (error) {
            console.error("팔로우/언팔로우 요청 에러:", error);
            alert("요청 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    //모달
    

    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // 스크롤 막기
    }
    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto'; // 스크롤 다시 활성화
    };

    const openPage = (pageName) => setActivePage(pageName);


    return (
        <div className="Styleprofile_profile">
            <div className="Styleprofile_profile_img">
                <img src={profile.memberProfileImageUrl} alt="Profile" />
            </div>

            <div className="Styleprofile_profile_text">
                <div className="Styleprofile_profile_head">
                    <span className="Styleprofile_profile_nickname">{profile.memberNickname}</span>
                    <button
                        className="Styleprofile_follow_btn"
                        onClick={handleFollowToggle}
                        style={{
                            backgroundColor: profile.follow === "Followed" ? "blue" : "black",
                            color: "white",
                        }}
                        hidden={profile.follow === "Me"}
                    >
                        {profile.follow === "Followed" ? "언팔로우" : "팔로우"}
                    </button>
                    <button
                        className="Styleprofile_follow_btn"
                        hidden={profile.follow === "Me"}>
                        차단
                    </button>
                </div>

                <div className="Styleprofile_follow_following">
                    <div className="Styleprofile_follow">
                        <button id="modal-open" onClick={openModal}>팔로워</button>
                        <span>{profile.followeeCount}</span>
                    </div>
                    {/* 모달 구조 (조건부 렌더링) */}
                    {isModalOpen && (
                        <div id="popup" className="followmodal" onClick={(e) => e.target.id === 'popup' && closeModal()}>
                            <div className="followmodal-content">
                                {/* 탭 */}
                                <div className="followtabs">
                                    <button className={`followtab-link ${activePage === 'page1' ? 'active' : ''}`} onClick={() => openPage('page1')}>팔로우</button>
                                    <button className={`followtab-link ${activePage === 'page2' ? 'active' : ''}`} onClick={() => openPage('page2')}>팔로잉</button>
                                    <button className={`followtab-link ${activePage === 'page3' ? 'active' : ''}`} onClick={() => openPage('page3')}>차단리스트</button>
                                    <button className={`followtab-link ${activePage === 'page4' ? 'active' : ''}`} onClick={() => openPage('page4')}>맞팔로우수락</button>
                                </div>

                                {/* 페이지 내용 */}
                                <div id="page1" className={`page ${activePage === 'page1' ? 'active' : ''}`}>
                                    {/* Page 1 내용 */}
                                    <div className="followProfile_full">
                                        <div className="SearchProfile_pageline">
                                            {/* 반복되는 사용자 프로필 */}
                                            {[...Array(1)].map((_, index) => (
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
                                    <div className="followProfile_full">
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

                                <div id="page3" className={`page ${activePage === 'page3' ? 'active' : ''}`}>
                                    {/* Page 3 내용 */}
                                    <div className="followProfile_full">
                                        <div className="SearchProfile_pageline">
                                            {[...Array(12)].map((_, index) => (
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
                                                        <button className="SearchProfile_follow_btn">차단해제</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div id="page4" className={`page ${activePage === 'page4' ? 'active' : ''}`}>
                                    {/* Page 4 내용 */}
                                    <div className="followProfile_full">
                                        <div className="SearchProfile_pageline">
                                            {[...Array(12)].map((_, index) => (
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
                                                        <button className="SearchProfile_follow_btn">팔로우 수락</button>
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


                    <div className="Styleprofile_following">
                        <a href="#">팔로잉</a>
                        <span>{profile.followerCount}</span>
                    </div>
                </div>

                <div className="Styleprofile_profile_information">
                    <p>{profile.memberIntroduction}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileDiv;