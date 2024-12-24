import React, { useState, useEffect } from "react";
import "./ProductSelector.css";

const ProductSelector = ({ sizes, product }) => {
  // 데이터 확인용 콘솔로그
  // console.log("product:", product);
  // useEffect(() => {
  //   console.log('Sizes:', sizes); // sizes 배열 확인
  // }, [sizes]);
  const [items, setItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalRewardRate, setTotalRewardRate] = useState(0); // 총 적립금 상태 추가

  // 실제 적용 가격 (할인이 있으면 discountPrice, 없으면 productPrice)
  const appliedPrice = product.discountPercent > 0 ? product.discountPrice : product.productPrice;


  useEffect(() => {
    const newTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const newTotalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newTotalRewardRate = items.reduce((sum, item) => sum + item.quantity * item.price * product.rewardRate, 0);
    setTotalQuantity(newTotalQuantity);
    setTotalAmount(newTotalAmount);
    setTotalRewardRate(newTotalRewardRate);
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
      prevItems.map((item) => {
        if (item.id === itemId) {
          // 사이즈에 맞는 stockQuantity 찾기
          const selectedSize = sizes.find(size => size.itemSizeId.toString() === item.id.toString());
  
          if (!selectedSize) {
            console.error("선택된 사이즈 정보가 없습니다.");
            return item; // 수량 변경하지 않고 그대로 반환
          }
  
          const newQuantity = item.quantity + qtyChange;
  
          // 수량이 재고보다 많으면 alert 띄우고 변경하지 않음
          if (newQuantity > selectedSize.stockQuantity) {
            alert("재고가 부족합니다. 수량을 재고 이하로 설정해주세요.");
            return item; // 수량 변경을 하지 않고 그대로 반환
          }
  
          // 수량이 1보다 작으면 1로 제한
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      })
    );
  };
  
  


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


      {items.map((item) => (
        <div key={item.id} className="ProductSelector_list">
          <div className="ProductSelector_NewOption">
            <div className="ProductSelector_name">
              <div className="ProductSelector_title">
                {product.productName}
              </div>
              <div className="ProductSelector_size">{item.name}</div>
            </div>
            {/* --------------------옵션 버튼--------------  */}
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
                min="1"
                readOnly
              />
              <button className="ProductSelector_increaseBtn"
                onClick={() => updateItemQuantity(item.id, 1)}
              >▲</button>
              <button
                className="ProductSelector_remove" onClick={() => removeItem(item.id)}> x</button>
            </div>

            <div className="ProductSelector_total_count">
              <div className="ProductSelector_total_price">
                {(item.quantity * item.price).toLocaleString()} 원
              </div>
              <div className="ProductSelector_total_rewardRate">
                적립금 ( {Math.floor(item.quantity * item.price * product.rewardRate)} 원)
              </div>
            </div>
          </div>
        </div>
      ))}

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