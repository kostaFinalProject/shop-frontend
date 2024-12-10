import React, { useState } from "react";
import './StyleDetail.css';
import { Link } from "react-router-dom";

const StyleDetail = () => {

    // 이미지 배열
    const images = [
        "https://cdn.4mation.net/market/mainimage/sethb_72b2f7b4-6221-4b3d-8a64-319ba82bd7e1_1045x1436.jpeg",
        "https://placehold.co/640x640?text=Image+2",
        "https://placehold.co/640x640?text=Image+3",
        "https://placehold.co/640x640?text=Image+4",
    ];

    // 현재 이미지 인덱스 상태 관리
    const [currentIndex, setCurrentIndex] = useState(0);

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
                        <div className="StyleDetail_profile_img"><img src="https://cdn.4mation.net/profile/image/tmdals4872_7de6ba24-cec8-4862-89f3-e303a4ff8e01.png?s=100x100&q=100" alt="" /></div>
                        <div className="StyleDetail_profile_text">
                            <p className="StyleDetail_profile_id">under_lapping </p>
                            <p className="StyleDetail_registration_time">2024년 8월 20일</p>
                        </div>

                        <button className="StyleDetail_follow_btn">팔로우</button>
                    </div>
                    {/* ----------------------social_body-----------------  */}
                    <div className="StyleDetail_body">

                        {/* 슬라이드 컨테이너 */}
                        <div className="StyleDetail_main_img">
                            <div className="StyleDetail_image_slider">
                                <img src={images[currentIndex]} alt="slider" className="StyleDetail_image_sliderImage" />
                            </div>

                            {/* 페이지 표시 */}
                            <div className="StyleDetail_pagination">
                                {images.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`StyleDetail_dot ${index === currentIndex ? "active" : ""}`}>
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

                {/* ---------------------interest-----------------  */}
                <div className="StyleDetail_interest">
                    <div className="StyleDetail_interest_like"><span>하트</span>11</div>
                    <div className="StyleDetail_interest_attention"><span>댓글</span></div>
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
                <div className="StyleDetail_container_title">@j_0_x_0님의 다른 스타일
                    <Link to="/Styleprofile">
                        <button className="more_btn">더보기</button>
                    </Link>
                                
                </div>
                <div className="StyleDetail_container_img">
                    <div><a href="#"><img src="https://cdn.4mation.net/market/mainimage/sethb_72b2f7b4-6221-4b3d-8a64-319ba82bd7e1_1045x1436.jpeg" alt="" /></a></div>
                    <div><a href="#"><img src="https://fakeimg.pl/150x200/" alt="" /></a></div>
                    <div><a href="#"><img src="https://fakeimg.pl/150x200/" alt="" /></a></div>
                    <div><a href="#"><img src="https://fakeimg.pl/150x200/" alt="" /></a></div>
                </div>
            </div>
        </>


    )
}

export default StyleDetail;
