import React from "react";
import './DetailInformation.css';

const DetailInformation = () => {
    // 단일 데이터 정의
    const product = {
        productName: "에버튼 'BAR SCARF' 스카프 (머플러) - 오피셜",
        productSeller: 'Official Licensed Product',
        productPrice: 60000,
        rewardRate: 0.01,
        ProductDeliveryFee: 5000
    };

    // 테이블 데이터 준비
    const tableData = [
        {
            label: "적립금",
            value: `${Math.floor(product.productPrice * product.rewardRate).toLocaleString()}원 (${product.rewardRate * 100}%)`
        },
        {
            label: "배송비",
            value: `${product.ProductDeliveryFee.toLocaleString()}원`
        }
    ];

    return (
        <>
            {/* ---------------- 상세페이지 설명글 ---------------- */}
            <div className="DetailInformation_productName">
                <h2 id="detail_name">{product.productName}</h2>
            </div>
            <div className="DetailInformation_productSeller">
                <p id="detail_seller">{product.productSeller}</p>
            </div>
            <div className="DetailInformation_productPrice">
                <strong id="prdCount_price">{product.productPrice.toLocaleString()}원</strong>
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
