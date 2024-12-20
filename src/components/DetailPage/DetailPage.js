import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './DetailPage.css';
import DetailInformation from "./DetailPageLement/DetailInformation.js";
import ProductSelector from "./DetailPageLement/DetailSelect.js";
import ScrollUp from '../ScrollUp/ScrollUp.js';

const DetailPage = () => {
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [articlesLoading, setArticlesLoading] = useState(true);
    const [articlesError, setArticlesError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const itemId = queryParams.get("itemId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/items/${itemId}`);
                if (!response.ok) throw new Error("Failed to fetch item data");
                const data = await response.json();

                // 이미지 경로 직접 수정
                data.imageUrls = data.imageUrls.map((url) =>
                    url.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", "")
                );
                data.itemDetailImageUrl = data.itemDetailImageUrl.replace(
                    "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                    ""
                );

                setItemData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [itemId]);


    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/articles?itemId=${itemId}&size=4`);
                if (!response.ok) throw new Error("Failed to fetch related articles");
                const data = await response.json();

                // 이미지 경로 직접 수정
                const formattedArticles = data.content.map((article) => ({
                    ...article,
                    imageUrl: article.imageUrl.replace(
                        "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                        ""
                    ),
                }));

                setRelatedArticles(formattedArticles);
            } catch (err) {
                setArticlesError(err.message);
            } finally {
                setArticlesLoading(false);
            }
        };

        if (itemId) fetchArticles();
    }, [itemId]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러가 발생했습니다: {error}</div>;

    const isAdmin = itemData?.memberGrade === "SUPER_ADMIN" || itemData?.memberGrade === "ADMIN";

    const handleArticleClick = (articleId) => {
        navigate(`/StyleDetail?articleId=${articleId}`);
    };

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

    const handleGoToQnA = () => {
        navigate('/QnAcreate', { state: { itemData } }); // QnAcreate 페이지로 이동하면서 itemData 전달
    };

    const renderRelatedArticles = () => {
        if (articlesLoading) return <div>스타일 정보를 로딩 중...</div>;
        if (articlesError) return <div>스타일 데이터를 불러오지 못했습니다: {articlesError}</div>;

        return relatedArticles.length > 0 ? (
            <div className="DetailPage_related_articles">
                <h3>관련 스타일</h3>
                <ul className="DetailPage_related_articles_list">
                    {relatedArticles.map((article) => (
                        <li key={article.articleId} className="DetailPage_related_article_item"
                            onClick={() => handleArticleClick(article.articleId)}>
                            <img src={`/uploads/${article.imageUrl}`} alt="스타일 이미지" className="DetailPage_related_article_image" />
                            <div className="DetailPage_related_article_content">
                                <p>{article.content}</p>
                                <div className="DetailPage_related_article_hashtags">
                                    {article.hashtags.map((tag, index) => (
                                        <span key={index} className="DetailPage_related_article_tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <div>관련된 스타일이 없습니다.</div>
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
                            src={`/uploads/${itemData.imageUrls[currentImageIndex]}`}
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
                        <img src={`/uploads/${itemData.itemDetailImageUrl}`} alt="상세 이미지" />
                    </div>
                </div>
                {/* 관련 스타일 */}
                {renderRelatedArticles()}
                <ScrollUp />


                {!isAdmin && (
                    <button onClick={handleGoToQnA}>상품 문의</button>
                )}
            </div>


        </div>
    );
};

export default DetailPage;