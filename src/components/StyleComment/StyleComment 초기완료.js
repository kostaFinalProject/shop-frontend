import React, { useState } from "react";
import './StyleComment.css';

const StyleComment = ({ isVisible, onClose, comments }) => {
    // 상태 정의: 댓글 입력 필드와 댓글 목록
    const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태
    const [commentList, setCommentList] = useState(comments || []); // 댓글 목록 상태

    // 댓글 입력값 변경 핸들러
    const handleInputChange = (e) => {
        setNewComment(e.target.value); // 입력 필드의 값 상태 업데이트
    };

    // 댓글 등록 핸들러
    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            const updatedComments = [
                ...commentList,
                { author: "사용자", text: newComment }, // 새 댓글 추가
            ];
            setCommentList(updatedComments); // 댓글 목록 상태 업데이트
            setNewComment(""); // 입력 필드 초기화
        }
    };

      // 키보드 입력 핸들러 (Enter 키 처리)
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAddComment(); // Enter 키를 누르면 댓글 등록
        }
    };
    return (
        <div className={`CommentsPanel ${isVisible ? "visible" : ""}`}>
            <button className="CommentsPanel_close" onClick={onClose}>
                닫기
            </button>
            <h3>댓글</h3>

            {/* 댓글 입력 */}
            <div className="CommentsPanel_input">
                <label htmlFor="newComment">댓글 입력</label>
                <input
                    id="newComment"
                    type="text"
                    value={newComment}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown} // Enter 키 처리
                    placeholder="댓글을 남기세요"
                />
                <button onClick={handleAddComment}>등록</button>
            </div>

            {/* 댓글 목록 출력 */}
            <div className="CommentsPanel_content">
                {commentList.length > 0 ? (
                    <ul className="CommentsPanel_list">
                        {commentList.map((comment, index) => (

                            <li key={index} className="CommentsPanel_item">
                                <div className="CommentsPanel_User">
                                    <div className="CommentsPanel_User_Img">
                                        <img src="https://cdn.4mation.net/profile/image/tmdals4872_7de6ba24-cec8-4862-89f3-e303a4ff8e01.png?s=100x100&q=100" alt="" />
                                    </div>
                                    <div className="CommentsPanel_Author_Time">
                                        <div className="CommentsPanel_Author">{comment.author}
                                            <div className="CommentsPanel_Text">
                                                {comment.text}
                                            </div>
                                        </div>

                                        <div className="CommentsPanel_Time">타임
                                            <div className="CommentsPanel_ReComment"> 댓글달기</div>
                                        </div>
                                    </div>

                                </div>


                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>댓글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default StyleComment;
