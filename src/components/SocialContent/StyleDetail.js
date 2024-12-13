import React, { useState, useEffect } from "react";
import './StyleDetail.css';
import { Link, useLocation } from "react-router-dom";

const StyleDetail = () => {
    const [articleData, setArticleData] = useState(null); // 첫 번째 API 데이터
    const [memberArticles, setMemberArticles] = useState([]); // 두 번째 API 데이터
    const [currentIndex, setCurrentIndex] = useState(0); // 슬라이드 상태
    const location = useLocation();

    // URL에서 articleId 추출
    const queryParams = new URLSearchParams(location.search);
    const articleId = queryParams.get("articleId");

    // 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // 공통 헤더 생성 함수
    const getHeaders = () => {
        const headers = { "Content-Type": "application/json" };
        if (accessToken && refreshToken) {
            headers["Authorization"] = accessToken;
            headers["Refresh-Token"] = refreshToken;
        }
        return headers;
    };

    const handleEdit = () => {
        // 수정 로직 추가
        console.log("수정 버튼 클릭");
    };
    
    const handleDelete = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            // 삭제 API 호출 로직 추가
            console.log("삭제 버튼 클릭");
        }
    };
    

    useEffect(() => {
        if (articleId) {
            fetch(`http://localhost:8080/api/v1/articles/${articleId}`, {
                method: "GET",
                headers: getHeaders(),
            })
                .then((response) => response.json())
                .then((data) => {
                    // 경로 변환
                    const processedData = {
                        articleId: data.articleId,
                        memberId: data.memberId,
                        memberName: data.memberName,
                        memberProfileImageUrl: data.memberProfileImageUrl ? data.memberProfileImageUrl.replace(
                            "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                            "") : null,
                        images: data.images.map((image) =>
                            image.replace(
                                "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                                ""
                            )
                        ),
                        hashtags: data.hashtags,
                        content: data.content,
                        isFollowing: data.isFollowing,
                        likeCount: data.likeCount,
                        commentCount: data.commentCount,
                        likeId: data.likeId,
                        createdAt: data.createdAt,
                    };

                    console.log(processedData);

                    setArticleData(processedData);

                    // 두 번째 API 호출
                    return fetch(
                        `http://localhost:8080/api/v1/members/articles/${data.memberId}?page=0&size=4`,
                        {
                            method: "GET",
                            headers: getHeaders(),
                        }
                    );
                })
                .then((response) => response.json())
                .then((data) => {
                    // 각 항목에 대해 경로 변환
                    const processedMemberArticles = data.content.map((article) => ({
                        ...article,
                        imageUrl: article.imageUrl
                            ? article.imageUrl.replace(
                                "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                                ""
                            )
                            : article.imageUrl,
                    }));
                    setMemberArticles(processedMemberArticles);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [articleId]);


    // 이미지 슬라이드 제어
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (articleData?.images.length || 1));
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + (articleData?.images.length || 1)) % (articleData?.images.length || 1));
    };

    if (!articleData) {
        return <div>Loading...</div>; // 로딩 상태 표시
    }

    return (
        <>
            <div className="StyleDetail_fullScreen">
                <div className="StyleDetail_title">
                    {/* ---------------------social_head----------------- */}
                    <div className="StyleDetail_head">
                        <div className="StyleDetail_profile_img">
                            <img
                                src={articleData.memberProfileImageUrl ? `/uploads/${articleData.memberProfileImageUrl}` : "https://fakeimg.pl/50x50/"}
                                alt=""
                            />
                        </div>
                        <div className="StyleDetail_profile_text">
                            <p className="StyleDetail_profile_id">{articleData.memberName}</p>
                            <p className="StyleDetail_registration_time">{new Date(articleData.createdAt).toLocaleDateString()}</p>
                        </div>

                        {articleData.isFollowing === "Me" ? null : (
                            <button
                                className="StyleDetail_follow_btn"
                                style={{
                                    backgroundColor: articleData.isFollowing === "Follower" ? "blue" : "white",
                                    color: articleData.isFollowing === "Follower" ? "white" : "black",
                                }}
                            >
                                {articleData.isFollowing === "Not Follower" ? "팔로우" : "팔로잉"}
                            </button>
                        )}
                    </div>
                    {/* ----------------------social_body----------------- */}
                    <div className="StyleDetail_body">
                        {/* 슬라이드 컨테이너 */}
                        <div className="StyleDetail_main_img">
                            <div className="StyleDetail_image_slider">
                                <img
                                    src={`/uploads/${articleData.images[currentIndex]}`}
                                    alt="slider"
                                    className="StyleDetail_image_sliderImage"
                                />
                            </div>

                            {/* 페이지 표시 */}
                            <div className="StyleDetail_pagination">
                                {articleData.images.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`StyleDetail_dot ${index === currentIndex ? "active" : ""}`}
                                    >
                                        .
                                    </span>
                                ))}
                            </div>

                            {/* 이동 버튼 */}
                            <button className="StyleDetail_prev" onClick={prevImage}>
                                &#8249;
                            </button>
                            <button className="StyleDetail_next" onClick={nextImage}>
                                &#8250;
                            </button>
                        </div>
                    </div>
                </div>

                {/* ---------------------interest----------------- */}
                <div className="StyleDetail_interest">
                    <div className="StyleDetail_interest_like">
                        <span style={{ fontSize: "15px" }}>{articleData.likeId ? "❤️" : "♡"}</span>
                        {articleData.likeCount}
                    </div>
                    <div className="StyleDetail_interest_attention">
                        <span>댓글</span>
                        {articleData.commentCount}
                    </div>
                    <div className="StyleDetail_interest_comment">
                        <span>관심</span>
                    </div>
                </div>

                {/* ---------------------social_text----------------- */}
                <div className="StyleDetail_social_text">
                    <div>
                        <h2 className="StyleDetail_text_title">{articleData.content}</h2>
                        <p className="StyleDetail_text_tag">{articleData.hashtags.join(" ")}</p>
                    </div>
                    {/* ---------------------수정, 삭제 버튼----------------- */}
                    {articleData.isFollowing === "Me" && (
                    <div className="StyleDetail_edit_buttons">
                        <button className="StyleDetail_edit_btn" onClick={handleEdit}>수정</button>
                        <button className="StyleDetail_delete_btn" onClick={handleDelete}>삭제</button>
                    </div>
                )}
                </div>
            </div>

            {/* ----------------------------social_container---------------------------- */}
            <div className="StyleDetail_social_container">
                <div className="StyleDetail_container_title">
                    @{articleData.memberName}님의 다른 스타일
                    <Link to="/Styleprofile">
                        <button className="more_btn">더보기</button>
                    </Link>
                </div>
                <div className="StyleDetail_container_img">
                    {memberArticles.map((article) => (
                        <div key={article.articleId}>
                            <a href={`/StyleDetail?articleId=${article.articleId}`}>
                                <img src={`/uploads/${article.imageUrl}`} alt={article.content} style={{ marginRight: "5px" }} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default StyleDetail;
