import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchStyle.css";
import TotalSearchHead from "./TotalSearchHead.js";

const SearchStyle = () => {
    const [articles, setArticles] = useState([]); // 게시글 데이터 상태
    const [page, setPage] = useState(0); // 현재 페이지
    const [lastPage, setLastPage] = useState(false); // 마지막 페이지 여부
    const [loading, setLoading] = useState(false); // 로딩 상태
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 정보 가져오기
    const [keyword, setKeyword] = useState(""); // 검색 키워드 상태

    const queryParams = new URLSearchParams(location.search);
    const keywordFromUrl = queryParams.get("keyword"); // URL에서 키워드 가져오기
    const tag = queryParams.get("tag"); // URL에서 태그 가져오기
    const item = queryParams.get("itemId"); // URL에서 아이템 가져오기

    // URL에서 받은 키워드로 초기화
    useEffect(() => {
        if (keywordFromUrl) {
            setKeyword(keywordFromUrl);
        }
    }, [keywordFromUrl]);

    // Access Token 갱신 함수
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                throw new Error("Refresh Token이 없습니다.");
            }

            const response = await fetch("http://localhost:8080/api/v1/members/refresh-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Refresh-Token": refreshToken,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const newAccessToken = data.newToken;
                localStorage.setItem("accessToken", newAccessToken);
                return newAccessToken;
            } else {
                throw new Error("Access Token 갱신 실패");
            }
        } catch (error) {
            console.error(error);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            navigate("/login");
        }
    };

    // 게시글 데이터 로드 함수
    const fetchArticles = async () => {
        if (loading || lastPage) return; // 이미 로딩 중이거나 마지막 페이지인 경우 중단

        setLoading(true);
        try {
            let accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");
            const headers = {};

            if (accessToken && refreshToken) {
                accessToken = await refreshAccessToken(); // Access Token 갱신
                headers["Authorization"] = accessToken;
                headers["Refresh-Token"] = refreshToken;
            }

            const baseUrl = `http://localhost:8080/api/v1/articles`;
            const url = new URL(baseUrl);
            url.searchParams.append("page", page);
            url.searchParams.append("size", 12);

            // tag 또는 item이 존재할 경우 쿼리 파라미터 추가
            if (tag) {
                url.searchParams.append("tag", tag);
            } else if (item) {
                url.searchParams.append("itemId", item);
            } else if (keywordFromUrl) {
                url.searchParams.append("keyword", keywordFromUrl);
            }

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: headers,
            });

            if (response.ok) {
                const data = await response.json();
                const updatedArticles = data.content.map((article) => ({
                    articleId: article.articleId,
                    memberId: article.memberId,
                    memberName: article.memberName,
                    memberProfileImageUrl: article.memberProfileImageUrl
                        ? article.memberProfileImageUrl.replace(
                              "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                              ""
                          )
                        : null,
                    imageUrl: article.imageUrl.replace(
                        "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                        ""
                    ),
                    content: article.content,
                    likeCount: article.likeCount,
                    likeId: article.likeId,
                    viewCount: article.viewCount,
                    hashtags: article.hashtags || [],
                }));

                setArticles((prev) => [...prev, ...updatedArticles]); // 기존 게시글에 새 데이터 추가
                setLastPage(data.last); // 마지막 페이지 여부 설정
                setPage((prev) => prev + 1); // 페이지 증가
            } else if (response.status === 401) {
                await refreshAccessToken(); // 401 응답 시 토큰 갱신
            } else {
                throw new Error("게시글 조회 실패");
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setLoading(false);
        }
    };

    // 스크롤 이벤트 핸들링
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 200 >=
                document.documentElement.offsetHeight
            ) {
                fetchArticles(); // 스크롤 하단에 도달 시 데이터 로드
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, lastPage]);

    // 검색 조건(tag, item, keyword) 변경 시 데이터 초기화 및 로드
    useEffect(() => {
        setArticles([]); // 기존 데이터 초기화
        setPage(0); // 페이지 초기화
        setLastPage(false); // 마지막 페이지 상태 초기화
        fetchArticles(); // 데이터 로드
    }, [tag, item, keyword]);

    return (
        <>
            <TotalSearchHead />
            <div className="SearchStyle_sns_container">
                <ul className="SearchStyle_sns_list_body">
                    {articles.length === 0 ? (
                        <div className="SearchStyle_No_item">{keywordFromUrl} 스타일이 없습니다.</div>
                    ) : (
                        articles.map((article) => (
                            <li
                                key={article.articleId}
                                className="SearchStyle_sns_list_item"
                                onClick={() => navigate(`/StyleDetail?articleId=${article.articleId}`)}
                            >
                                <div className="SearchStyle_sns_profile">
                                    <div className="SearchStyle_sns_profile_img_box">
                                        <img
                                            src={
                                                article.memberProfileImageUrl
                                                    ? `/uploads/${article.memberProfileImageUrl}`
                                                    : "https://fakeimg.pl/50x50/"
                                            }
                                            alt={article.memberName}
                                            className="SearchStyle_sns_profile_img"
                                        />
                                    </div>
                                    <div className="SearchStyle_sns_profile_id_box">
                                        <span className="SearchStyle_sns_profile_id">{article.memberName}</span>
                                    </div>
                                </div>

                                <div className="SearchStyle_sns_list_item_img_box">
                                    <img
                                        src={
                                            article.imageUrl
                                                ? `/uploads/${article.imageUrl}`
                                                : "https://fakeimg.pl/150x150/"
                                        }
                                        alt={article.content}
                                        className="SearchStyle_sns_list_item_img"
                                    />
                                </div>
                                <div className="SearchStyle_sns_content">
                                    <div className="SearchStyle_sns_title">
                                        <p className="SearchStyle_sns_body_text">{article.content}</p>
                                        <span className="SearchStyle_sns_title_like">
                                            {article.likeId ? "❤️" : "♡"} {article.likeCount}
                                        </span>
                                    </div>

                                    <p className="SearchStyle_sns_body_tag">
                                        {article.hashtags.map((hashtag, index) => (
                                            <span key={index} className="SearchStyle_card_hashtag">
                                                {`${hashtag} `}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
                {loading && <p>로딩 중...</p>}
            </div>
        </>
    );
};

export default SearchStyle;