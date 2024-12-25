import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './DetailPage.css';
import DetailInformation from "./DetailPageLement/DetailInformation.js";
import ProductSelector from "./DetailPageLement/ProductSelector.js";
import ScrollUp from '../ScrollUp/ScrollUp.js';

const DetailPage = () => {
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [articlesLoading, setArticlesLoading] = useState(true);
    const [articlesError, setArticlesError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
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
        navigate('/QnACreate', { state: { itemData } }); // QnAcreate 페이지로 이동하면서 itemData 전달
    };

    // 주문 API 호출을 위한 함수 추가
    const handleOrderSubmit = async () => {
        const orderItems = selectedItems.map(item => ({
            itemSizeId: item.id,
            count: item.quantity,
        }));

        const orderRequest = {
            orderItems: orderItems,
        };

        const accesstoken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accesstoken || !refreshToken) {
            alert("로그인이 필요한 기능입니다.")
            navigate("/login")
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accesstoken,
                    'Refresh-Token': refreshToken
                },
                body: JSON.stringify(orderRequest)
            });

            if (!response.ok) throw new Error('Failed to create order');

            alert("결제창으로 넘어갑니다.");

            const { orderId, amount } = await response.json(); 
            
            const IMP = window.IMP;
            IMP.init('imp81860065');

            IMP.request_pay(
                {
                    pg: "html5_inicis", // PG사 선택 (KG이니시스)
                    pay_method: "card", // 결제 수단
                    merchant_uid: `order_${orderId}`, // 주문 고유번호
                    name: "주문 상품명", // 상품명
                    amount: amount, // 결제 금액
                    buyer_email: "test@test.com", // 테스트용 이메일
                    buyer_name: "홍길동", // 테스트용 이름
                    buyer_tel: "010-1234-5678", // 테스트용 전화번호
                    buyer_addr: "서울특별시 강남구 삼성동", // 테스트용 주소
                    buyer_postcode: "123-456" // 테스트용 우편번호
                },
                async (response) => {
                    if (response.success) {
                        // 4. 결제 성공 시 서버로 결제 정보 전달
                        await fetch('http://localhost:8080/api/v1/payments', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': accesstoken,
                                'Refresh-Token': refreshToken
                            },
                            body: JSON.stringify({
                                orderId: orderId,
                                impUid: response.imp_uid,
                                orderPrice: amount
                            })
                        });
    
                        alert("결제가 완료되었습니다!");
                        navigate(`/detailPage?itemId=${itemId}`); // 결제 완료 페이지로 이동
                    } else {
                        // 결제 실패 처리
                        alert(`결제 실패: ${response.error_msg}`);
                    }
                }
            );

        } catch (error) {
            console.error('Order creation error:', error);
        }
    };

    const handleItemsChange = (items) => {
        setSelectedItems(items); // 선택된 아이템 저장
      };

    const renderRelatedArticles = () => {
        if (articlesLoading) return <div>스타일 정보를 로딩 중...</div>;
        if (articlesError) return <div>스타일 데이터를 불러오지 못했습니다: {articlesError}</div>;

        return relatedArticles.length > 0 ? (
            <div className="DetailPage_Style_More">
                <div className="DetailPage_Style_More_h3"><h3 >관련 스타일</h3></div>
                <ul className="DetailPage_Style_More_list">
                    {relatedArticles.map((article) => (
                        <li key={article.articleId} className="DetailPage_Style_More_item"
                            onClick={() => handleArticleClick(article.articleId)}>
                            <img src={`/uploads/${article.imageUrl}`} alt="스타일 이미지" className="DetailPage_Style_More_img" />
                            <div className="DetailPage_Style_More_content">
                               <div className="DetailPage_Style_More_p_box"><p>{article.content}</p></div> 
                                <div className="DetailPage_Style_More_hashtags">
                                    {article.hashtags.map((tag, index) => (
                                        <span key={index} className="DetailPage_Style_More_tag">
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
            <div>관련된 상품이 없습니다.</div>
        );
    };


    return (
        <div className="DetailPage_full_screen">
            <div className="DetailPage_detail_page">
                {/* 상품 정보 */}
                <div className="DetailPage_product_detail">
                    {/* 이미지 슬라이더 */}
                    <div className="DetailPage_detail_img">

                        <button className="DetailPage_prev_button" onClick={handlePrevImage}>
                            ◀
                        </button>
                        <div className="DetailPage_image_dot_box">
                            <img
                                src={`/uploads/${itemData.imageUrls[currentImageIndex]}`}
                                alt={`상품 이미지 ${currentImageIndex + 1}`}
                                className="DetailPage_slider_image"
                            />
                            {/* 페이지 표시 */}
                            <div className="DetailPage_pagination">
                                {itemData.imageUrls.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`DetailPage_dot ${index === currentImageIndex ? "active" : ""}`}
                                    >
                                        .
                                    </span>
                                ))}
                            </div>
                        </div>
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
                            onItemsChange={handleItemsChange}
                        />
                        {/* 바로 구매 버튼 추후에 서밋으로 결제창으로 넘겨야함함*/}
                        <button type="" className="BuyInformation_buyBtn" onClick={handleOrderSubmit}>
                            <p>바로구매</p>
                        </button>

                        {/* 버튼 메뉴 */}
                        <div className="DetailPage_sub_button_menu">
                            <button className="DetailPage_like_button"><a href="#">❤️</a></button>
                            <button className="DetailPage_basket_button"><a href="#">장바구니</a></button>
                            <button className="DetailPage_interest_product_button"><a href="#">📷</a></button>
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
                        <a href="#DetailPage_Join_Style">SNS</a>
                    </div>
                    <div className="DetailPage_button_Question">
                        {!isAdmin && (
                            <button id="review" onClick={handleGoToQnA}>상품 문의</button>
                        )}
                    </div>
                </div>

                <div className="DetailPage_text_product_detail_description" id="product_detail_description">
                    <div className="DetailPage_text_product_detail_description_img">
                        <img src={`/uploads/${itemData.itemDetailImageUrl}`} alt="상세 이미지" />
                    </div>
                </div>


                {/* 관련 스타일 */}
                <div className="DetailPage_Join_Style" id="DetailPage_Join_Style">
                {renderRelatedArticles()}
                </div>
                
                <ScrollUp />
            </div>
        </div>
    );
};

export default DetailPage;