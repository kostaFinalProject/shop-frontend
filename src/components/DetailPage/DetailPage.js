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
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 아이템
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [discountPercent, setDiscountPercent] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const itemId = queryParams.get("itemId");

    useEffect(() => {
        const fetchData = async () => {

            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            const initialHeaders = { "Content-Type": "application/json" };

            if (accessToken && refreshToken) {
                initialHeaders["Authorization"] = accessToken;
                initialHeaders["Refresh-Token"] = refreshToken;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/v1/items/${itemId}`, {
                    method: "GET",
                    headers: initialHeaders,
                });

                if (!response.ok) throw new Error("Failed to fetch item data");
                const data = await response.json();

                // 이미지 경로 수정
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

    const handleDiscountStop = async (discountId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/discounts/${discountId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("accessToken"),
                    "Refresh-Token": localStorage.getItem("refreshToken"),
                }
            });

            if (response.ok) {
                const message = await response.text(); // 서버에서 반환한 메시지 받기
                alert(message); // "할인이 종료되었습니다." 메시지 출력

                // 할인이 종료되었으므로 상태를 업데이트하거나 UI를 변경
                // 예: itemData.discountId를 null로 설정
                setItemData((prevData) => ({
                    ...prevData,
                    discountId: null,
                    discountPercent: 0,
                    discountPrice: itemData.price,
                }));
            } else {
                const errorData = await response.json();
                alert(errorData.message || "할인 중단 요청 실패");
            }
        } catch (error) {
            console.error("할인 중단 요청 실패:", error);
            alert("요청 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    // 할인 시작 버튼 클릭 시 호출
    const handleDiscountStart = () => {
        setIsModalOpen(true); // 모달 열기
    };

    // 할인 퍼센트 전송
    const handleDiscountSubmit = async () => {
        if (!discountPercent) {
            alert("할인 퍼센트를 입력해주세요.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/discounts/${itemData.itemId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("accessToken"),
                    "Refresh-Token": localStorage.getItem("refreshToken"),
                },
                body: JSON.stringify({ discountPercent: parseInt(discountPercent, 10) }),
            });

            if (response.ok) {
                const data = await response.json();

                setItemData((prevData) => ({
                    ...prevData,
                    discountId: data.discountId,
                    discountPercent: data.discountPercent,
                    discountPrice: data.discountPrice,
                }));
                alert("할인이 적용되었습니다!");
                setIsModalOpen(false); // 모달 닫기
                setDiscountPercent(""); // 입력 초기화
            } else {
                const errorData = await response.json();
                alert(`오류 발생: ${errorData.message}`);
            }
        } catch (error) {
            console.error("할인 요청 중 오류 발생:", error);
            alert("할인 요청에 실패했습니다. 다시 시도해주세요.");
        }
    };


    const handleArticleClick = (articleId) => {
        navigate(`/StyleDetail?articleId=${articleId}`);
    };

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
        navigate('/QnACreate', { state: { itemData } });
    };

    const handleOrderSubmit = () => {
        const accesstoken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accesstoken || !refreshToken) {
            alert("로그인이 필요한 기능입니다.");
            navigate("/login");
            return;
        }

        if (selectedItems.length === 0) {
            alert("상품을 선택해주세요.");
            return;
        }

        const orderData = {
            totalAmount: selectedItems.reduce(
                (acc, item) => acc + item.quantity * itemData.discountPrice,
                0
            ),
            shippingFee: 5000,
            items: selectedItems.map((item) => ({
                itemId: itemData.itemId, // 상품 ID
                imgUrl: itemData.itemDetailImageUrl, // 상품 이미지
                itemName: itemData.name, // 상품명
                manufacturer: itemData.manufacturer, // 제조사
                seller: itemData.seller, // 판매처
                itemSizeId: item.id, // 사이즈 ID
                size: item.name, // 사이즈 이름
                quantity: item.quantity, // 선택된 수량
                price: itemData.discountPrice, // 단가
            })),
        };

        navigate('/CheckoutPage', { state: orderData });
    };


    const handleItemsChange = (items) => {
        setSelectedItems(items); // 선택된 아이템 저장
    };

    const handleSizeChange = (items) => {
        setSelectedItems(items);
    };

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // 장바구니에 아이템 추가
    const handleAddToCart = () => {
        if (!selectedItems || selectedItems.length === 0) {
            alert("사이즈와 수량을 선택해주세요.");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken || !refreshToken) {
            alert("로그인이 필요한 기능입니다.");
            navigate("/login");
            return;
        }

        // 선택된 아이템 각각에 대해 요청 전송
        const requests = selectedItems.map((item) => {
            const cartData = {
                itemId: itemData.itemId, // 현재 상품 ID
                size: item.name,        // 선택된 사이즈 이름
                quantity: item.quantity // 선택된 수량
            };

            return fetch("http://localhost:8080/api/v1/carts", {
                method: "POST",
                headers: {
                    "Authorization": accessToken,
                    "Refresh-Token": refreshToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartData),
            });
        });

        // 모든 요청 처리
        Promise.all(requests)
            .then((responses) => {
                let allSuccessful = true;
                responses.forEach((response) => {
                    if (!response.ok) {
                        allSuccessful = false;
                    }
                });

                if (allSuccessful) {
                    alert("장바구니에 성공적으로 추가되었습니다.");
                } else {
                    alert("일부 상품 추가에 실패했습니다. 다시 시도해주세요.");
                }
            })
            .catch((error) => {
                console.error("장바구니 추가 중 오류 발생:", error);
                alert("서버 오류로 인해 장바구니 추가에 실패했습니다.");
            });
    };


    function handlewishlist(itemId) {
        // Fetch로 데이터 전송
        fetch(`http://localhost:8080/api/v1/wish-lists/${itemId}`, {
            method: 'POST',
            headers: {
                'Authorization': accessToken,
                'Refresh-Token': refreshToken,
            },
        })
            .then(response => {
                if (response.ok) {
                    alert("관심상품 등록이 완료되었습니다.");
                } else if (response.status === 409) {
                    // 이미 등록된 경우
                    alert("이미 등록된 관심상품입니다.");
                } else {
                    response.text().then(errorMessage => {
                        alert(`오류 발생: ${errorMessage}`);
                    });
                }
            })
            .catch(error => {
                console.error("Error during item registration:", error);
                alert("서버 오류로 인해 상품 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
            });
    }

    const handleDeleteItem = async () => {
        const confirmDelete = window.confirm("정말로 이 상품을 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/items/${itemData.itemId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': accessToken,
                    'Refresh-Token': refreshToken,
                },
            });

            if (response.ok) {
                alert("상품이 성공적으로 삭제되었습니다.");
                navigate("/BoardshoppingLi")
            } else {
                const errorData = await response.json();
                alert(`삭제 실패: ${errorData.message}`);
            }
        } catch (error) {
            console.error("삭제 요청 중 오류 발생:", error);
            alert("삭제 요청에 실패했습니다. 다시 시도해주세요.");
        }
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
            <div style={{ height: "50px" }}>관련된 스타일이 없습니다.</div>
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
                            {/* <button className="DetailPage_like_button"><a href="#">❤️</a></button> */}
                            <button
                                className="DetailPage_basket_button"
                                onClick={handleAddToCart}>
                                장바구니
                            </button>

                            <button className="DetailPage_interest_product_button" onClick={() => handlewishlist(itemData.itemId)}>
                                관심상품 등록
                            </button>
                        </div>
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
                        {/* {!isAdmin && (
                            <button id="review" onClick={handleGoToQnA}>상품 문의</button>
                        )} */}
                        <button id="review" onClick={handleGoToQnA}>상품 문의</button>
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

                {/* 관리자 권한 버튼 */}
                {isAdmin && (
                    <div
                        className="DetailPage_admin_buttons"
                        style={{ textAlign: "right", marginBottom: "20px" }}
                    >
                        {itemData.discountId ? (
                            <button
                                className="DetailPage_discount_button"
                                onClick={() => handleDiscountStop(itemData.discountId)}
                            >
                                할인 중단
                            </button>
                        ) : (
                            <button
                                className="DetailPage_discount_button"
                                onClick={handleDiscountStart} // 모달 열기
                            >
                                할인
                            </button>
                        )}
                        <button className="DetailPage_edit_button" onClick={() => navigate("/AdminPage/modifyProduct", { state: { itemData } })}>수정</button>
                        <button className="DetailPage_delete_button" onClick={handleDeleteItem}>삭제</button>

                        {/* 모달 */}
                        {isModalOpen && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h2>할인 퍼센트 입력</h2>
                                    <input
                                        type="number"
                                        value={discountPercent}
                                        onChange={(e) => setDiscountPercent(e.target.value)}
                                        placeholder="할인 퍼센트를 입력하세요"
                                    />
                                    <div className="modal-actions">
                                        <button className="discount_apply" onClick={handleDiscountSubmit}>적용</button>
                                        <button className="discount_cancel" onClick={() => setIsModalOpen(false)}>취소</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                <ScrollUp />
            </div>
        </div>
    );
};

export default DetailPage;