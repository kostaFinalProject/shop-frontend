import React from "react"
import './ProductListMenu.css';

const ProductListMenu = () => {
    return (
        <>
            {/* ------------------상품 조회수 및 상품 조회------------------ */}
            <div className="ProductListMenu_Product_ListMenu">
                <div className="ProductListMenu_prdCount">
                    total 
                    {/* <strong>{currentItems.length}</strong> */}
                     items
                </div>
                <div className="ProductListMenu_selectArray">
                    <div className="ProductListMenu_sort">
                        <select id="selArray" name="selArray" className="ProductListMenu_selArray">
                            <option value="" className="ProductListMenu_selArray_list">신상품</option>
                            <option value="" className="ProductListMenu_selArray_list">상품명</option>
                            <option value="" className="ProductListMenu_selArray_list">낮은가격</option>
                            <option value="" className="ProductListMenu_selArray_list">높은가격</option>
                            <option value="" className="ProductListMenu_selArray_list">제조사</option>
                            <option value="" className="ProductListMenu_selArray_list">사용후기</option>
                        </select>
                    </div>
                    <span className="ProductListMenu_selArray_displaynone">
                        <a href="#none" className="ProductListMenu_btnCompare" onClick={() => { }}>상품비교</a>
                    </span>
                </div>
            </div>
        </>

    );
};
export default ProductListMenu;