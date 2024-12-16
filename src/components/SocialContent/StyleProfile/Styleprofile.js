import React, { useState, useEffect } from "react";
import './Styleprofile.css';
import { useLocation } from "react-router-dom";
import ProfileDiv from "./ProfileDiv.js";
import ProfilePosts from './ProfilePosts.js';
import ProfileTags from './ProfileTags.js';

//data 가져오기
import { postsData } from "../PostsData/PostsData.js";
import { tagsData } from "../PostsData/TagsData.js";

const Styleprofile = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [headers, setHeaders] = useState(null); // 인증된 헤더 저장
    const [profile, setProfile] = useState(null); // 프로필 상태 추가
    const location = useLocation();

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const queryParams = new URLSearchParams(location.search);
    const memberId = queryParams.get("memberId");

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
                    memberIntroduction: data.memberIntroduction || "소개글이 없습니다.",
                    memberProfileImageUrl: data.memberProfileImageUrl
                        ? data.memberProfileImageUrl.replace(
                              "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                              ""
                          )
                        : "https://fakeimg.pl/150x150/",
                    memberStatus: data.memberStatus,
                    followerId: data.followerId || null,
                    articleCount: data.articleCount,
                    followeeCount: data.followeeCount,
                    followerCount: data.followerCount,
                };

                setProfile(processedData);
            } else {
                console.error("Error fetching profile:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

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

    return (
        <>
            <div className="Styleprofile_full_screen">
                {/* 프로필 컴포넌트로 데이터 전달 */}
                <ProfileDiv headers={headers} profile={profile} />

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
                </div>

                {/* 탭에 따라 컴포넌트 렌더링 */}
                <div className="Styleprofile_sns_container">
                    {activeTab === 'posts' ? (
                        <ProfilePosts headers={headers} profile={profile} />
                    ) : (
                        <ProfileTags headers={headers} profile={profile} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Styleprofile;
