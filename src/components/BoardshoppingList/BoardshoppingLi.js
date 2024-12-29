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
    const [filteredItems, setFilteredItems] = useState([]); // 필터링된 아이템 상태
    const [sortCondition, setSortCondition] = useState("newest");
    const location = useLocation(); // URL의 쿼리 파라미터를 가져옵니다.
    const categoryId = new URLSearchParams(location.search).get('category'); // categoryId 가져오기

    // 데이터 가져오기
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true); // 로딩 시작
            try {
                let url = `http://localhost:8080/api/v1/items?sort=${sortCondition}&page=${currentPage - 1}&size=${itemsPerPage}`;

                // categoryId가 있으면 URL에 category 파라미터 추가
                if (categoryId) {
                    url += `&category=${categoryId}`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Failed to fetch items");
                }
                const data = await response.json();
                console.log("Fetched data:", data); // 전체 데이터 로그 출력
                // setItems(Object.values(data)); // 데이터 상태 업데이트
                const updatedArticles = data.content.map((item) => ({


                    itemId: item.itemId,
                    itemCategory: item.itemCategory,
                    manufacturer: item.manufacturer,
                    name: item.name,
                    price: item.price,
                    itemImage: item.repImgUrl.replace('C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\', ''),
                    itemStatus: item.itemStatus,
                    seller: item.seller,
                    discountPercent: item.discountPercent,
                    discountPrice: item.discountPrice,
                }));

                console.log("updatedArticles", updatedArticles)
                // 전체 아이템 상태 업데이트
                setItems(updatedArticles);
                setTotalElements(data.totalElements);

                console.log("updatedArticles", updatedArticles);

                // categoryId로 아이템 필터링
                if (categoryId) {
                    // categoryId로 아이템 필터링 (item은 data.content 배열의 각 항목입니다)
                    const filtered = updatedArticles.filter((item) => item.itemCategory === categoryId);

                    setFilteredItems(filtered); // 필터링된 아이템 상태 업데이트
                    setTotalElements(filtered.length);

                    console.log("filtered data:", filtered); // 전체 데이터 로그 출력
                } else {
                    setFilteredItems(updatedArticles); // categoryId가 없으면 모든 아이템을 필터링
                    setTotalElements(updatedArticles.length);
                }

                // 페이지 초기화
                setCurrentPage(1);
            } catch (error) {
                console.error("Error fetching items:", error.message);
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchItems();
    }, [categoryId, sortCondition, currentPage, location]); // categoryId나 location 변경 시 fetchItems 재실행

    // 페이지네이션 계산
    useEffect(() => {
        setCurrentPage(1); // 필터링 후 페이지 초기화
    }, [filteredItems]);


    // 페이지네이션 계산
    const totalItems = filteredItems.length > 0 ? filteredItems : items;

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

    if (totalItems.length === 0) {
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
                        <ShoppingList items={currentItems} />{/* ShoppingList에 items 전달 */}
                    </div>
                </div>
            </div>

            {/* ------------------페이지네이션------------------ */}
            <div className="Pagination_paging">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default BoardshoppingLi;     