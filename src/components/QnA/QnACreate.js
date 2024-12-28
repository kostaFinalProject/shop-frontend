import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./QnACreate.css";

const QnAcreate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const itemData = location.state?.itemData; // 전달된 itemData 가져오기

    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!itemData) {
        return <div>상품 정보가 없습니다.</div>; // itemData가 없으면 에러 메시지 출력
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        // 비회원 체크: 로그인 토큰이 없으면 바로 리다이렉트
        if (!accessToken || !refreshToken) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
            return;  // 로그인이 안 되어 있으면 더 이상 진행하지 않음
        }

        if (!accessToken || !refreshToken) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
        }

        if (!title.trim() || !comment.trim()) {
            alert("제목과 질문 내용을 모두 입력해주세요.");
            return;
        }

        try {
            const payload = {
                itemId: itemData.itemId, // itemData에서 itemId 가져오기
                title: title,
                content: comment,
            };

            const response = await fetch('http://localhost:8080/api/v1/qna', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: accessToken,
                    'Refresh-Token': refreshToken,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("질문이 성공적으로 등록되었습니다.");
                navigate('/QnA');
            } else {
                const errorData = await response.json();
                alert(`질문 등록에 실패했습니다: ${errorData.message}`);
            }
        } catch (error) {
            alert(`에러가 발생했습니다: ${error.message}`);
        }
    };

    return (
        <div className="qna-container">
            <h2>Q&A 상품문의</h2>

            <div className="product-info">
                <img
                    src={`/uploads/${itemData.imageUrls[0]}`} // 첫 번째 이미지 사용
                    alt="Product"
                    className="product-image"
                />
                <div className="product-details">
                    <h3 className="product-title">{itemData.name}</h3>
                    <p className="product-price">{itemData.price}원</p>
                </div>
            </div>

            <div className="comment-section">
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <div className="form-group">
                        <input
                            id="title"
                            type="text"
                            className="comment-input"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <textarea
                        className="comment-textarea"
                        placeholder="질문 내용을 입력하세요"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <div className="button-container">
                        <button
                            type="button"
                            className="list-button"
                            onClick={() => navigate('/QnA')}
                        >
                            목록
                        </button>
                        <div className="right-buttons">
                            <button type="submit" className="submit-button">등록</button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => navigate(-1)}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QnAcreate;