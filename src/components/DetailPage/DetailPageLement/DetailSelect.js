import React, { useState, useEffect } from "react";
import "./DetailSelect.css";

const ProductSelector = ({ sizes, product }) => {
    const [items, setItems] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // 실제 적용 가격 (할인이 있으면 discountPrice, 없으면 productPrice)
    const appliedPrice = product.discountPercent > 0 ? product.discountPrice : product.productPrice;

    useEffect(() => {
        const newTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const newTotalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalQuantity(newTotalQuantity);
        setTotalAmount(newTotalAmount);
    }, [items]);

    const handleSizeSelect = (event) => {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const sizeId = selectedOption.value;
        const sizeName = selectedOption.text;

        if (sizeId === "*" || sizeName.includes("[품절]")) {
            alert("유효한 옵션을 선택해주세요.");
            event.target.value = "*";
            return;
        }

        if (items.some((item) => item.id === sizeId)) {
            alert("이미 선택한 옵션입니다.");
            event.target.value = "*";
            return;
        }

        const newItem = {
            id: sizeId,
            name: sizeName,
            price: appliedPrice, // 적용된 가격 사용
            quantity: 1,
        };

        setItems((prevItems) => [...prevItems, newItem]);
        event.target.value = "*";
    };

    const updateItemQuantity = (itemId, qtyChange) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: Math.max(1, item.quantity + qtyChange) }
                    : item
            )
        );
    };

    const removeItem = (itemId) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    return (
        <>
            <div className="SizeSelection_inner">
                <div className="SizeSelection_option">
                    <span>사이즈</span>
                    <select onChange={handleSizeSelect}>
                        <option value="*">- [필수] 옵션을 선택해 주세요 -</option>
                        {sizes.map((size) => (
                            <option
                                key={size.itemSizeId}
                                value={size.itemSizeId}
                                disabled={size.stockQuantity === 0}
                            >
                                {size.itemSize} {size.stockQuantity === 0 && "[품절]"}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 선택된 옵션 렌더링 */}
            {items.map((item) => (
                <div key={item.id} className="DetailSelect_Selected_option">
                    <div className="DetailSelect_item_details">
                        <span className="DetailSelect_item_name">{item.name}</span>
                        <span className="DetailSelect_item_price">
                            {item.price.toLocaleString()} 원
                        </span>
                    </div>
                    <div className="DetailSelect_item_controls">
                        <button onClick={() => updateItemQuantity(item.id, 1)}>+</button>
                        <input
                            type="number"
                            value={item.quantity}
                            readOnly
                            className="DetailSelect_quantity_input"
                        />
                        <button onClick={() => updateItemQuantity(item.id, -1)}>-</button>
                        <button onClick={() => removeItem(item.id)}>x</button>
                    </div>
                </div>
            ))}

            <div className="DetailSelect_summary">
                <div>총 수량: {totalQuantity}</div>
                <div>총 금액: {totalAmount.toLocaleString()} 원</div>
            </div>
        </>
    );
};

export default ProductSelector;