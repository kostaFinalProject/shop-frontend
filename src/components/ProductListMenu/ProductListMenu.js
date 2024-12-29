import React from "react";
import './ProductListMenu.css';

const ProductListMenu = ({ totalElements, onSortChange, currentSort }) => {
    const handleSortChange = (e) => {
        onSortChange(e.target.value); // 선택된 정렬 조건을 부모로 전달
    };

    return (
        <div className="ProductListMenu_Product_ListMenu">
            <div className="ProductListMenu_prdCount">
                <h3>Total {totalElements} items</h3>
            </div>
            <div className="ProductListMenu_selectArray">
                <div className="ProductListMenu_sort">
                    <select
                        id="selArray"
                        name="selArray"
                        className="ProductListMenu_selArray"
                        value={currentSort}
                        onChange={handleSortChange} // 정렬 변경 이벤트 핸들러
                    >
                        <option value="newest">신상품</option>
                        <option value="lowest">낮은가격</option>
                        <option value="highest">높은가격</option>
                        <option value="discount">할인율 높은순</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ProductListMenu;
