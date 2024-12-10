import React, { useState } from "react";
import "./BoardshoppingSearch.css";
import Pagination from '../Pagination/Pagination.js';
import ProductListMenu from '../ProductListMenu/ProductListMenu.js'
import { items } from "../BoardshoppingList/ShoppingData.js";
import ShoppingList from  "../BoardshoppingList/ShoppingList.js";

const BoardshoppingSearch = () => {
    
    const itemsPerPage = 8;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 현재 페이지에 해당하는 아이템들만 필터링
    const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (

        <div className="BoardshoppingSearch_full_screen">
            {/* ------------------Search------------------ */}
            <div className="BoardshoppingSearch_Benner_list">
                {/* search */}
                <div className="BoardshoppingSearch_search">
                    <form action="">
                        <div className="BoardshoppingSearch_search_container">
                            <input className="BoardshoppingSearch_search_input" type="text" placeholder="Search" />
                        </div>
                    </form>
                </div>
            </div>



            {/* ------------------상품 조회수 및 상품 조회------------------ */}
            <div>
                <ProductListMenu />

            </div>


            <div className="BoardshoppingSearch_container">
                <div className="BoardshoppingSearch_board_list_wrap">
                    <div className="BoardshoppingSearch_board_list">
                        {/* ------------------아이템 카드------------------  */}
                       <ShoppingList items={currentItems} />
                    </div>
                </div>
            </div>

            {/* ---------------페이징 처리-------------  */}

            <div className="">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

        </div>
    );
};

export default BoardshoppingSearch;