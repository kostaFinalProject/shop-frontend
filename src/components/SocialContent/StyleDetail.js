import React, { useState, useEffect } from "react";
import './StyleDetail.css';
import './StyleComment/StyleComment'
import { Link, useLocation } from "react-router-dom";
import StyleComment from "./StyleComment/StyleComment";

const StyleDetail = () => {
    const [articleData, setArticleData] = useState(null); // 첫 번째 API 데이터
    const [memberArticles, setMemberArticles] = useState([]); // 두 번째 API 데이터
    const [currentIndex, setCurrentIndex] = useState(0); // 슬라이드 상태
    const [isCommentVisible, setIsCommentVisible] = useState(false); // 댓글 창 표시 상태
    const [comments, setComments] = useState([]); // 댓글 데이터
    const [currentUser, setCurrentUser] = useState(null); // 현재 사용자 설정 (예시)
    const [header, setHeader] = useState(null);
    const location = useLocation();
    const [articleCollections, setArticleCollections] = useState([]);
    const [isSaved, setIsSaved] = useState(false);

    // URL에서 articleId 추출
    const queryParams = new URLSearchParams(location.search);
    const articleId = queryParams.get("articleId");

    // 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const getHeaders = async () => {
        const headers = { "Content-Type": "application/json" };

        if (accessToken && refreshToken) {
            try {
                // refreshToken으로 accessToken 갱신 시도
                const newAccessToken = await refreshAccessToken(refreshToken);
                if (newAccessToken) {
                    localStorage.setItem("accessToken", newAccessToken);
                    headers["Authorization"] = newAccessToken; // Bearer 토큰 사용
                    headers["Refresh-Token"] = refreshToken;
                } else {
                    // 갱신 실패 시 로그아웃 처리
                    localStorage.clear(); // 로컬 스토리지 비우기
                    window.location.href = "/login"; // 로그인 페이지로 리디렉션
                    return null; // headers가 없는 경우 처리
                }
            } catch (error) {
                console.error("Error handling tokens:", error);
                localStorage.clear(); // 로컬 스토리지 비우기
                window.location.href = "/login"; // 로그인 페이지로 리디렉션
                return null; // headers가 없는 경우 처리
            }
        }

        return headers;
    };

    // refreshToken을 사용해 새로운 accessToken을 발급받는 함수
    const refreshAccessToken = async (refreshToken) => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/members/refresh-token", {
                method: "POST",
                headers: {
                    "Refresh-Token": refreshToken
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                return data.newToken; // 새로운 accessToken 반환
            } else {
                return null; // refreshToken으로도 갱신 실패
            }
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return null; // 갱신 실패
        }
    };

    // 댓글 창 토글
    const toggleComments = () => {
        setIsCommentVisible((prev) => !prev);
    };

    // 로그인한 사용자 정보 가져오기
    const fetchCurrentUser = async () => {
        const headers = await getHeaders();
        if (!headers) return;

        try {
            const response = await fetch("http://localhost:8080/api/v1/members", {
                method: "GET",
                headers: headers
            });

            console.log(response);
            if (response.status === 200) {
                const data = await response.json();
                setCurrentUser(data);
            } else {
                setCurrentUser(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setCurrentUser(null);
        }
    };


    useEffect(() => {
        const initializeHeader = async () => {
            const headers = await getHeaders();
            if (headers) setHeader(headers); // 헤더 상태 업데이트
        };

        initializeHeader();

        fetchCurrentUser();

        if (articleId) {
            const fetchData = async () => {
                const headers = await getHeaders(); // 비동기적으로 헤더를 가져옴
                if (!headers) return; // 헤더가 없으면 요청하지 않음

                try {
                    const response = await fetch(`http://localhost:8080/api/v1/articles/${articleId}`, {
                        method: "GET",
                        headers: headers,
                    });
                    const data = await response.json();
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
                        articleItems: data.articleItems,
                        content: data.content,
                        isFollowing: data.isFollowing,
                        likeCount: data.likeCount,
                        commentCount: data.commentCount,
                        likeId: data.likeId,
                        createdAt: data.createdAt,
                    };
                    console.log("data", data);
                    // console.log(articleData.articleItems);
                    setArticleData(processedData);

                    const memberArticlesResponse = await fetch(
                        `http://localhost:8080/api/v1/members/articles/${data.memberId}?page=0&size=4`,
                        {
                            method: "GET",
                            headers: headers,
                        }
                    );
                    const memberArticlesData = await memberArticlesResponse.json();
                    const processedMemberArticles = memberArticlesData.content.map((article) => ({
                        ...article,
                        imageUrl: article.imageUrl
                            ? article.imageUrl.replace(
                                "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                                ""
                            )
                            : article.imageUrl,
                    }));

                    setMemberArticles(processedMemberArticles);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [articleId]);

    // 게시글 collections 아이디 조회
    useEffect(() => {
        const fetchArticleCollections = async () => {
            try {
                const headers = await getHeaders(); // 인증 헤더 가져오기
                if (!headers) return;

                const response = await fetch(`http://localhost:8080/api/v1/members/article-collections`, {
                    method: "GET",
                    headers: headers,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Article Collections:", data);
                    setArticleCollections(data); // articleCollections 배열로 설정
                } else {
                    console.error("Error fetching article collections:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching article collections:", error);
            }
        };

        fetchArticleCollections();
    }, [articleId]); // articleId가 바뀔 때마다 articleCollections을 다시 가져오도록 의존성 추가


    // 이미지 슬라이드 제어
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (articleData?.images.length || 1));
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + (articleData?.images.length || 1)) % (articleData?.images.length || 1));
    };

    const handleLikeToggle = async () => {
        if (!accessToken && !refreshToken) {
            alert("로그인이 필요한 기능입니다.");
            window.location.href = '/login';
            return;
        }

        try {
            const headers = await getHeaders(); // 헤더를 비동기적으로 가져오기

            if (articleData.likeId) {
                // 좋아요 취소 API 호출
                const response = await fetch(`http://localhost:8080/api/v1/likes/articles/${articleData.likeId}`, {
                    method: "DELETE",
                    headers: headers, // getHeaders()로 받은 headers 사용
                });

                if (!response.ok) {
                    const errorResponse = await response.json(); // 서버에서 반환한 에러 메시지 확인
                    throw new Error(errorResponse.message || "Failed to delete like");
                }

                // 좋아요 취소 성공 시 상태 업데이트 (서버와 동기화)
                setArticleData({
                    ...articleData,
                    likeId: null, // 좋아요 취소 시 likeId를 null로 설정
                    likeCount: articleData.likeCount - 1,
                });
            } else {
                // 좋아요 추가 API 호출
                const response = await fetch(`http://localhost:8080/api/v1/likes/articles/${articleId}`, {
                    method: "POST",
                    headers: headers, // getHeaders()로 받은 headers 사용
                });

                if (!response.ok) {
                    const errorResponse = await response.json(); // 서버에서 반환한 에러 메시지 확인
                    throw new Error(errorResponse.message || "Failed to add like");
                }

                const data = await response.json(); // 서버 응답이 JSON일 경우

                // 좋아요 성공 시 상태 업데이트 (서버와 동기화)
                setArticleData({
                    ...articleData,
                    likeId: data.likeId, // 서버에서 반환된 likeId 사용
                    likeCount: articleData.likeCount + 1,
                });
            }
        } catch (error) {
            console.error("Error while handling like:", error);
        }
    };

    if (!articleData) {
        return <div>Loading...</div>; // 로딩 상태 표시
    }

    // 게시물 저장 로직 추가
    const handleSaveArticle = async () => {
        if (!accessToken && !refreshToken) {
            alert("로그인이 필요한 기능입니다.");
            window.location.href = '/login';
            return;
        }

        try {
            const headers = await getHeaders(); // 인증 헤더 가져오기
            if (!headers) return; // 헤더가 없으면 실행 중단

            const response = await fetch(`http://localhost:8080/api/v1/article-collections/${articleId}`, {
                method: "POST",
                headers: headers,
            });

            const responseData = await response.text(); // JSON이 아닌 텍스트로 받아오기

            // 응답이 JSON일 경우 처리
            let data;
            try {
                data = JSON.parse(responseData);
            } catch (e) {
                // JSON이 아닌 경우, 응답을 직접 처리
                alert(responseData); // 응답 메시지 그대로 알림으로 표시
                return;
            }

            if (response.status === 200) {
                // 저장 후 상태를 업데이트 (articleCollections에 새로 추가된 게시글 반영)
                // 게시글 데이터 가공
                const processedData = {
                    articleCollectionId: data.articleId, // 저장된 컬렉션 ID
                    articleId: articleData.articleId,
                    memberId: articleData.memberId,
                    memberName: articleData.memberName,
                    imageUrl: articleData.images[0] // 첫 번째 이미지 사용
                        ? articleData.images[0].replace(
                            "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                            ""
                        )
                        : null,
                    content: articleData.content,
                    likeCount: articleData.likeCount,
                    viewCount: 0, // 조회수는 필요에 따라 초기화
                    likeId: articleData.likeId,
                };

                // `articleCollections`에 새 게시글 추가
                setArticleCollections((prev) => {
                    const updatedContent = [...(prev.content || []), processedData];
                    return { ...prev, content: updatedContent };
                });
            } else {
                alert(`저장 실패: ${data.message || "오류 발생"}`);
            }
        } catch (error) {
            console.error("Error saving article:", error);
            alert("게시물을 저장하는 도중 오류가 발생했습니다.");
        }
    };

    const handleDeleteArticle = async () => {
        if (!accessToken && !refreshToken) {
            alert("로그인이 필요한 기능입니다.");
            window.location.href = '/login';
            return;
        }
        const articleCollectionId = Array.isArray(articleCollections.content)
            ? articleCollections.content.find(collection => String(collection.articleId) === String(articleId))?.articleCollectionId
            : null;

        if (articleCollectionId) {
            try {
                const headers = await getHeaders();
                if (!headers) return;

                const response = await fetch(`http://localhost:8080/api/v1/article-collections/${articleCollectionId}`, {
                    method: "DELETE",
                    headers: headers,
                });

                if (response.status === 200) {
                    // 삭제 후 상태 갱신 (삭제된 게시글을 상태에서 제거)
                    setArticleCollections((prevState) => ({
                        ...prevState,
                        content: prevState.content.filter(collection => collection.articleCollectionId !== articleCollectionId)
                    }));
                } else {
                    const errorData = await response.json();
                    alert(`삭제 실패: ${errorData.message || "오류 발생"}`);
                }
            } catch (error) {
                console.error("Error deleting article:", error);
                alert("게시물을 삭제하는 도중 오류가 발생했습니다.");
            }
        } else {
            alert("삭제할 게시글이 존재하지 않습니다.");
        }
    };

    const isArticleSaved = articleCollections?.content?.some(
        (collection) => String(collection.articleId) === String(articleId)
    );

    return (
        <>
            <div className="StyleDetail_fullScreen">
                <div className="StyleDetail_title">
                    {/* ---------------------social_head----------------- */}
                    <div className="StyleDetail_head">
                        <a href={`/Styleprofile?memberId=${articleData.memberId}`}>
                            <div className="StyleDetail_profile_img">
                                <img
                                    href=""
                                    src={articleData.memberProfileImageUrl ? `/uploads/${articleData.memberProfileImageUrl}` : "https://fakeimg.pl/50x50/"}
                                    alt=""
                                />
                            </div>
                            <div className="StyleDetail_profile_text">
                                <p className="StyleDetail_profile_id">{articleData.memberName}</p>
                                <p className="StyleDetail_registration_time">{new Date(articleData.createdAt).toLocaleDateString()}</p>
                            </div>
                        </a>

                    </div>
                    {/* ----------------------social_body----------------- */}
                    <div className="StyleDetail_body">
                        {/* 슬라이드 컨테이너 */}
                        <div className="StyleDetail_main_img_box">
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


                <div className='StyleDetail_Lookup'>
                    <div className='StyleDetail_Lookup_Title'>
                        <p>태그된 상품</p>
                    </div>
                    <div className="StyleDetail_Lookup_List">
                        {articleData.articleItems &&
                            articleData.articleItems
                                .filter((item) => item.itemStatus === "ACTIVE" || item.itemStatus === "SOLD_OUT") // ACTIVE나 SOLD_OUT인 아이템만 필터링
                                .map((item) => (
                                    <div key={item.itemId} className="StyleDetail_Lookup_List_Item">
                                        <Link to={`/DetailPage?itemId=${item.itemId}`}>
                                            <div className="StyleDetail_Lookup_List_Img_Box">
                                                {/* 이미지 렌더링 */}
                                                <img
                                                    className="StyleDetail_Lookup_List_Img"
                                                    src={`uploads/${item.imageUrl.replace(
                                                        "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                                                        ""
                                                    )}`}
                                                    alt={item.itemName}
                                                />
                                            </div>

                                            <div className="StyleDetail_Lookup_List_Content">
                                                {/* 아이템 이름 */}
                                                <p >{item.itemName}</p>
                                            </div>

                                            <div className="StyleDetail_Lookup_List_Price">
                                                {/* 가격 */}
                                                <p>￦ {item.price}원</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}

                    </div>
                </div>
                {/* ---------------------interest----------------- */}
                <div className="StyleDetail_interest">
                    <div
                        className="StyleDetail_interest_like"
                        onClick={handleLikeToggle}
                    >
                        <span >{articleData.likeId ? "❤️" : "♡"}</span>
                        {articleData.likeCount}
                    </div>
                    <div className="StyleDetail_interest_attention">
                        <span onClick={toggleComments}>💬</span>
                        {articleData.commentCount}
                    </div>
                    {isArticleSaved ? (
                        <div
                            className="StyleDetail_interest_comment"
                            onClick={handleDeleteArticle}
                        >
                            <div className="capture-button">
                                <span className="capture-icon">🟦</span>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="StyleDetail_interest_comment"
                            onClick={handleSaveArticle}
                        >
                            <div className="capture-button">
                                <span className="capture-icon">🔖</span>
                            </div>
                        </div>
                    )}
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
                            <Link to={`/UpdateArticle/${articleId}`} >
                                <button className="StyleDetail_edit_btn">수정</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>


            {/* ----------------------------social_container---------------------------- */}
            < div className="StyleDetail_social_container" >
                <div className="StyleDetail_container_title">
                    @{articleData.memberName}님의 다른 스타일
                    <Link to={`/Styleprofile?memberId=${articleData.memberId}`}>
                        <button className="StyleDetail_more_btn">더보기</button>
                    </Link>
                </div>
                <div className="StyleDetail_container_img">
                    {memberArticles.map((article) => (
                        <div key={article.articleId} style={{ width: "150px" }}>
                            <a href={`/StyleDetail?articleId=${article.articleId}`}>
                                <img src={`/uploads/${article.imageUrl}`} alt={article.content} />
                            </a>
                            <p className="StyleDetail_text_tag" style={{ marginBottom: "20px" }}>{article.hashtags.join(" ")}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 댓글 창 */}
            <StyleComment
                isVisible={isCommentVisible}
                onClose={toggleComments}
                articleData={articleData}
                setArticleData={setArticleData}
                comments={comments}
                setComments={setComments}
                currentUser={currentUser}
                header={header}
            />
        </>
    );
};

export default StyleDetail;