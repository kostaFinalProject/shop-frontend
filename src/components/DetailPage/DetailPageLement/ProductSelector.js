import React, { useState, useEffect } from "react";
import "./ProductSelector.css";

const ProductSelector = ({ sizes, product, onItemsChange }) => {
  const [items, setItems] = useState([]); // 선택된 상품들
  const [totalQuantity, setTotalQuantity] = useState(0); // 총 수량
  const [totalAmount, setTotalAmount] = useState(0); // 총 금액
  const [totalRewardRate, setTotalRewardRate] = useState(0); // 총 적립금

  // 실제 적용 가격 (할인이 있으면 할인 가격, 아니면 원래 가격)
  const appliedPrice = product.discountPercent > 0 ? product.discountPrice : product.productPrice;

  // items가 변경될 때 총 수량, 총 금액, 적립금 계산 및 부모 컴포넌트로 전달
  useEffect(() => {
    const newTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const newTotalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newTotalRewardRate = items.reduce((sum, item) => sum + item.quantity * item.price * product.rewardRate, 0);

    setTotalQuantity(newTotalQuantity);
    setTotalAmount(newTotalAmount);
    setTotalRewardRate(newTotalRewardRate);

    // 부모 컴포넌트로 선택된 아이템 전달
    if (onItemsChange) {
      onItemsChange(items);
    }
  }, [items, onItemsChange, product.rewardRate]);

  // 옵션 선택
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
      price: appliedPrice,
      quantity: 1,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    event.target.value = "*";
  };

  // 수량 업데이트
  const updateItemQuantity = (itemId, qtyChange) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const selectedSize = sizes.find((size) => size.itemSizeId.toString() === item.id.toString());
          if (!selectedSize) {
            console.error("선택된 사이즈 정보가 없습니다.");
            return item;
          }

          const newQuantity = item.quantity + qtyChange;
          if (newQuantity > selectedSize.stockQuantity) {
            alert("재고가 부족합니다.");
            return item;
          }

          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      })
    );
  };

  // 옵션 삭제
  const removeItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <>
      {/* 사이즈 옵션 선택 */}
      <div className="ProductSelector_inner">
        <div className="ProductSelector_option">
          <div className="ProductSelector_Size_Title">사이즈 선택</div>
          <select onChange={handleSizeSelect} className="ProductSelector_select">
            <option className="ProductSelector_size" value="*">- [필수] 옵션을 선택해 주세요 -</option>
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

      {/* 선택된 상품 옵션 */}
      {items.map((item) => (
        <div key={item.id} className="ProductSelector_list">
          <div className="ProductSelector_NewOption">
            <div className="ProductSelector_name">
              <div className="ProductSelector_title">{product.productName}</div>
              <div className="ProductSelector_size">{item.name}</div>
            </div>

            <div className="ProductSelector_list_quantity">
              <button
                className="ProductSelector_decreaseBtn"
                onClick={() => updateItemQuantity(item.id, -1)}
              >
                ▼
              </button>
              <input
                type="number"
                className="ProductSelector_quantityInput"
                value={item.quantity}
                readOnly
              />
              <button
                className="ProductSelector_increaseBtn"
                onClick={() => updateItemQuantity(item.id, 1)}
              >
                ▲
              </button>
              <button
                className="ProductSelector_remove"
                onClick={() => removeItem(item.id)}
              >
                x
              </button>
            </div>

            <div className="ProductSelector_total_count">
              <div className="ProductSelector_total_price">
                {(item.quantity * item.price).toLocaleString()} 원
              </div>
              <div className="ProductSelector_total_rewardRate">
                적립금 ({Math.floor(item.quantity * item.price * product.rewardRate).toLocaleString()} 원)
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 총합 */}
      <div className="ProductSelector_summary">
        <div className="ProductSelector_summary_Total_head">
          <div className="ProductSelector_summary_Quantity">총 수량: {totalQuantity} 개</div>
          <div className="ProductSelector_summary_Quantity">총 적립금: {Math.floor(totalRewardRate).toLocaleString()} 원</div>
        </div>
        <div className="ProductSelector_summary_Price">총 금액: {totalAmount.toLocaleString()} 원</div>
      </div>
    </>
  );
};

export default ProductSelector;