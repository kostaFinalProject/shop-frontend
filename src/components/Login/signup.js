import React, { useState, useEffect } from "react";
import "./signup.css";

const Signup = () => {
    const [detailAddressChk, setDetailAddressChk] = useState(false);
    const [phonePrefix, setPhonePrefix] = useState("010");
    const [phoneMiddle, setPhoneMiddle] = useState("");
    const [phoneLast, setPhoneLast] = useState("");
    const [phoneMiddleChk, setPhoneMiddleChk] = useState(false);
    const [phoneLastChk, setPhoneLastChk] = useState(false);
    const [userType, setUserType] = useState("USER");
    const [useridChk, setUseridChk] = useState(false);
    const [pwChk, setPwChk] = useState(false);
    const [pwMatchChk, setPwMatchChk] = useState(false);
    const [nameChk, setNameChk] = useState(false);
    const [nicknameChk, setNicknameChk] = useState(false);
    const [emailLocal, setEmailLocal] = useState("");
    const [emailDomain, setEmailDomain] = useState("");
    const [customDomain, setCustomDomain] = useState(false);
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
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

    // 이름 검증 (10자 이하)
    const handleNameChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10) {
            setNameChk(true);
        } else {
            setNameChk(false);
        }
    };

    // 닉네임 검증 (영문, 숫자, 특수문자 중 . _ 만 사용, 10자 이하)
    const handleNicknameChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z0-9._]{1,15}$/;
        if (regex.test(value)) {
            setNicknameChk(true);
        } else {
            setNicknameChk(false);
        }
    };

    // 이메일 입력 및 도메인 선택 처리
    const handleEmailLocalChange = (e) => {
        setEmailLocal(e.target.value);
    };

    const handleEmailDomainChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setCustomDomain(true);
            setEmailDomain("");
        } else {
            setCustomDomain(false);
            setEmailDomain(value);
        }
    };

    const handleCustomDomainChange = (e) => {
        setEmailDomain(e.target.value);
    };

    function execDaumPostcode() {
        new window.daum.Postcode({
            oncomplete: function (data) {
                var addr = '';

                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }

                document.getElementById("postcode").value = data.zonecode;
                document.getElementById("roadAddress").value = addr;
                document.getElementById("detailAddress").focus();
            }
        }).open();
    }

    const handleDetailAddressChange = (e) => {
        const detailAddress = e.target.value;
        const consonantsOnly = /^[ㄱ-ㅎㅏ-ㅣ]+$/g;

        if (consonantsOnly.test(detailAddress)) {
            setDetailAddressChk(false);
        } else {
            setDetailAddressChk(true);
        }
    };

    const handlePhonePrefixChange = (e) => {
        setPhonePrefix(e.target.value);
    };

    const handlePhoneMiddleChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        setPhoneMiddle(value);
        if (value.length >= 3 && value.length <= 4) {
            setPhoneMiddleChk(true);
        } else {
            setPhoneMiddleChk(false);
        }
    };

    const handlePhoneLastChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        setPhoneLast(value);
        if (value.length === 4) {
            setPhoneLastChk(true);
        } else {
            setPhoneLastChk(false);
        }
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    function handleSignupSubmit(e) {
        e.preventDefault();

        if (
            !useridChk ||
            !pwChk ||
            !pwMatchChk ||
            !nameChk ||
            !nicknameChk ||
            !phoneMiddleChk ||
            !phoneLastChk ||
            !detailAddressChk ||
            !document.getElementById("postcode").value.trim() ||
            !document.getElementById("roadAddress").value.trim() ||
            !document.getElementById("detailAddress").value.trim()
        ) {
            alert("모든 필수 입력 사항을 확인해주세요.");
            return;
        }
        const userData = {
            userId: document.getElementById("userid").value,
            password: document.getElementById("pw").value,
            name: document.getElementById("name").value,
            nickname: document.getElementById("nickname").value,
            email: document.getElementById("emailLocal").value + "@" + document.getElementById("emailDomain").value,
            phone: document.getElementById("phonePrefix").value + "-" + document.getElementById("phoneMiddle").value
                + "-" + document.getElementById("phoneLast").value,
            postCode: document.getElementById("postcode").value,
            roadAddress: document.getElementById("roadAddress").value,
            detailAddress: document.getElementById("detailAddress").value,
            grade: document.querySelector('input[name="userType"]:checked')?.value,
            provider: "GENERAL"
        };

        fetch('http://localhost:8080/api/v1/members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (response.status === 200) {
                    alert("회원가입이 완료되었습니다.");
                    window.location.href='/login';
                } else {
                    const errorMessage = response.text();
                    alert(errorMessage);
                }
            })
            .catch(error => {
                alert("서버 오류로 인해 회원가입을 완료할 수 없습니다. 잠시 후 다시 시도해주세요.");
            });
    }

    return (
        <div className="form-wrap">
            {/* <form>
                <div className="firstmenu">
                    <div style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid black" }}>
                        <h2 id="join" style={{ margin: "10px 0" }}>간편 로그인</h2>
                    </div>
                    <div id="menu1" style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
                        <h3 style={{ textAlign: "center" }}>간편하게 로그인하기</h3>
                    </div>
                    <div id="form1" style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                        <h5 style={{ color: "#757575" }}>
                            간편한 회원가입으로 쉽게 본 사이트를 이용할 수 있습니다.
                            <br />
                            카카오톡으로 쉽게 시작하기
                        </h5>
                    </div>
                    <div style={{ marginBottom: "10px", textAlign: "center" }}>
                        <a href="*">
                            <img src="/img/kakao_login_medium_wide.png" width="310px" alt="카카오 로그인" />
                        </a>
                    </div>
                </div>
            </form> */}

            <form onSubmit={handleSignupSubmit} action="" method="POST">
                <div className="secondmenu">
                    <div
                        style={{
                            display: "block",
                            justifyContent: "center",
                            borderBottom: "1px solid black",
                            marginBottom: 10,
                        }}
                    >
                        <h2 style={{ textAlign: "center", margin: "10px 0" }}>회원가입</h2>
                        <p style={{ textAlign: "right" }}>
                            <span style={{ color: "#ed4848", marginBottom: "10px" }}>*</span> 필수입력사항
                        </p>
                    </div>

                    <div className="form">
                        {/* 사용자 유형 체크박스 */}
                        <div className="form-section">
                            <div className="form-row" style={{ marginTop: "10px" }}>
                                <label>사용자 유형
                                    <span style={{ color: "#ed4848" }}>*</span>
                                </label>
                                
                                <label>
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="USER"
                                        checked={userType === "USER"}
                                        onChange={handleUserTypeChange}
                                    />
                                    일반 사용자
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="NO_AUTHORIZATION_ADMIN"
                                        checked={userType === "NO_AUTHORIZATION_ADMIN"}
                                        onChange={handleUserTypeChange}
                                    />
                                    관리자
                                </label>
                            </div>
                        </div>

                        {/* 아이디, 비밀번호, 이름, 닉네임 필드 */}
                        <div className="form-section">
                            <div className="form-row">
                                <label htmlFor="userid">
                                    아이디 <span style={{ color: "#ed4848" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={16}
                                    id="userid"
                                    name="userid"
                                    placeholder="아이디를 입력하세요."
                                    style={{ width: 170 }}
                                    onChange={handleUseridChange}
                                    required
                                />
                                {!useridChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>영문과 숫자 조합으로 8~16자 사이로 입력하세요.</span>}
                            </div>
                            <div className="form-row">
                                <label htmlFor="pw">
                                    비밀번호 <span style={{ color: "#ed4848" }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    maxLength={16}
                                    id="pw"
                                    name="password"
                                    style={{ width: 170 }}
                                    placeholder="비밀번호를 입력하세요."
                                    onChange={handlePwChange}
                                    required
                                />
                                {!pwChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>영문 대소문자, 숫자, 특수문자(!,@,#,$,%)를 최소 1자 이상 포함해 8~16자 사이로 입력하세요.</span>}
                            </div>
                            <div className="form-row">
                                <label htmlFor="re_pw">
                                    비밀번호 확인 <span style={{ color: "#ed4848" }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    maxLength={16}
                                    id="re_pw"
                                    name="re_pw"
                                    style={{ width: 170 }}
                                    placeholder="비밀번호를 입력하세요."
                                    onChange={handleRePwChange}
                                    onPaste="return false;"
                                    onCopy="return false;"
                                />
                                {!pwMatchChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>비밀번호가 일치하지 않습니다.</span>}
                            </div>
                            <div className="form-row">
                                <label htmlFor="name">
                                    이름 <span style={{ color: "#ed4848" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={10}
                                    id="name"
                                    name="name"
                                    style={{ width: 170 }}
                                    placeholder="이름을 입력하세요."
                                    onChange={handleNameChange}
                                    required
                                />
                                {!nameChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>이름은 10자 이하로 입력하세요</span>}
                            </div>
                            <div className="form-row">
                                <label htmlFor="nickname">
                                    닉네임 <span style={{ color: "#ed4848" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={10}
                                    id="nickname"
                                    name="nickname"
                                    style={{ width: 170 }}
                                    placeholder="사용할 닉네임을 입력하세요"
                                    onChange={handleNicknameChange}
                                    required
                                />
                                {!nicknameChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>영문, 숫자, 특수문자(.,_)만 가능합니다.</span>}
                            </div>
                        </div>

                        {/* 이메일 입력 섹션 */}
                        <div className="form-section">
                            <div className="form-row">
                                <label htmlFor="emailLocal">
                                    이메일 <span style={{ color: "#ed4848" }}>*</span>
                                </label>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <input
                                        type="text"
                                        id="emailLocal"
                                        name="emailLocal"
                                        style={{ width: "120px" }}
                                        value={emailLocal}
                                        onChange={handleEmailLocalChange}
                                        required
                                    />
                                    <span>@</span>
                                    <input
                                        type="text"
                                        id="emailDomain"
                                        name="emailDomain"
                                        style={{ width: "120px" }}
                                        value={emailDomain}
                                        onChange={customDomain ? handleCustomDomainChange : undefined}
                                        disabled={!customDomain}
                                        required
                                    />
                                    <select
                                        id="emailDomainSelect"
                                        name="emailDomainSelect"
                                        style={{ width: "120px" }}
                                        onChange={handleEmailDomainChange}
                                    >
                                        <option value="">선택</option>
                                        <option value="gmail.com">gmail.com</option>
                                        <option value="naver.com">naver.com</option>
                                        <option value="daum.net">daum.net</option>
                                        <option value="custom">직접 입력</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 휴대폰 번호 입력 섹션 */}
                        <div className="form-section">
                            <div className="form-row">
                                <label htmlFor="phone">
                                    휴대폰 번호 <span style={{ color: "#ed4848" }}>*</span>
                                </label>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <select
                                        id="phonePrefix"
                                        name="phonePrefix"
                                        style={{ width: "100px" }}
                                        value={phonePrefix}
                                        onChange={handlePhonePrefixChange}
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
                                        value={phoneMiddle}
                                        onChange={handlePhoneMiddleChange}
                                        onKeyPress={(e) => {
                                            if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                                        }}
                                        required
                                    />
                                    <span>-</span>
                                    <input
                                        type="text"
                                        id="phoneLast"
                                        name="phoneLast"
                                        style={{ width: "100px" }}
                                        maxLength={4}
                                        value={phoneLast}
                                        onChange={handlePhoneLastChange}
                                        onKeyPress={(e) => {
                                            if (!/^[0-9]$/.test(e.key)) e.preventDefault(); // 숫자 외 입력 차단
                                        }}
                                        required
                                    />
                                    {(!phoneMiddleChk || !phoneLastChk) && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>전화번호를 확인하세요</span>}
                                </div>
                            </div>
                        </div>

                        {/* 주소 섹션 */}
                        <div className="form-section">
                            <div className="form-row">
                                <label htmlFor="postcode">우편번호 <span style={{ color: "#ed4848" }}>*</span></label>
                                <input
                                    type="text"
                                    id="postcode"
                                    name="postcode"
                                    style={{ width: 165 }}
                                    placeholder="우편번호"
                                    readOnly
                                    required
                                />
                                <button type="button" onClick={execDaumPostcode}>
                                    주소 찾기
                                </button>
                            </div>
                            <div className="form-row">
                                <label htmlFor="roadAddress">기본주소 <span style={{ color: "#ed4848" }}>*</span></label>
                                <input
                                    type="text"
                                    id="roadAddress"
                                    name="roadAddress"
                                    style={{ width: 250 }}
                                    placeholder="주소"
                                    readOnly
                                />
                            </div>
                            <div className="form-row">
                                <label htmlFor="detailAddress">상세주소 <span style={{ color: "#ed4848" }}>*</span></label>
                                <input
                                    type="text"
                                    id="detailAddress"
                                    name="detailAddress"
                                    style={{ width: 250 }}
                                    placeholder="상세주소"
                                    onChange={handleDetailAddressChange}
                                />
                                <div id="addressMessage" />
                                {!detailAddressChk && <span style={{ color: "#FA3E3E", fontSize: "12px" }}>주소를 확인하세요.</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="register">
                    <button className="join-button" type="submit">회원가입</button>
                </div>
            </form>
        </div>
    );
};

export default Signup;