import React, { useState, useEffect } from 'react';
import './StyleDetail.css';
import { useParams, Link } from "react-router-dom"; // useParams 추가
import MoreView from "./MoreView";


const StyleDetail = () => {
    const { articleId } = useParams(); // URL에서 articleId 가져오기
    const [article, setArticle] = useState(null);  // 게시글 상태
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [error, setError] = useState(null);     // 오류 상태
    // 현재 이미지 인덱스 상태 관리
    const [currentIndex, setCurrentIndex] = useState(0);

    // 게시글 데이터 가져오는 함수
    const getArticle = async () => {
        const accessToken = localStorage.getItem("accessToken"); // 중복 선언 제거
        const refreshToken = localStorage.getItem("refreshToken");

        try {
            const response = await fetch(`http://localhost:8080/api/v1/articles/${articleId}`, {
                method: 'GET',
                headers: {
                    Authorization: accessToken,
                    "Refresh-Token": refreshToken,
                },
            });
            console.log("response 받아온 것 ", response)
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();


            setArticle(result);  // 게시글 데이터 설정
        } catch (error) {
            setError(error.message);  // 오류 처리
        } finally {
            setLoading(false);  // 로딩 종료
        }
    };

    // 컴포넌트가 처음 렌더링될 때 게시글 조회
    useEffect(() => {
        getArticle();
    }, [articleId]);

    console.log("article", article)
    // 로딩, 오류, 게시글 상태에 따른 UI 처리
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // article 데이터가 없으면 빈 화면 반환
    if (!article) return <div>No Article Data</div>;

    // 이미지 배열 (article에서 받아옴)
    const images = article.images && article.images.length > 0
        ? article.images
        : ["https://placehold.co/640x640?text=No+Image"];

    // ------------------------------------------------

    // 이미지 오른쪽으로 이동
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // 이미지 왼쪽으로 이동
    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };


    return (
        <>
            <div className="StyleDetail_fullScreen">
                <div className="StyleDetail_title">
                    {/* ---------------------social_head-----------------  */}
                    <div className="StyleDetail_head">
                        <div className="StyleDetail_profile_img">
                            <img src={article.memberProfileImageUrl} alt="Profile" />
                        </div>
                        <div className="StyleDetail_profile_text">
                            <p className="StyleDetail_profile_id">{article.memberName}</p>
                            <p className="StyleDetail_registration_time">{article.createdAt}</p>
                        </div>
                        <Link to={`/UpdateArticle/${articleId}`} >
                            <button className="StyleDetail_UpdateArticle_btn">수정</button>
                        </Link>
                        <button className="StyleDetail_follow_btn">팔로우</button>
                    </div>
                    {/* ----------------------social_body-----------------  */}
                    <div className="StyleDetail_body">
                        <div className="StyleDetail_ImageBox">
                            {/* 슬라이드 컨테이너 */}
                            <button className="StyleDetail_prev" onClick={prevImage}> &#8249; </button>

                            <div className="StyleDetail_main_img">
                                <div className="StyleDetail_image_slider">
                                    <img
                                        src={article.itemImage} // 안전하게 images 배열 사용
                                        alt="Main"
                                        className="StyleDetail_image_sliderImage"
                                    />
                                </div>
                            </div>

                            <button className="StyleDetail_next" onClick={nextImage}>  &#8250; </button>

                        </div>


                        {/* 페이지 표시 */}
                        <div className="StyleDetail_pagination">
                            {/* 이동 버튼 */}



                            {images.map((_, index) => (
                                <span
                                    key={index}
                                    className={`StyleDetail_dot ${index === currentIndex ? "active" : ""}`}>
                                    .
                                </span>
                            ))}

                        </div>



                    </div>
                </div>
                {/* ---------------------착용유니폼 쇼핑몰로 이동----------------- */}
                <div className='StyleDetail_Lookup'>
                    <div className='StyleDetail_Lookup_Title'>
                        <p>유니폼 구매하러 가기</p>
                    </div>
                    <div className='StyleDetail_Lookup_List'>
                        {/* 유니폼 추천 쇼핑핑 아이템 */}

                        <div className='StyleDetail_Lookup_List_Item'>
                            <div className='StyleDetail_Lookup_List_Img'>
                            <img src='https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202410/52ed697370f9b91cc6d778c027833f75.jpg' />

                             </div>

                            <div className='StyleDetail_Lookup_List_Content'>
                                <p>CDG Logo</p>
                            </div>
                            <div className='StyleDetail_Lookup_List_Price'>
                                <p>86,000원</p>
                            </div>
                        </div>

                    </div>
               </div>

                {/* ---------------------interest-----------------  */}
                <div className="StyleDetail_interest">
                    <div className="StyleDetail_interest_like"> <span>하트</span>{article.likeCount}</div>
                    <div className="StyleDetail_interest_attention"> <span>댓글</span>{article.commentCount}</div>
                    <div className="StyleDetail_interest_comment"><span>관심</span></div>
                </div>
                {/* ---------------------social_text-----------------     */}
                <div className="StyleDetail_social_text">
                    <h2 className="StyleDetail_text_title">{article.content}</h2>
                    <p className="StyleDetail_text_tag">  {article.hashtags ? article.hashtags.join(' ') : ''}</p>
                </div>
            </div>
            {/* ----------------------------social_container----------------------------  */}
            <div className="StyleDetail_social_container">
                <MoreView />
            </div>
        </>


    )
}

export default StyleDetail;
