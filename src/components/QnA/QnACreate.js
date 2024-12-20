import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./QnAcreate.css";

const QnACreate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const itemData = location.state?.itemData; // 전달된 itemData 가져오기

    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    if (!itemData) {
        return <div>상품 정보가 없습니다.</div>; // itemData가 없으면 에러 메시지 출력
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !comment.trim()) {
            alert("제목과 질문 내용을 모두 입력해주세요.");
            return;
        }

        try {
            const payload = {
                itemId: itemData.id, // itemData에서 itemId 가져오기
                title,
                content: comment,
            };

            const response = await fetch('/api/v1/qna', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

export default QnACreate;
