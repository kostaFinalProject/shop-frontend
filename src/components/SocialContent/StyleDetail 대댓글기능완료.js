import React, { useState, useEffect } from "react";
import './StyleDetail.css';
import { Link } from "react-router-dom";
import MoreView from "./MoreView";
import StyleComment from "../StyleComment/StyleComment";

const StyleDetail = () => {
    // 이미지 배열
    const images = [
        "https://cdn.4mation.net/market/mainimage/sethb_72b2f7b4-6221-4b3d-8a64-319ba82bd7e1_1045x1436.jpeg",
        "https://placehold.co/640x640?text=Image+2",
        "https://placehold.co/640x640?text=Image+3",
        "https://placehold.co/640x640?text=Image+4",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCommentVisible, setIsCommentVisible] = useState(false); // 댓글 창 표시 상태
    const [comments, setComments] = useState([]); // 댓글 데이터
    const [currentUser, setCurrentUser] = useState("익명 사용자"); // 현재 사용자 설정 (예시)

    // 댓글 데이터 가져오기
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch("/api/v1/comments"); // 예제 API 엔드포인트
                const data = await response.json();


                // 댓글 데이터의 날짜 포맷팅
                const formattedComments = data.map(comment => {
                    const formattedDate = new Date(comment.date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\./g, '.'); // 2024.12.16 형태로

                    return { ...comment, formattedDate }; // 날짜를 포맷한 새로운 속성 추가
                });


                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, []);

    // 이미지 오른쪽으로 이동
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // 이미지 왼쪽으로 이동
    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // 댓글 창 토글
    const toggleComments = () => {
        setIsCommentVisible((prev) => !prev);
    };

    return (
        <>
            <div className="StyleDetail_fullScreen">
                <div className="StyleDetail_title">
                    {/* ---------------------social_head-----------------  */}
                    <div className="StyleDetail_head">
                        <div className="StyleDetail_profile_img"><img src="https://cdn.4mation.net/profile/image/tmdals4872_7de6ba24-cec8-4862-89f3-e303a4ff8e01.png?s=100x100&q=100" alt="" /></div>
                        <div className="StyleDetail_profile_text">
                            <p className="StyleDetail_profile_id">under_lapping </p>
                            <p className="StyleDetail_registration_time">2024년 8월 20일</p>
                        </div>

                        <button className="StyleDetail_follow_btn">팔로우</button>
                    </div>
                    {/* ----------------------social_body-----------------  */}
                    <div className="StyleDetail_body">
                        <div className="StyleDetail_ImageBox">
                            {/* 슬라이드 컨테이너 */}
                            <button className="StyleDetail_prev" onClick={prevImage}> &#8249; </button>

                            <div className="StyleDetail_main_img">
                                <div className="StyleDetail_image_slider">
                                    <img src={images[currentIndex]} alt="slider" className="StyleDetail_image_sliderImage" />
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

                {/* ---------------------interest-----------------  */}
                <div className="StyleDetail_interest">
                    <div className="StyleDetail_interest_like"><span>하트</span>11</div>
                    <div className="StyleDetail_interest_attention" onClick={toggleComments}><span>댓글</span></div>
                    <div className="StyleDetail_interest_comment"><span>관심</span></div>
                </div>
                {/* ---------------------social_text-----------------     */}
                <div className="StyleDetail_social_text">
                    <h2 className="StyleDetail_text_title">코듀로이의 계절 셔츠도 코듀로이로</h2>
                    <p className="StyleDetail_text_tag">#겨울데일리 #겨울코디추천 #아우터추천 #연말선물 #연말룩 #신발리뷰 #사이즈팁 #요즘신발 #KICKS #남자코디 #겨울남자코디 #남자겨울코디 #남자데일리룩</p>
                </div>
            </div>
            {/* ----------------------------social_container----------------------------  */}
            <div className="StyleDetail_social_container">
                <MoreView />
            </div>


            {/* 댓글 창 */}
            <StyleComment
                isVisible={isCommentVisible}
                onClose={toggleComments}
                comments={comments}
                setComments={setComments}
                currentUser={currentUser}
            />
        </>


    )
}

export default StyleDetail;
