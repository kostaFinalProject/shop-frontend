
import React, { useState, useEffect } from "react";
import './BoardshoppingLi.css';
import ClubSelect from "./ClubSelect.js";
import Pagination from '../Pagination/Pagination.js';
import ProductListMenu from '../ProductListMenu/ProductListMenu.js';
import ShoppingList from './ShoppingList';  // ShoppingList 컴포넌트를 가져옵니다.

const BoardshoppingLi = () => {
    const itemsPerPage = 8; // 한 페이지당 표시할 항목 수
    const [items, setItems] = useState([]); // 전체 아이템 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [loading, setLoading] = useState(true); // 로딩 상태

    // 데이터 가져오기
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true); // 로딩 시작
            try {
                const response = await fetch("http://localhost:8080/api/v1/items");
                if (!response.ok) {
                    throw new Error("Failed to fetch items");
                }
                const data = await response.json();
                console.log(data)
                // setItems(Object.values(data)); // 데이터 상태 업데이트
                const updatedArticles = data.content.map((item) => ({
                    ...item,
                    itemImage: item.repImgUrl.replace("C:\\uploads\\", "")
                }));
                setItems(updatedArticles); // 데이터 상태 업데이트
            } catch (error) {
                console.error("Error fetching items:", error.message);
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchItems();
    }, []); // 컴포넌트가 처음 렌더링될 때만 실행

    // 페이지네이션 계산
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const currentItems = items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div>Loading...</div>; // 로딩 중일 때 표시
    }

    return (
        <div className="BoardshoppingLi_full_screen">
            {/* ------------------배너------------------ */}
            <div>
                <div className="BoardshoppingLi_Benner_list">
                    <div className="BoardshoppingLi_Benner_title">
                        <h2>LIFE STYLE</h2>
                    </div>
                </div>
            </div>

            {/* ------------------상품 조회수 및 상품 조회------------------ */}
            <div>
                <ProductListMenu />
            </div>

            <div className="BoardshoppingLi_container">
                <div className="BoardshoppingLi_board_list_wrap">
                    <div className="BoardshoppingLi_board_list">
                        {/* ------------------아이템 카드------------------ */}
                        <ShoppingList items={currentItems} />  {/* ShoppingList에 items 전달 */}
                    </div>
                </div>
            </div>

            {/* ------------------페이지네이션------------------ */}
            <div>
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