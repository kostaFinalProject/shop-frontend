import React from "react";
import './ShoppingList.css';
import { Link } from 'react-router-dom';

const ShoppingList = ({ items }) => {
    console.log("쇼핑리스트아이템페이지로 넘어온  items", items);
    return (
        <>
            {/* ------------------아이템 카드------------------  */}
            <ul className="BoardshoppingLi_board_list_body">
                {items.map(item => (
                    <li key={item.itemId} className="BoardshoppingLi_item">
                        <div className="BoardshoppingLi_board_img">
                            <div className="BoardshoppingLi_board_icon">
                                {item.soldOut && (
                                    <img
                                        src={item.soldOutImage}
                                        alt="품절"
                                        className="BoardshoppingLi_sold_out_icon"
                                    />
                                )}
                            </div>
                            <Link to={`/DetailPage?itemId=${item.itemId}`}>
                                <img
                                    src={item.soldOut ? item.soldOutImage : `/uploads/${item.itemImage}`}
                                    alt={item.name}
                                    className="BoardshoppingLi_product_img"
                                />
                            </Link>
                        </div>
                        <div className="BoardshoppingLi_board_content">
                            <div className="BoardshoppingLi_board_title">
                                <Link to={`/DetailPage?itemId=${item.itemId}`}>
                                    <strong>{item.name}</strong>
                                </Link>
                            </div>
                            <div className="BoardshoppingLi_board_price">

                                {item.discountPercent > 0 ? (
                                    <>
                                        <span className="BoardshoppingLi_original_price" >
                                            {item.price.toLocaleString()}원
                                        </span>
                                        <span className="BoardshoppingLi_discount_info" >
                                            {item.discountPercent}% → {item.discountPrice.toLocaleString()} 원
                                        </span>
                                    </>
                                ) : (
                                    <span className="BoardshoppingLi_discount_final">{item.price.toLocaleString()}원</span>
                                )}
                            </div>
                            <div className="BoardshoppingLi_board_name">{item.seller}</div>
                        </div>
                    </li>
                ))}
            </ul>

        </>


    );
};

export default ShoppingList;