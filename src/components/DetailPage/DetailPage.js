import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import './DetailPage.css';
import DetailInformation from "./DetailPageLement/DetailInformation.js";
import ProductSelector from "./DetailPageLement/DetailSelect.js";
import ScrollUp from '../ScrollUp/ScrollUp.js';

const DetailPage = () => {
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const itemId = queryParams.get("itemId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/items/${itemId}`);
                if (!response.ok) throw new Error("Failed to fetch item data");
                const data = await response.json();
                setItemData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [itemId]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러가 발생했습니다: {error}</div>;

    const isAdmin = itemData?.memberGrade === "SUPER_ADMIN" || itemData?.memberGrade === "ADMIN";

    // 슬라이더 이미지 이동 핸들러
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % itemData.imageUrls.length
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + itemData.imageUrls.length) % itemData.imageUrls.length
        );
    };

    return (
        <div className="DetailPage_full_screen">
            <div className="DetailPage_detail_page">
                {/* 상품 정보 */}
                <div className="DetailPage_product_detail">
                    {/* 이미지 슬라이더 */}
                    <div className="DetailPage_detail_img">
                        <img
                            src={itemData.imageUrls[currentImageIndex]}
                            alt={`상품 이미지 ${currentImageIndex + 1}`}
                            className="DetailPage_slider_image"
                        />
                        <button className="DetailPage_prev_button" onClick={handlePrevImage}>
                            ◀
                        </button>
                        <button className="DetailPage_next_button" onClick={handleNextImage}>
                            ▶
                        </button>
                    </div>
                    <div className="DetailPage_detail_text">
                        {/* 상세 정보 */}
                        <DetailInformation
                            product={{
                                productName: itemData.name,
                                productSeller: itemData.seller,
                                productPrice: itemData.price,
                                rewardRate: 0.01,
                                productDeliveryFee: 5000,
                                discountPercent: itemData.discountPercent,
                                discountPrice: itemData.discountPrice,
                            }}
                        />
                        {/* 사이즈 선택 */}
                        <ProductSelector
                            sizes={itemData.itemSizes}
                            product={{
                                productPrice: itemData.price,
                                productName: itemData.name,
                                rewardRate: 0.01,
                                discountPercent: itemData.discountPercent,
                                discountPrice: itemData.discountPrice,
                            }}
                        />
                        {/* 버튼 메뉴 */}
                        <div className="DetailPage_sub_button_menu">
                            <button className="DetailPage_like_button"><a href="#">좋아요</a></button>
                            <button className="DetailPage_basket_button"><a href="#">장바구니</a></button>
                            <button className="DetailPage_interest_product_button"><a href="#">관심상품</a></button>
                        </div>
                        {/* 관리자 권한 버튼 */}
                        {isAdmin && (
                            <div className="DetailPage_admin_buttons">
                                <button className="DetailPage_edit_button">수정</button>
                                <button className="DetailPage_delete_button">삭제</button>
                            </div>
                        )}
                    </div>
                </div>
                {/* 상세 설명 및 리뷰 */}
                <div className="DetailPage_product_detail_description">
                    <div className="DetailPage_button_product_detail_description">
                        <a href="#product_detail_description">상품상세설명</a>
                    </div>
                    <div className="DetailPage_button_review">
                        <a href="#review">후기</a>
                    </div>
                </div>
                <div className="DetailPage_text_product_detail_description" id="product_detail_description">
                    <div className="DetailPage_text_product_detail_description_img">
                        <img src={itemData.itemDetailImageUrl} alt="상세 이미지" />
                    </div>
                </div>
                {/* 리뷰 리스트 */}
                <div className="DetailPage_sns_style">
                    <div className="DetailPage_sns_style_title"><a href="#" id="review">스타일</a></div>
                </div>
                <div className="DetailPage_detail_page_review_list">
                    <ul className="DetailPage_detail_page_review_list_body">
                        <li className="DetailPage_detail_page_review_list_item">
                            <div className="DetailPage_detail_page_review_list_item_img">
                                <img src="https://fakeimg.pl/262x262/" alt="리뷰 이미지" />
                            </div>
                            <div className="DetailPage_detail_page_review_content">
                                <div className="DetailPage_detail_page_review_title">
                                    <img src="https://fakeimg.pl/26x26/" alt="" className="DetailPage_detail_page_review_title_img" />
                                    <span className="DetailPage_detail_page_review_title_id">아이디</span>
                                    <span className="DetailPage_detail_page_review_title_like">♡4</span>
                                </div>
                                <p className="DetailPage_detail_page_review_body_tag">
                                    #겨울코디추천 #아우터추천
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <ScrollUp />
            </div>
        </div>
    );
};

export default DetailPage;