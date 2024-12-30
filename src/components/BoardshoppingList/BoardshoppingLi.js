import React, { useState, useEffect } from "react";
import './BoardshoppingLi.css';
import Pagination from '../Pagination/Pagination.js';
import ProductListMenu from '../ProductListMenu/ProductListMenu.js';
import ShoppingList from './ShoppingList';  // ShoppingList 컴포넌트를 가져옵니다.
import { useLocation } from 'react-router-dom';

const BoardshoppingLi = () => {
    const itemsPerPage = 20; // 한 페이지당 표시할 항목 수
    const [items, setItems] = useState([]); // 전체 아이템 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [totalElements, setTotalElements] = useState(0);
    const [currentElements, setCurrentElements] = useState(0);
    const [totalPage, setTotalPage] = useState(1);
    const [filteredItems, setFilteredItems] = useState([]); // 필터링된 아이템 상태
    const [sortCondition, setSortCondition] = useState("newest");
    const location = useLocation(); // URL의 쿼리 파라미터를 가져옵니다.
    const categoryId = new URLSearchParams(location.search).get('category'); // categoryId 가져오기

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            
            try {
                // API 요청 URL 생성
                let url = `http://localhost:8080/api/v1/items?sort=${sortCondition}&page=${currentPage - 1}&size=${itemsPerPage}`;
                if (categoryId) {
                    url += `&category=${categoryId}`;
                }
    
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch items");
                }
    
                const data = await response.json();
                console.log("Fetched data:", data);
    
                // 데이터 상태 업데이트
                const updatedArticles = data.content.map((item) => ({
                    itemId: item.itemId,
                    itemCategory: item.itemCategory,
                    manufacturer: item.manufacturer,
                    name: item.name,
                    price: item.price,
                    // 경로 포매팅 유지
                    itemImage: item.repImgUrl.replace(
                        'C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\',
                        ''
                    ),
                    itemStatus: item.itemStatus,
                    seller: item.seller,
                    discountPercent: item.discountPercent,
                    discountPrice: item.discountPrice,
                }));
    
                setItems(updatedArticles);
                setTotalElements(data.totalElements);
                setTotalPage(data.totalPages);
                setCurrentElements(data.numberOfElements);
            } catch (error) {
                console.error("Error fetching items:", error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchItems();
    }, [categoryId, sortCondition, currentPage]); // currentPage, categoryId, sortCondition 변화에 따라 호출
    // currentPage 유지
    // 페이지네이션 계산


    // 페이지네이션 계산
    const totalItems = items;

    const totalPages = Math.ceil(totalItems.length / itemsPerPage); // 페이지 수 계산

    const currentItems = totalItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = (sort) => {
        setSortCondition(sort);
        setCurrentPage(1); // 정렬 변경 시 페이지 초기화
    };

    if (loading) {
        return <div>Loading...</div>; // 로딩 중일 때 표시
    }

    if (items.length === 0) {
        return (
            <div className="BoardshoppingLi_full_screen">
                <div className="BoardshoppingLi_Benner_list">
                    <div className="BoardshoppingLi_Benner_title">
                        <h2>SHOP</h2>
                    </div>
                </div>
                <div
                    style={{
                        width: "100%",
                        height: "500px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    등록된 상품이 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="BoardshoppingLi_full_screen">
            {/* ------------------배너------------------ */}
            <div>
                <div className="BoardshoppingLi_Benner_list">
                    <div className="BoardshoppingLi_Benner_title">
                        <h2>SHOP</h2>
                    </div>
                </div>
            </div>

            {/* ------------------상품 조회수 및 상품 조회------------------ */}
            <div>
                <ProductListMenu totalElements={totalElements} onSortChange={handleSortChange} currentSort={sortCondition} />
            </div>

            <div className="BoardshoppingLi_container">
                <div className="BoardshoppingLi_board_list_wrap">
                    <div className="BoardshoppingLi_board_list">
                        {/* ------------------아이템 카드------------------ */}
                        <ShoppingList items={items} />{/* ShoppingList에 items 전달 */}
                    </div>
                </div>
            </div>

            {/* ------------------페이지네이션------------------ */}
            <div className="Pagination_paging">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default BoardshoppingLi;     