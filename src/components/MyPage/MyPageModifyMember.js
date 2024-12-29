import React, { useState, useEffect } from "react";
import "./MyPageModifyMember.css";
import MyPageNavigation from "./MyPageNavigation";

const MyPageModifyMember = () => {
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

    // ID 검증 (영문 + 숫자 조합, 8 ~ 16자)
    const handleUseridChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z0-9]{8,16}$/;
        if (regex.test(value)) {
            setUseridChk(true);
        } else {
            setUseridChk(false);
        }
    };

    // 비밀번호 검증 (영문 대소문자 + 숫자 + 특수문자, 10 ~ 16자)
    const handlePwChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{10,16}$/;

        if (regex.test(value)) {
            setPwChk(true);
        } else {
            setPwChk(false);
        }
    };

    // 비밀번호 확인 검증 (비밀번호와 일치 여부)
    const handleRePwChange = (e) => {
        const value = e.target.value;
        setRePassword(value);  // 비밀번호 확인 상태 업데이트

        if (value === password) {
            setPwMatchChk(true);
        } else {
            setPwMatchChk(false);
        }
    };


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
            !useridChk ||
            !pwChk ||
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
            userId: document.getElementById("userid").value,
            password: document.getElementById("pw").value,
            name: document.getElementById("name").value,
            nickname: document.getElementById("nickname").value,
            phone: phonePrefix + "-" + phoneMiddle
                + "-" + phoneLast,
            postCode: document.getElementById("postcode").value,
            roadAddress: document.getElementById("roadAddress").value,
            detailAddress: document.getElementById("detailAddress").value,
        };

        fetch("http://localhost:8080/api/v1/members", {
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
        <div className="MyPageModifyMember_form_wrap" >
            <div id="MyPageModifyMember_content" style={{display: "flex"}}>
                <MyPageNavigation />
                <form onSubmit={handleSignupSubmit} action="" method="POST" >
                    <div className="MyPageModifyMember_secondmenu">
                        <div className="MyPageModifyMember_Title" >
                            <h2>회원수정</h2>
                            <p>
                                <span>*</span> 필수입력사항
                            </p>
                        </div>
                        <div className="MyPageModifyMember_form_Body">
                            {/* 아이디, 비밀번호, 이름, 닉네임 필드 */}
                            <div className="MyPageModifyMember_form_section">
                                <div className="MyPageModifyMember_form_row">
                                    <label htmlFor="userid">
                                        아이디 <span style={{ color: "#ed4848" }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={16}
                                        id="userid"
                                        name="userid"
                                        placeholder="아이디를 입력하세요."
                                        style={{ width: "50%", marginLeft: "25px" }}
                                        onChange={handleUseridChange}
                                        required
                                    />
                                    {!useridChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>영문과 숫자 조합으로 8~16자 사이로 입력하세요.</span>}
                                </div>
                                <div className="MyPageModifyMember_form_row">
                                    <label htmlFor="pw">
                                        비밀번호 <span style={{ color: "#ed4848" }}>*</span>
                                    </label>
                                    <input
                                        type="password"
                                        maxLength={16}
                                        id="pw"
                                        name="password"
                                        style={{ width: "50%", marginLeft: "65px" }}
                                        placeholder="비밀번호를 입력하세요."
                                        onChange={handlePwChange}
                                        required
                                    />
                                    {!pwChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>영문 대소문자, 숫자, 특수문자(!,@,#,$,%)를 최소 1자 이상 포함해 8~16자 사이로 입력하세요.</span>}
                                </div>
                                <div className="MyPageModifyMember_form_row">
                                    <label htmlFor="re_pw">
                                        비밀번호 확인 <span style={{ color: "#ed4848" }}>*</span>
                                    </label>
                                    <input
                                     style={{ width: "50%" , marginLeft: "25px"}}
                                        type="password"
                                        maxLength={16}
                                        id="re_pw"
                                        name="re_pw"
                                        placeholder="비밀번호를 입력하세요."
                                        onChange={handleRePwChange}
                                        onPaste="return false;"
                                        onCopy="return false;"
                                    />
                                    {!pwMatchChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>비밀번호가 일치하지 않습니다.</span>}
                                </div>

                            </div>
                            {/* 이름 필드 */}
                            <div className="MyPageModifyMember_form_row">
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
                            <div className="MyPageModifyMember_form_row">
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
                            <div className="MyPageModifyMember_form_row">
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
                            <div className="MyPageModifyMember_form_row">
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
                            <div className="MyPageModifyMember_form_row">
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
                            <div className="MyPageModifyMember_form_row">
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
                    <div className="MyPageModifyMember_registerregister">
                        <button className="MyPageModifyMember_join-button" type="submit">회원수정</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyPageModifyMember;
