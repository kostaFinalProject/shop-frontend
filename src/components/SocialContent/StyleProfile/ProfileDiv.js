import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './ProfileDiv.css';

const ProfileDiv = ({ headers, profile, setProfile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePage, setActivePage] = useState('page1');

    const [followers, setFollowers] = useState([]);  // 팔로워 리스트 상태
    const [followees, setFollowees] = useState([]); // 팔로잉 리스트 상태
    const [blockList, setBlockList] = useState([]); // 차단리스트 상태
    const [followRequests, setFollowRequests] = useState([]);

    const [isLoading, setIsLoading] = useState(false);  // 로딩 상태
    const [error, setError] = useState(null);  // 에러 상태
    const navigate = useNavigate();

    if (!profile) {
        return <div>Loading...</div>;
    }

    // useEffect(() => {
    //     if (activePage === "page1") {
    //         // followees 상태 동기화
    //         fetchFollowees();
    //     } else if (activePage === "page2") {
    //         // followers 상태 동기화
    //         fetchFollowers();
    //     }
    // }, [activePage]);

    // 팔로워 리스트를 불러오는 함수 - 나에게 팔로우를 건 사람과 맞팔이 같이 떠야함
    const fetchFollowers = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8080/api/v1/members/followers/${profile.memberId}`, {
                headers: headers,
            });
            setFollowers(response.data.content);  // 받아온 데이터 설정
            console.log(response.data.content)
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 팔로잉 리스트를 불러오는 함수
    const fetchFollowees = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8080/api/v1/members/followees/${profile.memberId}`, {
                headers: headers,
            });
            setFollowees(response.data.content);  // 받아온 데이터 설정
            console.log('followees',response.data.content); // followees 배열을 콘솔에 출력 *****
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 팔로우 수락 리스트를 불러오는 함수
    const fetchFollowRequests = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8080/api/v1/members/requests', {
                headers: headers,
            });
            console.log('API Response:', response.data); // API 응답 데이터 확인
            setFollowRequests(response.data.content);
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
            console.error('Fetch Follow Requests Error:', error); // 에러 로그
        } finally {
            setIsLoading(false);
        }
    };

    // 팔로우 요청 수락 버튼 추가
    const handleFollowRequestAccept = async (followId) => {

        try {
            // 팔로우 요청 수락 API 호출
            const response = await fetch(`http://localhost:8080/api/v1/followers/${followId}`, {
                method: "PUT",
                headers: headers,
            });

            // 요청 성공 후 상태 업데이트
            alert("맞팔로우 요청을 수락했습니다."); // "팔로우 요청을 수락했습니다." 메시지 출력

            setProfile((prevProfile) => ({
                ...prevProfile,
                followerCount: prevProfile.followerCount + 1,
            }));

            // 팔로우 요청 목록에서 수락한 팔로우 제거
            setFollowRequests(prevRequests =>
                prevRequests.filter(request => request.followId !== followId)
            );

            fetchFollowees();
            fetchFollowers();
        } catch (error) {
            alert("팔로우 요청 수락에 실패했습니다.");
            console.error("Error accepting follow request:", error);
        }
    };

    // 에러 메시지를 처리할 때 객체가 아닌 문자열로 렌더링 - {timestamp, status, error, path}와 같은 객체가 React child로 전달되고 있어 문제가 발생
    const renderError = () => {
        if (error) {
            if (typeof error === 'object' && error !== null) {
                // 에러 객체의 특정 속성을 표시 (예: timestamp, status, error, path)
                return (
                    <div>
                        <p>Error: {error.status}</p>
                        <p>Message: {error.error}</p>
                        <p>Path: {error.path}</p>
                    </div>
                );
            }
            return <div>{error}</div>;
        }
        return null;
    };

    // 모달 관련 함수
    const openModal = () => {
        setIsModalOpen(true);
        fetchFollowers();  // 모달 열릴 때 팔로워 목록을 불러옴
        fetchFollowees();  // 팔로잉 목록을 불러옴
        fetchBlockList();  // 차단 리스트를 불러옴
        fetchFollowRequests(); // 팔로우 요청 목록
        document.body.style.overflow = 'hidden'; // 스크롤 막기
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto'; // 스크롤 다시 활성화
    };

    const handleFollowToggle = async () => {
        try {
            console.log("Current profile.follow:", profile.follow);  // 팔로우 상태 출력
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

    const handleFollow = async (memberId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/followers/${memberId}`,
                {
                    method: "POST",
                    headers: headers,
                }
            );

            if (response.ok) {
                const data = await response.json();

                setProfile((prevProfile) => ({
                    ...prevProfile,
                    followerCount: prevProfile.followerCount + 1,
                }));

                setFollowees(prevFollowees =>
                    prevFollowees.map(followee =>
                        followee.id === data.followId
                            ? { ...followee, followStatus: 'ACCEPTED' }
                            : followee
                    )
                );

                fetchFollowers();
                fetchFollowRequests();

                alert("팔로우 요청을 보냈습니다.");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "팔로우 요청 실패");
            }
        } catch (error) {
            console.error("팔로우 요청 에러:", error);
            alert("요청 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const handleUnfollow = async (followId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/followers/${followId}`,
                {
                    method: "DELETE",
                    headers: headers,
                }
            );

            if (response.ok) {
                // 언팔로우
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    followerCount: prevProfile.followerCount - 1,
                }));

                setFollowers((prevFollowers) =>
                    prevFollowers.filter((follower) => follower.followId !== followId)
                );

                fetchFollowees();
                fetchFollowRequests();
                alert("언팔로우 되었습니다.");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "언팔로우 요청 실패");
            }
        } catch (error) {
            console.error("언팔로우 요청 에러:", error);
            alert("요청 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    // 차단 리스트를 불러오는 함수
    const fetchBlockList = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8080/api/v1/members/blocks`, {
                headers: headers,
            });
            setBlockList(response.data.content);  // 받아온 데이터 설정
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlockUser = async () => {
        if (!profile || !profile.memberId) {
          return;
        }
      
        try {
          const response = await fetch(`http://localhost:8080/api/v1/blocks/${profile.memberId}`, {
            method: "POST",
            headers: headers,
          });
      
          if (response.ok) {
            alert("차단 목록에 추가했습니다.");
            navigate("/StyleMain");
          } else {
            const errorText = await response.text();
            alert(`차단 실패: ${errorText}`);
          }
        } catch (error) {
          console.error("Error blocking user:", error);
          alert("차단 처리 중 오류가 발생했습니다.");
        }
      };

    // 차단 해제 요청
    const handleUnblock = async (blockId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/blocks/${blockId}`, {
                method: "DELETE",
                headers: headers,
            });

            if (response.status === 200) {
                setBlockList(prevBlockList => prevBlockList.filter(block => block.blockId !== blockId)); // 차단 리스트에서 해당 사용자 제거
                alert("차단이 해제되었습니다.");
            }
        } catch (error) {
            console.error("차단 해제 요청 에러:", error);
            alert("차단 해제 요청에 실패했습니다.");
        }
    };
      
    const openPage = (pageName) => setActivePage(pageName);
    // const openPage = (page) => {
    //     setActivePage(page);
    
    //     // 페이지가 바뀔 때마다 해당하는 데이터를 새로 불러옴
    //     if (page === 'page1') {
    //         fetchFollowers();  // 팔로워 목록 새로 불러오기
    //     } else if (page === 'page2') {
    //         fetchFollowees();  // 팔로잉 목록 새로 불러오기
    //     } else if (page === 'page3') {
    //         fetchBlockList();  // 차단 리스트 새로 불러오기
    //     } else if (page === 'page4') {
    //         fetchFollowRequests();  // 맞팔로우 새로 불러오기
    //     }
    // };
    

    return (
        <div className="Styleprofile_profile">
            <div className="Styleprofile_profile_img">
                <img
                    src={profile.memberProfileImageUrl ? `/uploads/${profile.memberProfileImageUrl}` : 'https://fakeimg.pl/150x150'}
                    alt="Profile"
                />
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
                        hidden={profile.follow === "Me"}
                        onClick={handleBlockUser}>
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
                                    <button className={`followtab-link ${activePage === 'page1' ? 'active' : ''}`} onClick={() => openPage('page1')}>팔로워</button>
                                    <button className={`followtab-link ${activePage === 'page2' ? 'active' : ''}`} onClick={() => openPage('page2')}>팔로우</button>
                                    {profile.follow === "Me" && (
                                        <>
                                            <button className={`followtab-link ${activePage === 'page3' ? 'active' : ''}`} onClick={() => openPage('page3')}>차단리스트</button>
                                            <button className={`followtab-link ${activePage === 'page4' ? 'active' : ''}`} onClick={() => openPage('page4')}>맞팔로우</button>
                                        </>
                                    )}
                                </div>

                                {/* 페이지 내용 */}
                                <div id="page1" className={`page ${activePage === 'page1' ? 'active' : ''}`}>
                                    {/* Page 1 내용 */}
                                    {isLoading ? (
                                        <div>로딩 중...</div>
                                    ) : (
                                        <>
                                            {renderError()} {/* 에러 메시지 렌더링 */}
                                            <div className="followProfile_full">
                                                <div className="SearchProfile_pageline">
                                                    {followees.map((followee, index) => (
                                                        <div key={index} className="SearchProfile_feed_user">
                                                            <div className="SearchProfile_user_img">
                                                                <a href={`http://localhost:3000/Styleprofile?memberId=${followee.memberId}`}>
                                                                    <img src={followee.memberProfileImageUrl ? `/uploads/${followee.memberProfileImageUrl.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", "")}` : "https://fakeimg.pl/60x60/"} alt="Profile" />
                                                                </a>
                                                            </div>
                                                            <div className="SearchProfile_user_information">
                                                                <a href={`http://localhost:3000/Styleprofile?memberId=${followee.memberId}`}>
                                                                    <div className="SearchProfile_user_id">{followee.memberNickname}</div>
                                                                    <div className="SearchProfile_user_message">{followee.introduction ? followee.introduction : "소개글이 없습니다."}</div>
                                                                </a>
                                                            </div>
                                                            <div className="SearchProfile_btn">
                                                                {followee.followStatus === "REQUEST" && profile.follow === "Me" && (
                                                                    <button className="SearchProfile_follow_btn" onClick={() => handleFollow(followee.memberId)}>
                                                                        팔로우
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div id="page2" className={`page ${activePage === 'page2' ? 'active' : ''}`}>
                                    {isLoading ? (
                                        <div>로딩 중...</div>
                                    ) : (
                                        <>
                                            {renderError()} {/* 에러 메시지 렌더링 */}
                                            <div className="followProfile_full">
                                                <div className="SearchProfile_pageline">
                                                    {followers.map((follower, index) => (
                                                        <div key={index} className="SearchProfile_feed_user">
                                                            <div className="SearchProfile_user_img">
                                                                <a href={`http://localhost:3000/Styleprofile?memberId=${follower.memberId}`}>
                                                                <img src={follower.memberProfileImageUrl ? `/uploads/${follower.memberProfileImageUrl.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", "")}` : "https://fakeimg.pl/60x60/"} alt="Profile" />
                                                                </a>
                                                            </div>
                                                            <div className="SearchProfile_user_information">
                                                                <a href={`http://localhost:3000/Styleprofile?memberId=${follower.memberId}`}>
                                                                    <div className="SearchProfile_user_id">{follower.memberNickname}</div>
                                                                    <div className="SearchProfile_user_message">{follower.introduction ? follower.introduction : "소개글이 없습니다."}</div>
                                                                </a>
                                                            </div>
                                                            <div className="SearchProfile_btn">
                                                                {/* 이미 맞팔로우된 사람은 버튼이 아예 표시되지 않음 */}
                                                                {profile.follow === "Me" && (
                                                                    <button className="SearchProfile_follow_btn" onClick={() => handleUnfollow(follower.followId)}>
                                                                        언팔로우
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div id="page3" className={`page ${activePage === 'page3' ? 'active' : ''}`}>
                                    <div className="followProfile_full">
                                        <div className="SearchProfile_pageline">
                                            {blockList.map((block, index) => (
                                                <div key={index} className="SearchProfile_feed_user">
                                                    <div className="SearchProfile_user_img">
                                                        <a href={`http://localhost:3000/Styleprofile?memberId=${block.blockMemberId}`}>
                                                        <img src={block.memberProfileImageUrl ? `/uploads/${block.memberProfileImageUrl.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", "")}` : "https://fakeimg.pl/60x60/"} alt="Profile" />
                                                        </a>
                                                    </div>
                                                    <div className="SearchProfile_user_information">
                                                        <a href={`http://localhost:3000/Styleprofile?memberId=${block.blockMemberId}`}>
                                                            <div className="SearchProfile_user_id">{block.blockMemberNickname}</div>
                                                            <div className="SearchProfile_user_message">{block.blockMemberIntroduction ? block.blockMemberIntroduction : "소개글이 없습니다."}</div>
                                                        </a>
                                                    </div>
                                                    <div className="SearchProfile_btn">
                                                        <button className="SearchProfile_follow_btn" onClick={() => handleUnblock(block.blockId)}>
                                                            차단해제
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div id="page4" className={`page ${activePage === 'page4' ? 'active' : ''}`}>
                                    <div className="followProfile_full">
                                        <div className="SearchProfile_pageline">
                                            {followRequests.map((request, index) => (
                                                <div key={index} className="SearchProfile_feed_user">
                                                    <div className="SearchProfile_user_img">
                                                        <a href={`http://localhost:3000/Styleprofile?memberId=${request.memberId}`}>
                                                        <img src={request.memberProfileImageUrl ? `/uploads/${request.memberProfileImageUrl.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", "")}` : "https://fakeimg.pl/60x60/"} alt="Profile" />
                                                        </a>
                                                    </div>
                                                    <div className="SearchProfile_user_information">
                                                        <a href={`http://localhost:3000/Styleprofile?memberId=${request.memberId}`}>
                                                            <div className="SearchProfile_user_id">{request.memberNickname}</div>
                                                            <div className="SearchProfile_user_message">
                                                            {request.introduction ? request.introduction : "소개글이 없습니다."}
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className="SearchProfile_btn">
                                                        {/* 수락 버튼 클릭 시 팔로우 요청 수락 */}
                                                        <button
                                                            className="SearchProfile_follow_btn"
                                                            onClick={() => handleFollowRequestAccept(request.followId)} // 버튼 클릭 시 수락
                                                        >
                                                            수락
                                                        </button>
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