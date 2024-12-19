import React from "react";
import './DetailInformation.css';

const DetailInformation = ({ product }) => {
    const {
        productName,
        productSeller,
        productPrice,
        rewardRate,
        productDeliveryFee,
        discountPercent,
        discountPrice,
    } = product;

    // 적립금 계산을 위한 실제 가격
    const appliedPrice = discountPercent > 0 ? discountPrice : productPrice;

    const tableData = [
        {
            label: "적립금",
            value: `${Math.floor(appliedPrice * rewardRate).toLocaleString()}원 (${(rewardRate * 100).toFixed(1)}%)`
        },
        {
            label: "배송비",
            value: `${productDeliveryFee.toLocaleString()}원`
        }
    ];

    return (
        <>
            <div className="DetailInformation_productName">
                <h2 id="detail_name">{productName}</h2>
            </div>
            <div className="DetailInformation_productSeller">
                <p id="detail_seller">{productSeller}</p>
            </div>
            <div className="DetailInformation_productPrice">
                {discountPercent > 0 ? (
                    <>
                        {/* 기존 가격에 취소선 */}
                        <span className="DetailInformation_original_price">
                            {productPrice.toLocaleString()}원
                        </span>
                        {/* 할인 가격 및 할인율 */}
                        <span className="DetailInformation_discount_price">
                            {discountPrice.toLocaleString()}원 ({discountPercent}% 할인)
                        </span>
                    </>
                ) : (
                    <strong id="prdCount_price">{productPrice.toLocaleString()}원</strong>
                )}
            </div>
            <div className="DetailInformation_reward_delivery">
                {tableData.map((item, index) => (
                    <div className="DetailInformation_tableRow" key={index}>
                        <div className="DetailInformation_reward">{item.label}</div>
                        <div className="DetailInformation_delivery">{item.value}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default DetailInformation;