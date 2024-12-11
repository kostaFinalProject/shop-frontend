import React, { useState, useEffect, useRef } from "react";
import "./DetailSelect.css";

const ProductSelector = () => {
  const [items, setItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const rewardRate = 0.01;
  const productPrice = 50000;
  const productName = "에버튼 'BAR SCARF' 스카프 (머플러) - 오피셜";

  const itemSelectorRef = useRef(null); // Ref 선언

  useEffect(() => {
    const newTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const newTotalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0);
    setTotalQuantity(newTotalQuantity);
    setTotalAmount(newTotalAmount);
  }, [items]);

  const handleSizeSelect = (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const itemName = selectedOption.text;
    const itemId = selectedOption.value;

    if (itemId === "*" || itemId === "**" || itemName.includes("[품절]")) {
      alert("유효한 옵션을 선택해주세요.");
      event.target.value = "*";
      return;
    }

    if (items.some((item) => item.id === itemId)) {
      alert("이미 선택한 옵션입니다.");
      event.target.value = "*";
      return;
    }

    const newItem = {
      id: itemId,
      name: itemName,
      price: productPrice,
      quantity: 1,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    event.target.value = "*";
    //이벤트 초기화
  };

  const updateItemQuantity = (itemId, qtyChange) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + qtyChange),
            }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

    
  };

  // 구매눌렀을 대 옵션 선택 유무
  const handlePurchase = () => {
    if(items.length === 0){
      alert("옵션을 선택해주세요!");
      itemSelectorRef.current.focus(); // 포커스 설정
      return;
    }
  }

  return (
    <>
      <div className="SizeSelection_inner">
        <div className="SizeSelection_option">
          <div className="SizeSelection_title">
            <span style={{ fontSize: "15px" }}>사이즈 (한국)</span>
          </div>
          <div className="SizeSelection_size">
            <select
              id="itemSelector"
              className="SizeSelection_select"
              ref={itemSelectorRef} //Ref 포커스 연결 바로구매 클릭 시 옵션 미선택
              style={{ fontSize: "15px" }}
              onChange={handleSizeSelect}
            >
              <option value="*" defaultValue>
                - [필수] 옵션을 선택해 주세요 -
              </option>
              <option value="**" disabled>
                -------------------
              </option>
              <option value="item1" data-price="50000">
                S (95)
              </option>
              <option value="item2" data-price="50000">
                M (100)
              </option>
              <option value="item3" data-price="50000">
                L (105)
              </option>
              <option value="item4" data-price="50000">
                XL (110)
              </option>
              <option value="item5" data-price="50000">
                XXL (115) [품절]
              </option>
            </select>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="DetailSelect_Selected_option">
          {items.map((item) => (
            <div key={item.id} className="DetailSelect_list">
              <div className="DetailSelect_NewOption">
                <div className="DetailSelect_name">
                  <div className="DetailSelect_title">
                    {productName}
                  </div>
                  <div className="DetailSelect_size">{item.name}</div>
                </div>
                <div className="DetailSelect_list_quantity">
                  <button
                    className="DetailSelect_decreaseBtn"
                    onClick={() => updateItemQuantity(item.id, -1)}
                  >
                    ▼
                  </button>
                  <input
                    type="number"
                    className="quantityInput"
                    value={item.quantity}
                    min="1"
                    disabled
                  />
                  <button
                    className="DetailSelect_increaseBtn"
                    onClick={() => updateItemQuantity(item.id, 1)}
                  >
                    ▲
                  </button>
                  <button
                    className="DetailSelect_remove"
                    onClick={() => removeItem(item.id)}
                  >
                    x
                  </button>
                </div>

                <div className="DetailSelect_total_count">
                  <div className="DetailSelect_total_price">
                    {(item.quantity * item.price).toLocaleString()} 원
                  </div>
                  <div className="DetailSelect_total_rewardRate">
                    적립금 (
                    {Math.floor(item.quantity * item.price * rewardRate)} 원)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="DetailSelecte_total_price">
        <span className="DetailSelecte_price_title">총 수량</span>
        <span className="DetailSelecte_price_total" id="totalQuantity">
          {totalQuantity}개
        </span>
      </div>

      <div className="DetailSelecte_total_price">
        <span className="DetailSelecte_price_title">
          <strong>총 상품금액</strong>
        </span>
        <span className="DetailSelecte_price_total">
          <strong id="totalAmount">{totalAmount.toLocaleString()} 원</strong>
        </span>
      </div>

      <div className="DetailSelecte_total_price">
        <span className="DetailSelecte_price_title">
          <strong>적립금</strong>
        </span>
        <span className="DetailSelecte_price_total">
          <strong id="rewardPoints">
            {Math.floor(totalAmount * rewardRate)} 원
          </strong>
        </span>
      </div>

      <button className="BuyInformation_buyBtn" onClick={handlePurchase}>
        <p>바로구매</p>
      </button>
    </>
  );
};

export default ProductSelector;
