import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./QnAdetail.css";

const QnAdetail = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/QnA'); // '/QnA' 페이지로 리디렉션
      };
    
      const [isCommentSubmitted, setIsCommentSubmitted] = useState(false); // 댓글 제출 여부를 관리하는 상태
      const [comment, setComment] = useState(''); // 작성된 댓글을 관리하는 상태
  
      const handleCommentSubmit = (e) => {
          e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
  
          // 여기서 댓글 처리 로직 추가 (예: API 호출)
          setIsCommentSubmitted(true); // 댓글이 제출되었음을 상태로 관리
  
          // 추가로, 댓글을 서버에 전송하거나 다른 작업을 할 수 있습니다.
      };
  
      const handleCommentChange = (e) => {
          setComment(e.target.value); // 댓글 입력값 변경
      };
  return (
    <div className="qna-container">
        <h2>Q&A</h2>

      <div className="product-info">
        <img
          src="path_to_image" // 제품 이미지 경로
          alt="Product"
          className="product-image"
        />
        <div className="product-details">
          <h3 className="product-title">ADIDAS 유벤투스 24/25 HOME KIT [세리에 A]</h3>
          <p className="product-price">149,000원</p>
        </div>
      </div>

      <div className="qna-section">
        <h3 className="qna-title">마킹문의</h3>
        <p className="qna-user">이***** | 2024-12-18</p>
      </div>

      <div>
        <p className="qna-content">
          유니폼 마킹없이 구매하고 싶은데 마킹없음이 선택되지 않는거 같습니다
        </p>
        <button className="qna-list-button" onClick={handleClick}>목록</button>
      </div>

      <div className="comment-section">
            {isCommentSubmitted ? (
                <div className="comment-display">
                    <p style={{ marginBottom: '20px' }}>이***** | 2024-12-18</p>
                    <p>{comment}</p>
                    <button className="qna-list-button">삭제</button>
                    <button className="qna-list-button">수정</button>
                </div>
            ) : (
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <h5 className="comment-title">댓글작성</h5>
                    <textarea
                        className="comment-textarea"
                        placeholder="댓글 내용을 입력하세요"
                        value={comment}
                        onChange={handleCommentChange}
                    ></textarea>
                    <button type="submit" className="submit-button">등록</button>
                </form>
            )}
        </div>
    </div>
  );
};

export default QnAdetail;