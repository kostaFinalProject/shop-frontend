import React, { useEffect, useState } from "react";
import "./SearchProfile.css";
import TotalSearchHead from "./TotalSearchHead.js";
import { Link, useLocation } from "react-router-dom";

const SearchProfile = () => {
    const [members, setMembers] = useState([]); // 회원 데이터를 저장
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리
    const [keyword, setKeyword] = useState(""); // 검색 키워드
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keywordFromUrl = queryParams.get("keyword"); // URL에서 키워드 가져오기

    // URL에서 받은 키워드로 초기화
    useEffect(() => {
        if (keywordFromUrl) {
            setKeyword(keywordFromUrl);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                // localStorage에서 토큰 가져오기
                const accessToken = localStorage.getItem("accessToken");
                const refreshToken = localStorage.getItem("refreshToken");
                // 헤더 구성
                const headers = {
                    "Content-Type": "application/json",
                };
                if (accessToken) headers["Authorization"] = accessToken;
                if (refreshToken) headers["Refresh-Token"] = refreshToken;
                // API 호출
                const response = await fetch(`http://localhost:8080/api/v1/members/all?nickname=${keywordFromUrl}&page=0&size=30`, {
                    method: "GET",
                    headers,
                });
                if (!response.ok) {
                    throw new Error("데이터를 불러오는데 실패했습니다.");
                }
                const data = await response.json();
                // API 응답 데이터를 멤버 리스트에 매핑
                setMembers(data.content.map((member) => ({
                    id: member.memberId,
                    nickname: member.memberNickname,
                    profileImage: member.memberProfileImageUrl
                        ? member.memberProfileImageUrl.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", "")
                        : null, // null을 반환
                })));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생: {error}</div>;
    return (
        <>
            <TotalSearchHead />
            {/* --------------------------------각각의 본문-------------------- */}

            <div className="SearchProfile_full">
                {members.length === 0 ? (
                    <div className="SearchProfile_No_item" style={{
                        width: "100%",
                        height: "500px",
                        display: "flex",
                        justifyContent: "center", // 가로 중앙 정렬
                        alignItems: "center", // 세로 중앙 정렬
                        textAlign: "center",
                      }}>{keywordFromUrl} 프로필이 없습니다.</div>
                ) : (
                    members.map((member) => (
                        <div className="SearchProfile_pageline" key={member.id}>
                        <div className="SearchProfile_feed_user">
                            <div className="SearchProfile_user_img">
                                <img
                                    src={member.profileImage ? `/uploads/${member.profileImage}` : "https://fakeimg.pl/60x60/"}
                                    alt={member.nickname}
                                    style={{width: "60px", height: "60px"}}
                                />
                            </div>
                            <div className="SearchProfile_user_information">
                                <a href={`/StyleProfile?memberId=${member.id}`}>
                                    <div className="SearchProfile_user_id">{member.nickname}</div>
                                    <div className="SearchProfile_user_message">소개 메시지 없음</div>
                                </a>
                            </div>
                        </div>
                    </div>
                    ))
                )}
            </div >
        </>
    );
};

export default SearchProfile;
