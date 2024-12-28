import React, { useState, useEffect } from "react";
import './Styleprofile.css';
import { useLocation } from "react-router-dom";
import ProfileDiv from "./ProfileDiv.js";
import ProfilePosts from './ProfilePosts.js';
import ProfileTags from './ProfileTags.js';
import ProfileMyInterests from "./ProfileMyInterests.js";

const Styleprofile = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [headers, setHeaders] = useState(null); // 인증된 헤더 저장
    const [profile, setProfile] = useState(null); // 프로필 상태 추가
    const [loggedInUserId, setLoggedInUserId] = useState(null); // 접속한 사용자 ID
    const [articleCollections, setArticleCollections] = useState(null);
    const [articleCollectionId, setArticleCollectionId] = useState();
    const location = useLocation();

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const queryParams = new URLSearchParams(location.search);
    const memberId = queryParams.get("memberId");

    // initializeLoginState 함수 정의
    const initializeLoginState = () => {
        const loggedInUserId = localStorage.getItem("loggedInUserId"); // 예시로 로컬스토리지에서 가져옴
        console.log("loggedInUserId", loggedInUserId);
        return loggedInUserId; // 로그인한 사용자의 memberId 반환
    };

    const getHeaders = async () => {
        const initialHeaders = { "Content-Type": "application/json" };

        if (accessToken && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(refreshToken);
                if (newAccessToken) {
                    localStorage.setItem("accessToken", newAccessToken);
                    initialHeaders["Authorization"] = newAccessToken;
                    initialHeaders["Refresh-Token"] = refreshToken;
                } else {
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

        return initialHeaders;
    };

    const refreshAccessToken = async (refreshToken) => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/members/refresh-token", {
                method: "POST",
                headers: { "Refresh-Token": refreshToken },
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

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/members/profile/${memberId}`, {
                method: "GET",
                headers: headers,
            });

            if (response.ok) {
                const data = await response.json();
                const processedData = {
                    memberId: data.memberId,
                    memberNickname: data.memberNickname,
                    memberIntroduction: data.introduction ? data.introduction : "소개글이 없습니다.",
                    memberProfileImageUrl: data.memberProfileImageUrl
                        ? data.memberProfileImageUrl.replace(
                            "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                            ""
                        )
                        : null,
                    memberStatus: data.memberStatus,
                    followerId: data.followId || null,
                    articleCount: data.articleCount,
                    followeeCount: data.followeeCount,
                    followerCount: data.followerCount,
                    follow: data.follow,
                };

                console.log(processedData);
                setProfile(processedData);
            } else {
                console.error("Error fetching profile:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    //  -------------- 내 관심상품 조회 -------------- 
    useEffect(() => {
        const fetchArticleCollections = async (memberId) => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/members/article-collections`, {
                    method: "GET",
                    headers: headers, // 인증 토큰이 있는 경우에 사용
                });


                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched article collections:", data);

                    const collectionsData = data.content.map((article) => ({
                        ...article,
                        imageUrl: article.imageUrl.replace(
                            "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                            ""
                        ),
                    }));
                    console.log("Transformed article collections1:", collectionsData);
                    setArticleCollections(collectionsData);
                } else {
                    console.error("Error fetching article collections:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching article collections:", error);
            }
        };

        if (headers && profile) {
            const memberId = profile.memberId; // profile에서 memberId 추출
            fetchArticleCollections(memberId); // memberId를 fetchArticleCollections에 전달
        }
    }, [headers, profile]);

    useEffect(() => {
        const fetchMemberId = async () => {
            const memberId = await initializeLoginState(); // 로그인 상태에서 memberId 가져오기
            if (memberId) {
                console.log("현재 사용자 memberId", memberId);
                setLoggedInUserId(memberId); // 가져온 memberId 상태로 설정
            } else {
                console.warn("로그인 상태가 아니거나 memberId를 가져오지 못했습니다.");
            }
        };
        fetchMemberId();
    }, []);

    useEffect(() => {
        const authenticate = async () => {
            const authenticatedHeaders = await getHeaders();
            if (authenticatedHeaders) {
                setHeaders(authenticatedHeaders);
                setIsAuthenticated(true);
            }
        };

        authenticate();
    }, []);

    useEffect(() => {
        if (isAuthenticated && headers) {
            fetchProfile();
        }
    }, [isAuthenticated, headers]);

    if (!isAuthenticated || !profile) {
        return <div>Loading...</div>; // 인증 또는 프로필 로드 전 로딩 상태 표시
    }

    // 로그인한 사용자와 프로필의 memberId 비교
    const isUserProfile = Number(loggedInUserId) === profile.memberId;

    return (
        <>
            <div className="Styleprofile_full_screen">
                {/* 프로필 컴포넌트로 데이터 전달 */}
                <ProfileDiv headers={headers} profile={profile} setProfile={setProfile} />

                {/* 게시글, 태그상품 탭 */}
                <div className="Styleprofile_post_tag">
                    <span
                        className={`Styleprofile_postlist ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        게시글
                    </span>

                    <span
                        className={`Styleprofile_taglist ${activeTab === 'tags' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tags')}
                    >
                        태그상품
                    </span>

                    {/* 로그인한 사용자의 프로필인 경우에만 내 관심상품 탭 표시 */}
                    {isUserProfile && (
                        <span
                            className={`Styleprofile_MyInterestlist ${activeTab === 'MyInterests' ? 'active' : ''}`}
                            onClick={() => setActiveTab('MyInterests')}
                        >
                            내 관심상품
                        </span>
                    )}

                </div>

                {/* 탭에 따라 컴포넌트 렌더링 */}
                <div className="Styleprofile_sns_container">
                    {activeTab === 'posts' && (
                        <ProfilePosts headers={headers} profile={profile} />
                    )}
                    {activeTab === 'tags' && (
                        <ProfileTags headers={headers} profile={profile} />
                    )}
                    {activeTab === 'MyInterests' && isUserProfile && (
                        <ProfileMyInterests articleCollections={articleCollections} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Styleprofile;