import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./QnACreate.css";
import { Link } from "react-router-dom";

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
        <div className="QnACreate_container">
            <h2>Q&A 상품문의</h2>
            {/* -------------상품 이미지 및 상품명 , 가격 -------------- */}
            <div className="QnACreate_product_info">
                <Link to={`/DetailPage?itemId=${itemData.itemId}`} className="QnACreate_product_link">
                    <img
                        src={`/uploads/${itemData.imageUrls[0]}`} // 첫 번째 이미지 사용
                        alt="Product"
                        className="QnACreate_product_image"
                    />
                </Link>
                <div className="QnACreate_product_details">
                    <Link to={`/DetailPage?itemId==${itemData.itemId}`} className="QnACreate_product_link">
                        <h3 className="_product_title">{itemData.name}</h3>
                    </Link>
                    <Link to={`/DetailPage?itemId==${itemData.itemId}`} className="QnACreate_product_link">
                        <p className="QnACreate_product_price">{itemData.price}원</p>
                    </Link>
                </div>
            </div>

            {/* 질문 */}
            <div className="QnACreate_comment_section">
                <form className="QnACreate_comment_form" onSubmit={handleCommentSubmit}>
                    {/* 제목 */}
                    <div className="QnACreate_tilte_box">
                        <div className="QnACreate_title">제목</div>
                        <div className="QnACreate_form_group">
                            <input
                                id="title"
                                type="text"
                                className="QnACreate_comment_input"
                                placeholder="제목을 입력하세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 내용 */}
                    <div className="QnACreate_textarea_box">
                        <textarea
                            className="QnACreate_comment_textarea"
                            placeholder="질문 내용을 입력하세요"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>

                    </div>

                    {/* 버튼 */}
                    <div className="QnACreate_button_container">
                        <button
                            type="button"
                            className="QnACreate_list_button"
                            onClick={() => navigate('/QnA')}
                        >
                            목록
                        </button>
                        <div className="QnACreate_right_buttons">
                            <button type="submit" className="QnACreate_submit_button">등록</button>
                            <button
                                type="button"
                                className="QnACreate_cancel_button"
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