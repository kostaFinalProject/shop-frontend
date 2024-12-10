import React, { useState } from "react";
import './BoardshoppingLi.css';
import ClubSelect from "./ClubSelect.js";
import Pagination from '../Pagination/Pagination.js';
import ProductListMenu from '../ProductListMenu/ProductListMenu.js';
import { items } from './ShoppingData.js';  // 데이터를 가져옵니다.
import ShoppingList from './ShoppingList';  // ShoppingList 컴포넌트를 가져옵니다.

const BoardshoppingLi = () => {
    const itemsPerPage = 8;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            {/* ------------------구단별 유니폼 찾기 버튼------------------ */}
            <div>
                <ClubSelect />
            </div>
            {/* ------------------상품 조회수 및 상품 조회------------------ */}
            <div>
                <ProductListMenu />
            </div>

            <div className="BoardshoppingLi_container">
                <div className="BoardshoppingLi_board_list_wrap">
                    <div className="BoardshoppingLi_board_list">
                        {/* ------------------아이템 카드------------------ */}
                        <ShoppingList items={currentItems} />  {/* ShoppingList에 items를 넘겨줍니다. */}
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
