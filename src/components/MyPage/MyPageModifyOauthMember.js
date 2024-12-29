import React, { useState, useEffect } from "react";
import "./MyPageModifyOauthMember.css";
import MyPageNavigation from "./MyPageNavigation";

const MyPageModifyOauthMember = () => {
    const [formData, setFormData] = useState({
        name: "",
        nickname: "",
        phonePrefix: "010",
        phoneMiddle: "",
        phoneLast: "",
        postCode: "",
        roadAddress: "",
        detailAddress: "",
    });

    const [useridChk, setUseridChk] = useState(false);
    const [pwChk, setPwChk] = useState(false);
    const [pwMatchChk, setPwMatchChk] = useState(false);
    const [rePassword, setRePassword] = useState("");
    const [phonePrefix, setPhonePrefix] = useState("010");
    const [phoneMiddle, setPhoneMiddle] = useState("");
    const [phoneLast, setPhoneLast] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [phoneMiddleChk, setPhoneMiddleChk] = useState(false);
    const [phoneLastChk, setPhoneLastChk] = useState(false);
    const [nameChk, setNameChk] = useState(false);
    const [password, setPassword] = useState("");
    const [nicknameChk, setNicknameChk] = useState(false);

    // 초기 데이터 설정
    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            const parsedUser = JSON.parse(currentUser);

            // phone 데이터 분리 및 기본값 설정
            const [phonePrefix, phoneMiddle, phoneLast] = parsedUser.phone
                ? parsedUser.phone.split("-")
                : ["010", "0000", "0000"];

            setFormData({
                name: parsedUser.name || "",
                nickname: parsedUser.nickname || "",
                phonePrefix,
                phoneMiddle,
                phoneLast,
                postCode: parsedUser.postCode || "",
                roadAddress: parsedUser.roadAddress || "",
                detailAddress: parsedUser.detailAddress || "",
            });

            // 검증 상태 초기화
            setNameChk(true);
            setNicknameChk(true);
            setPhoneMiddleChk(phoneMiddle.length >= 3 && phoneMiddle.length <= 4);
            setPhoneLastChk(phoneLast.length === 4);
            setPhonePrefix(phonePrefix);
            setPhoneMiddle(phoneMiddle);
            setPhoneLast(phoneLast);
            setDetailAddress(formData.detailAddress);
        }
    }, []);

    // 입력값 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // 검증 로직
        if (name === "name") {
            setNameChk(value.length <= 10);
        } else if (name === "nickname") {
            setNicknameChk(/^[a-zA-Z0-9._]{1,15}$/.test(value));
        } else if (name === "phonePrefix"){
            setPhonePrefix(document.getElementById("phonePrefix").value)
        } else if (name === "phoneMiddle") {
            setPhoneMiddleChk(value.length >= 3 && value.length <= 4);
            if (setPhoneMiddleChk === true) {
                setPhoneMiddle(document.getElementById("phoneMiddle").value)
            }
        } else if (name === "phoneLast") {
            setPhoneLastChk(value.length === 4);
            if (setPhoneLastChk === true) {
                setPhoneLast(document.getElementById("phoneLast").value)
            }
        }
    };

    // 주소 찾기
    const execDaumPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                const addr = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
                setFormData((prev) => ({
                    ...prev,
                    postCode: data.zonecode,
                    roadAddress: addr,
                }));
            },
        }).open();
    };

    // 폼 제출 처리
    const handleSignupSubmit = (e) => {
        e.preventDefault();

        const { name, nickname, phonePrefix, phoneMiddle, phoneLast, postCode, roadAddress, detailAddress } = formData;

        // 필수 입력 검증
        if (
            !nameChk ||
            !nicknameChk ||
            !phoneMiddleChk ||
            !phoneLastChk ||
            !postCode ||
            !roadAddress ||
            !detailAddress
        ) {
            alert("모든 필수 입력 사항을 확인해주세요.");
            return;
        }

        const userData = {
            name: document.getElementById("name").value,
            nickname: document.getElementById("nickname").value,
            phone: phonePrefix + "-" + phoneMiddle
                + "-" + phoneLast,
            postCode: document.getElementById("postcode").value,
            roadAddress: document.getElementById("roadAddress").value,
            detailAddress: document.getElementById("detailAddress").value,
        };

        fetch("http://localhost:8080/api/v1/members/oauth", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("accessToken"),
                "Refresh-Token": localStorage.getItem("refreshToken"),
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.status === 200) {
                    alert("회원수정이 완료되었습니다.");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                } else {
                    return response.text().then((errorMessage) => {
                        alert(errorMessage);
                    });
                }
            })
            .catch(() => {
                alert("서버 오류로 인해 회원수정을 완료할 수 없습니다. 잠시 후 다시 시도해주세요.");
            });
    };

    return (
        <div className="MyPageModifyOauthMember_form_wrap" >
            <div className="MyPageModifyOauthMember_content">
                <MyPageNavigation />
                <form onSubmit={handleSignupSubmit} action="" method="POST" >
                    <div className="MyPageModifyOauthMember_secondmenu">
                        <div className="MyPageModifyOauthMember_Title" >
                            <h2 >회원수정</h2>
                            <p>
                                <span >*</span> 필수입력사항
                            </p>
                        </div>
                        <div className="MyPageModifyOauthMember_form_Body">
                            {/* 이름 필드 */}
                            <div className="MyPageModifyOauthMember_form_row">
                                <label htmlFor="name">이름 <span style={{ color: "#ed4848" }}>*</span></label>
                                <input
                                    
                                    type="text"
                                    maxLength={10}
                                    id="name"
                                    name="name"
                                    style={{ width: "79%" }}
                                    value={formData.name}
                                    placeholder="이름을 입력하세요."
                                    onChange={handleInputChange}
                                    required
                                />
                                {!nameChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>이름은 10자 이하로 입력하세요</span>}
                            </div>

                            {/* 닉네임 필드 */}
                            <div className="MyPageModifyOauthMember_form_row">
                                <label htmlFor="nickname">닉네임 <span style={{ color: "#ed4848" }}>*</span></label>
                                <input
                                    type="text"
                                    maxLength={10}
                                    id="nickname"
                                    name="nickname"
                                    style={{ width: "79%" }}
                                    value={formData.nickname}
                                    placeholder="사용할 닉네임을 입력하세요"
                                    onChange={handleInputChange}
                                    required
                                />
                                {!nicknameChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>영문, 숫자, 특수문자(.,_)만 가능합니다.</span>}
                            </div>

                            {/* 휴대폰 번호 입력 섹션 */}
                            <div className="MyPageModifyOauthMember_form_row">
                                <label htmlFor="phone">휴대폰 번호 <span style={{ color: "#ed4848" }}>*</span></label>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <select
                                        id="phonePrefix"
                                        name="phonePrefix"
                                        style={{ width: "100px" }}
                                        value={formData.phonePrefix}
                                        onChange={handleInputChange}
                                    >
                                        <option value="010">010</option>
                                        <option value="011">011</option>
                                        <option value="017">017</option>
                                    </select>
                                    <span>-</span>
                                    <input
                                        type="text"
                                        id="phoneMiddle"
                                        name="phoneMiddle"
                                        style={{ width: "100px" }}
                                        maxLength={4}
                                        value={formData.phoneMiddle}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <span>-</span>
                                    <input
                                        type="text"
                                        id="phoneLast"
                                        name="phoneLast"
                                        style={{ width: "100px" }}
                                        maxLength={4}
                                        value={formData.phoneLast}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {(!phoneMiddleChk || !phoneLastChk) && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>전화번호를 확인하세요</span>}
                                </div>
                            </div>

                            {/* 주소 섹션 */}
                            <div className="MyPageModifyOauthMember_form_row">
                                <label htmlFor="postcode">우편번호 <span style={{ color: "#ed4848" }}>*</span></label>
                                <input
                                    type="text"
                                    id="postcode"
                                    name="postCode"
                                    value={formData.postCode}
                                     style={{ width: "40%" }}
                                    placeholder="우편번호"
                                    readOnly
                                    required
                                />
                                <button type="button" onClick={execDaumPostcode}>주소 찾기</button>
                            </div>
                            <div className="MyPageModifyOauthMember_form_row">
                                <label htmlFor="roadAddress">기본주소 <span style={{ color: "#ed4848" }}>*</span></label>
                                <input
                                    type="text"
                                    id="roadAddress"
                                    name="roadAddress"
                                    value={formData.roadAddress}
                                    style={{ width: "79%" }}
                                    placeholder="주소"
                                    readOnly
                                />
                            </div>
                            <div className="MyPageModifyOauthMember_form_row">
                                <label htmlFor="detailAddress">상세주소 <span style={{ color: "#ed4848" }}>*</span></label>
                                <input
                                    type="text"
                                    id="detailAddress"
                                    name="detailAddress"
                                    style={{ width: "79%" }}
                                    value={formData.detailAddress}
                                    placeholder="상세주소"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="MyPageModifyOauthMember_register">
                        <button className="MyPageModifyOauthMember_join-button" type="submit">회원수정</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyPageModifyOauthMember;
