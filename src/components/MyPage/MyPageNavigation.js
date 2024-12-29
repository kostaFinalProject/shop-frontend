import React,{useState,useEffect} from "react";
import './MyPageNavigation.css';

const MyPageNavigation = () => {


    //  ----------접속자 정보 가져오기 ---
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (user) {
            setCurrentUser(JSON.parse(user));
            console.log("MyPageNavigation_currentUser", user);
        }
    }, []);
    if (!currentUser) {

        return null; // currentUser가 없으면 아무것도 렌더링하지 않음
    }
    // -----------------------------------

    return (
        <>
            <section className="manuwrap">
                <h3>마이 페이지</h3>
                <article className="myshopmain">
                    <h4>나의 쇼핑활동</h4>
                    <ul>
                        <a href="/MyPage/order">
                            <li>주문/배송조회</li>
                        </a>
                        <a href="/MyPage/basket">
                            <li>장바구니</li>
                        </a>
                        <a href="/MyPage/interest">
                            <li>관심상품</li>
                        </a>
                        {/* <a href="/MyPage/resentview">
                            <li>최근 본 상품</li>
                        </a> */}
                    </ul>
                </article>
                {/* <article className="myshopmain">
                    <h4>쇼핑혜택 안내</h4>
                    <ul>
                        <a href="/MyPage/coupon">
                            <li>내 쿠폰정보</li>
                        </a>
                        <a href="/MyPage/mileage">
                            <li>적립금 내역</li>
                        </a>
                    </ul>
                </article> */}
                <article className="myshopmain">
                    <h4>스타일</h4>
                    <ul>
                        <a href="/MyPage/stylemodify">
                            <li>프로필 관리</li>
                        </a>
                        <a href={`/Styleprofile?memberId=${currentUser.memberId}`}>
                            <li>내 스타일</li>
                        </a>
                    </ul>
                </article>
                <article className="myshopmain">
                    <h4>나의 정보 관리</h4>
                    <ul>
                        {/* <a href="/MyPage/address">
                            <li>배송지 관리</li>
                        </a> */}
                        <a href="">
                            <li>회원 정보 수정</li>
                        </a>
                        <a href="">
                            <li>로그아웃</li>
                        </a>
                    </ul>
                </article>
                <article className="myshopmain">
                    <h4>Q&A</h4>
                    <ul>
                        <a href="/QNA">
                            <li>Q & A 게시판</li>
                        </a>
                        {/* <a href="/QnACreate">
                            <li>Q & A 작성하기</li>
                        </a> */}
                    </ul>
                </article>
            </section>
        </>
    );
};

export default MyPageNavigation;