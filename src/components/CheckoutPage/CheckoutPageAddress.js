import React, { useEffect, useState, useRef } from "react";
import "./CheckoutPageAddress.css";

const CheckoutPageAddress = ({ onAddressChange }) => {
    const [addressList, setAddressList] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [mode, setMode] = useState("view");

    const postCodeRef = useRef(null);
    const roadAddressRef = useRef(null);
    const detailAddressRef = useRef(null);

    // API 요청 관련 설정
    const fetchOptions = {
        headers: {
            Authorization: localStorage.getItem("accessToken"),
            "Refresh-Token": localStorage.getItem("refreshToken"),
        },
    };

    // 주소 목록 가져오기
    useEffect(() => {
        const fetchAddressList = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/delivery-address", fetchOptions);
                if (!response.ok) throw new Error("주소 목록을 불러오지 못했습니다.");
                const data = await response.json();
                setAddressList(data);
            } catch (error) {
                console.error(error.message);
                alert("주소 목록을 불러오지 못했습니다.");
            }
        };

        fetchAddressList();
    }, []);

    // 선택된 주소 상위 컴포넌트로 전달
    const updateSelectedAddress = (selectedId) => {
        const selectedAddress = addressList.find((addr) => addr.deliveryAddressId === selectedId);
        if (selectedAddress && onAddressChange) {
            onAddressChange({
                postCode: selectedAddress.postCode,
                roadAddress: selectedAddress.roadAddress,
                detailAddress: selectedAddress.detailAddress,
            });
        }
    };

    const handleModeChange = (newMode) => setMode(newMode);

    const handleSearchAddress = () => {
        if (!window.daum?.Postcode) {
            alert("주소 검색 모듈이 로드되지 않았습니다.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data) => {
                const addr = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

                if (postCodeRef.current) postCodeRef.current.value = data.zonecode;
                if (roadAddressRef.current) roadAddressRef.current.value = addr;
            },
        }).open();
    };

    const handleAddNewAddress = async () => {
        const newAddress = {
            postCode: postCodeRef.current.value.trim(),
            roadAddress: roadAddressRef.current.value.trim(),
            detailAddress: detailAddressRef.current.value.trim(),
        };

        if (!newAddress.postCode || !newAddress.roadAddress || !newAddress.detailAddress) {
            alert("모든 필드를 채워주세요.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/v1/delivery-address", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...fetchOptions.headers },
                body: JSON.stringify(newAddress),
            });

            if (!response.ok) throw new Error("주소 등록에 실패했습니다.");
            alert("주소가 성공적으로 등록되었습니다.");
            setAddressList((prev) => [...prev, newAddress]);
            setMode("view");

            postCodeRef.current.value = "";
            roadAddressRef.current.value = "";
            detailAddressRef.current.value = "";
        } catch (error) {
            console.error(error.message);
            alert("주소 등록 중 오류가 발생했습니다.");
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm("정말 이 주소를 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/delivery-address/${id}`, {
                method: "DELETE",
                headers: fetchOptions.headers,
            });

            if (!response.ok) throw new Error("주소 삭제에 실패했습니다.");
            alert("주소가 삭제되었습니다.");
            setAddressList((prev) => prev.filter((addr) => addr.deliveryAddressId !== id));
        } catch (error) {
            console.error(error.message);
            alert("주소 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="CheckoutPageAddress_Form">
            <h3>배송지 관리</h3>
            <div className="address-actions">
                {["view", "add", "delete"].map((action) => (
                    <button key={action} onClick={() => handleModeChange(action)}>
                        {action === "view" ? "배송지 선택" : action === "add" ? "배송지 추가" : "배송지 삭제"}
                    </button>
                ))}
            </div>

            {mode === "view" && (
                <div>
                    <h4>등록된 주소</h4>
                    {addressList.length === 0 ? (
                        <p>등록된 주소가 없습니다.</p>
                    ) : (
                        <select
                            value={selectedAddressId || ""}
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                setSelectedAddressId(id);
                                updateSelectedAddress(id);
                            }}
                        >
                            <option value="" disabled>
                                선택해주세요
                            </option>
                            {addressList.map((address) => (
                                <option key={address.deliveryAddressId} value={address.deliveryAddressId}>
                                    {address.roadAddress} {address.detailAddress} ({address.postCode})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {mode === "add" && (
                <div>
                    <h4>새로운 주소 추가</h4>
                    <input type="text" placeholder="우편번호" ref={postCodeRef} readOnly />
                    <button onClick={handleSearchAddress}>주소 검색</button>
                    <input type="text" placeholder="도로명 주소" ref={roadAddressRef} readOnly />
                    <input type="text" placeholder="상세 주소" ref={detailAddressRef} />
                    <button onClick={handleAddNewAddress}>등록</button>
                    <button onClick={() => handleModeChange("view")}>취소</button>
                </div>
            )}

            {mode === "delete" && (
                <div>
                    <h4>주소 삭제</h4>
                    {addressList.length === 0 ? (
                        <p>삭제할 주소가 없습니다.</p>
                    ) : (
                        <>
                            <select
                                value={selectedAddressId || ""}
                                onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                            >
                                <option value="" disabled>
                                    선택해주세요
                                </option>
                                {addressList.map((address) => (
                                    <option key={address.deliveryAddressId} value={address.deliveryAddressId}>
                                        {address.roadAddress} {address.detailAddress} ({address.postCode})
                                    </option>
                                ))}
                            </select>
                            <button onClick={() => handleDeleteAddress(selectedAddressId)}>삭제</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CheckoutPageAddress;
