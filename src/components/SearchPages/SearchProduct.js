import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchProduct.css";
import TotalSearchHead from "./TotalSearchHead.js";

const SearchProduct = () => {
    const [products, setProducts] = useState([]); // 상품 데이터 상태
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (0부터 시작)
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const [totalElements, setTotalElements] = useState(0); // 총 상품 수
    const [keyword, setKeyword] = useState(""); // 검색 키워드
    const [category, setCategory] = useState(""); // 카테고리 필터
    const pageSize = 20; // 한 페이지에 표시할 상품 수
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 정보 가져오기

    const handleItemClick = (itemId) => {
        navigate(`/DetailPage?itemId=${itemId}`);
    };

    // API 호출
    const fetchProducts = async (page) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/items?category=${category}&keyword=${keyword}&page=${page}&size=${pageSize}`
            );
            const data = await response.json();

            console.log(data);

            const products = data.content.map((product) => ({
                itemId: product.itemId,
                itemCategory: product.itemCategory,
                manufacturer: product.manufacturer,
                name: product.name,
                price: product.price,
                repImgUrl: product.repImgUrl.replace('C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\', ''),
                itemStatus: product.itemStatus,
                seller: product.seller,
                discountPercent: product.discountPercent,
                discountPrice: product.discountPrice,
            }));

            setProducts(products); // 상품 리스트 설정
            setTotalPages(data.totalPages); // 총 페이지 수 설정
            setTotalElements(data.totalElements); // 총 상품 수 설정
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // 페이지 변경 및 데이터 불러오기
    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, keyword, category]);

    // 검색 및 필터 핸들러
    const handleSearch = () => {
        setCurrentPage(0); // 검색 시 첫 페이지로 이동
        fetchProducts(0);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <>
            <TotalSearchHead />
            <section className="SearchProduct_container">
                {/* 상품 총 개수 및 페이징 정보 */}
                <div className="SearchProduct_summary" style={{ marginBottom: "10px" }}>
                    <h3>Total {totalElements} items</h3>
                </div>

                <div className="SearchProduct_board_list_wrap" style={{ marginBottom: "20px"}}>
                    <div className="SearchProduct_board_list" style={{ marginTop: "20px" }}>
                        <ul className="SearchProduct_board_list_body">
                            {products.map((product) => (
                                <li className="SearchProduct_item" key={product.itemId} style={{ textAlign: "center" }}
                                onClick={() => handleItemClick(product.itemId)}>
                                    <div className="SearchProduct_board_img">
                                        {product.itemStatus === "SOLD_OUT" && (
                                            <div className="SearchProduct_board_icon">
                                                <img
                                                    src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/upload/icon_201911181652054700.gif"
                                                    alt="품절"
                                                    className="SearchProduct_sold_out_icon"
                                                />
                                            </div>
                                        )}
                                        <img
                                            src={`/uploads/${product.repImgUrl}`} // 경로 수정
                                            alt={product.name}
                                            className="SearchProduct_product_img"
                                        />
                                    </div>
                                    <div className="SearchProduct_board_content">
                                        <div className="SearchProduct_board_title">
                                            <strong>{product.name}</strong>
                                        </div>
                                        <div className="SearchProduct_board_price">
                                            {product.discountPercent > 0 ? (
                                                <>
                                                    <span
                                                        className="original_price"
                                                        style={{ textDecoration: "line-through", color: "#aaa" }}
                                                    >
                                                        {product.price.toLocaleString()}원
                                                    </span>
                                                    <span
                                                        className="discount_info"
                                                        style={{ marginLeft: "8px", color: "#e74c3c" }}
                                                    >
                                                        {product.discountPercent}% → {product.discountPrice.toLocaleString()}원
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{product.price.toLocaleString()}원</span>
                                            )}
                                        </div>
                                        <div className="SearchProduct_board_name">
                                            {product.seller}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {/* 페이지 네비게이션 */}
                        {totalPages > 0 && ( // 페이지가 1개 이상일 때만 표시
                            <div
                                className="SearchProduct_pagination"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginTop: "20px",
                                    marginBottom: "20px",
                                }}
                            >
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: currentPage === 0 ? "#f0f0f0" : "#007bff",
                                        color: currentPage === 0 ? "#ccc" : "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: currentPage === 0 ? "not-allowed" : "pointer",
                                        transition: "background-color 0.3s ease",
                                    }}
                                >
                                    이전
                                </button>
                                <span style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                                    {currentPage + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: currentPage === totalPages - 1 ? "#f0f0f0" : "#007bff",
                                        color: currentPage === totalPages - 1 ? "#ccc" : "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                                        transition: "background-color 0.3s ease",
                                    }}
                                >
                                    다음
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </section>
        </>
    );
};

export default SearchProduct;
