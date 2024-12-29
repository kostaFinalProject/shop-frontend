import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './StyleMain.css';

const StyleMain = () => {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(0);
    const [lastPage, setLastPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState("likes");
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 정보 가져오기

    // URL에서 tag 또는 item 값 추출
    const queryParams = new URLSearchParams(location.search);
    const tag = queryParams.get("tag");
    const item = queryParams.get("item");
    const [isFirstVisit, setIsFirstVisit] = useState(true);

    useEffect(() => {
        // 페이지 처음 접속할 때만 '좋아요순'을 굵게 표시
        if (isFirstVisit) {
            setIsFirstVisit(false);
        }
    }, [isFirstVisit]);

    const handleArticleClick = (articleId) => {
        navigate(`/StyleDetail?articleId=${articleId}`);
    };

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

    const fetchArticles = async (newSort, reset = false) => {
        if (loading || (lastPage && !reset)) return;

        setLoading(true);
        try {
            let accessToken = localStorage.getItem("accessToken");
            let refreshToken = localStorage.getItem("refreshToken");

            const headers = {};

            if (accessToken && refreshToken) {
                accessToken = await refreshAccessToken();
                headers["Authorization"] = accessToken;
                headers["Refresh-Token"] = refreshToken;
            }

            const baseUrl = `http://localhost:8080/api/v1/articles`;
            const url = new URL(baseUrl);
            url.searchParams.append("page", reset ? 0 : page);
            url.searchParams.append("size", 12);
            if (newSort) {
                url.searchParams.append("sort", newSort); // 정렬 기준 추가
            }

            // tag 또는 item이 존재할 경우 쿼리 파라미터 추가
            if (tag) {
                url.searchParams.append("tag", tag);
            } else if (item) {
                url.searchParams.append("item", item);
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

                console.log(updatedArticles);

                setArticles((prev) => [...prev, ...updatedArticles]);
                setLastPage(data.last);
                setPage((prev) => prev + 1);
            } else if (response.status === 401) {
                await refreshAccessToken();
            } else {
                throw new Error("게시글 조회 실패");
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 200 >=
                document.documentElement.offsetHeight
            ) {
                fetchArticles();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, lastPage]);

    const handleSortChange = (newSort) => {
        if (newSort !== sort) { // 현재 정렬 기준과 다를 때만 변경
            setSort(newSort); // 정렬 기준 업데이트
            setPage(0); // 페이지 초기화
            setArticles([]); // 기존 게시글 초기화
            setLastPage(false); // 마지막 페이지 상태 초기화
            fetchArticles(newSort, true); // 데이터 초기화 후 새로 가져오기
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [tag, item]); // tag 또는 item이 변경될 때 데이터 새로 로드

    return (
        <>
            <div className="StyleMain_full_screen">
                {/* ------------------------- banner ------------------------ */}
                <div className="StyleMain_banner">
                    <h2 style={{ fontSize: "50px"}}>STYLE</h2>
                </div>
    
                {/* ------------------------ sorting ------------------------ */}
                <div className="StyleMain_sorting">
                    <span>
                        <a
                            onClick={() => handleSortChange("likes")}
                            className={sort === "likes" || (isFirstVisit && sort === "likes") ? "active" : ""}
                            style={{ 
                                fontWeight: (sort === "likes" || (isFirstVisit && sort === "likes")) ? 'bold' : 'normal',
                                cursor: 'pointer'
                            }}
                        >
                            좋아요순
                        </a>
                    </span>
                    <span>
                        <a
                            onClick={() => handleSortChange("newest")}
                            className={sort === "newest" ? "active" : ""}
                            style={{ 
                                fontWeight: sort === "newest" ? 'bold' : 'normal',
                                cursor: 'pointer'
                            }}
                        >
                            최신순
                        </a>
                    </span>
                </div>
            </div>
            {/* -------------------sns_container---------------- */}
            <div className="StyleMain_sns_container">
                {articles.length > 0 ? (
                    <ul className="StyleMain_sns_list_body">
                        {articles.map((article) => (
                            <li
                                key={article.articleId}
                                className="StyleMain_sns_list_item"
                                onClick={() => handleArticleClick(article.articleId)}
                            >
                                <div className="StyleMain_sns_profile" >
                                    <div className="StyleMain_sns_img_box">
                                        <img
                                            src={article.memberProfileImageUrl ? `/uploads/${article.memberProfileImageUrl}` : "https://fakeimg.pl/50x50/"}
                                            alt={article.memberName}
                                            className="StyleMain_sns_profile_img"
                                        />
                                    </div>
                                    <div className="StyleMain_sns_profile_id_box">
                                        <span className="StyleMain_sns_profile_id">{article.memberName}</span>
                                    </div>
                                </div>
    
                                <div className="StyleMain_sns_item_img_box">
                                    <img
                                        src={article.imageUrl ? `/uploads/${article.imageUrl}` : "https://fakeimg.pl/150x150/"}
                                        alt={article.content}
                                        className="StyleMain_sns_item_img"
                                    />
                                </div>
                                <div className="StyleMain_sns_content">
                                    <div className="StyleMain_sns_title">
                                        <p className="StyleMain_sns_body_text" >
                                            {article.content}
                                        </p>
                                        <span className="StyleMain_sns_title_like">
                                            {article.likeId ? "❤️" : "♡"} {article.likeCount}
                                        </span>
                                    </div>
    
                                    <p className="StyleMain_sns_body_tag">
                                        {article.hashtags.map((hashtag, index) => (
                                            <span key={index} className="StyleMain_sns_card_hashtag">
                                                {`${hashtag} `}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div
                        className="SearchStyle_No_item"
                        style={{
                            width: "100%",
                            height: "500px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                        }}
                    >
                        스타일이 없습니다.
                    </div>
                )}
                {loading && <p>로딩 중...</p>}
            </div>
        </>
    );    
};

export default StyleMain;
