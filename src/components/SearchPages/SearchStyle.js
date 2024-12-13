import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchStyle.css";
import TotalSearchHead from "./TotalSearchHead.js";

const SearchStyle = () => {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(0);
    const [lastPage, setLastPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 정보 가져오기

    // URL에서 tag 또는 item 값 추출
    const queryParams = new URLSearchParams(location.search);
    const tag = queryParams.get("tag");
    const item = queryParams.get("item");

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

    const fetchArticles = async () => {
        if (loading || lastPage) return;

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
            url.searchParams.append("page", page);
            url.searchParams.append("size", 12);

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

    useEffect(() => {
        fetchArticles();
    }, [tag, item]); // tag 또는 item이 변경될 때 데이터 새로 로드

    return (
        <>
            <TotalSearchHead />
            <div className="SearchStyle_sns_container">
                <ul className="SearchStyle_detail_page_review_list_body">
                    {articles.map((article) => (
                        <li
                            key={article.articleId}
                            className="SearchStyle_detail_page_review_list_item"
                            onClick={() => handleArticleClick(article.articleId)}
                        >
                            <div className="SearchStyle_detail_page_review_title" style={{ margin: "5px" }}>
                                <img
                                    src={article.memberProfileImageUrl ? `/uploads/${article.memberProfileImageUrl}` : "https://fakeimg.pl/50x50/"}
                                    alt={article.memberName}
                                    className="SearchStyle_detail_page_review_title_img"
                                />
                                <span className="SearchStyle_detail_page_review_title_id">{article.memberName}</span>
                            </div>
                            <div className="SearchStyle_detail_page_review_list_item_img">
                                <img
                                    style={{ borderStyle: "solid", borderRadius: "0", width: "280px", height: "280px" }}
                                    src={article.imageUrl ? `/uploads/${article.imageUrl}` : "https://fakeimg.pl/150x150/"}
                                    alt={article.content}
                                    className="SearchStyle_detail_page_review_list_item_img_img"
                                />
                            </div>
                            <div className="SearchStyle_detail_page_review_content">
                                <div className="SearchStyle_detail_page_review_title">
                                    <p className="SearchStyle_detail_page_review_body_text" style={{ paddingRight: "165px" }}>
                                        {article.content}
                                    </p>
                                    <span className="SearchStyle_detail_page_review_title_like">
                                        {article.likeId ? "❤️" : "♡"} {article.likeCount}
                                    </span>
                                </div>

                                <p className="SearchStyle_detail_page_review_body_tag">
                                    {article.hashtags.map((hashtag, index) => (
                                        <span key={index} className="SearchStyle_card_hashtag">
                                            {`${hashtag} `}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
                {loading && <p>로딩 중...</p>}
            </div>
        </>
    );
};

export default SearchStyle;
