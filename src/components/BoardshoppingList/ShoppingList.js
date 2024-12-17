import React from "react";
import './ShoppingList.css';
import { Link } from "react-router-dom";
const ShoppingList = ({ items }) => {
    const discount = 30;
    return (
        <ul className="BoardshoppingLi_board_list_body">
            {items.map((item) => (
                // {Object.entries(items).map(([key, item]) => (
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
                        <Link to="/detailPage">
                            <img
                                // src={item.soldOut ? item.soldOutImage : item.imageUrl}
                                src={`/uploads/${item.itemImage}`}
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
                            {item.price && (
                                <span>{item.price.toLocaleString()}원</span>
                            )}
                            <span><strong>
                                {/* {item.salePrice} {salePrice} */}
                                {Math.floor(item.price * (1 - discount / 100)).toLocaleString()}원
                                </strong></span> 

                                <span><strong>
                                    {/* {item.discount} */}
                                 {discount}%</strong></span>
                                 
                            {/* {item.discount && (
                                <span><strong>
                                    {item.discount}  %</strong></span>
                            )} */}
                        </div>
                        <div className="BoardshoppingLi_board_name">
                            {item.manufacturer}
                            <br /> Official Licensed Product
                        </div>
                    </div>
                </li>


            ))}
        </ul>
    );
};

export default ShoppingList;
