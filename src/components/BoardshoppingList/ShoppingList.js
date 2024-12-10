import React from "react";
import './ShoppingList.css';
import { Link } from 'react-router-dom';

const ShoppingList = ({ items }) => {



    return (
        <>
            {/* ------------------아이템 카드------------------  */}
            <ul className="BoardshoppingLi_board_list_body">
                {items.map(item => (
                    <li key={item.id} className="BoardshoppingLi_item">
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
                            <Link to="/detailPage">
                                <img
                                    src={item.soldOut ? item.soldOutImage : item.imageUrl}
                                    alt={item.name}
                                    className="BoardshoppingLi_product_img"
                                />
                            </Link>
                        </div>
                        <div className="BoardshoppingLi_board_content">
                            <div className="BoardshoppingLi_board_title">
                                <a href="#">
                                    <strong>{item.name}</strong>
                                </a>
                            </div>
                            <div className="BoardshoppingLi_board_price">
                                {item.originalPrice && (
                                    <span>{item.originalPrice}</span>
                                )}
                                <span><strong>{item.salePrice}</strong></span>
                                {item.discount && (
                                    <span><strong>{item.discount}</strong></span>
                                )}
                            </div>
                            <div className="BoardshoppingLi_board_name">Official Licensed Product</div>
                        </div>
                    </li>
                ))}
            </ul>

        </>


    );
};

export default ShoppingList;
