import React from "react"
import './ProductListMenu.css';

const ProductListMenu = ({ totalElements }) => {


    return (
        <>
            {/* ------------------상품 조회수 및 상품 조회------------------ */}
            <div className="ProductListMenu_Product_ListMenu">
                <div className="ProductListMenu_prdCount">
                    <h3>Total {totalElements} items</h3>
                </div>
                <div className="ProductListMenu_selectArray">
                    <div className="ProductListMenu_sort">
                        <select id="selArray" 
                                name="selArray" 
                                className="ProductListMenu_selArray" >
                            <option value="latest" className="ProductListMenu_selArray_list">신상품</option>
                            <option value="priceLow" className="ProductListMenu_selArray_list">낮은가격</option>
                            <option value="priceHigh" className="ProductListMenu_selArray_list">높은가격</option>
                            <option value="discountHigh" className="ProductListMenu_selArray_list">할인율 높은순</option>
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