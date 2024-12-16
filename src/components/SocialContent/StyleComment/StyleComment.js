import React, { useState } from "react";
import "./StyleComment.css";

const StyleComment = ({ isVisible, onClose, comments, setComments, currentUser }) => {
    const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태
    const [replyIndex, setReplyIndex] = useState(null); // 답글 입력 활성화 상태
    const [reComment, setReComment] = useState(""); // 대댓글 입력 상태

    // 댓글 입력값 변경 핸들러
    const handleInputChange = (e) => {
        setNewComment(e.target.value);
    };

    // 대댓글 입력값 변경 핸들러
    const handleReplyChange = (e) => {
        setReComment(e.target.value);
    };

    // 댓글 등록 핸들러
    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            const newEntry = {
                author: currentUser || "익명 사용자", // 작성자 정보
                text: newComment,
                formattedDate: new Date().toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }), // 포맷된 날짜
                replies: [] // 대댓글 배열 초기화
            };
            setComments([...comments, newEntry]); // 부모 상태 업데이트
            setNewComment(""); // 입력 필드 초기화
        }
    };

    // 대댓글 등록 핸들러
    const handleAddReply = (index) => {
        if (reComment.trim() !== "") {
            const updatedComments = [...comments];
            updatedComments[index].replies.push({
                author: currentUser || "대댓글",
                text: reComment,
                formattedDate: new Date().toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                })
            });
            setComments(updatedComments); // 대댓글 추가 후 부모 상태 업데이트
            setReComment(""); // 대댓글 입력 필드 초기화
            setReplyIndex(null); // 대댓글 입력창 닫기
        }
    };

    // 키보드 입력 핸들러 (Enter 키 처리)
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAddComment();
        }
    };

    // 키보드 입력 핸들러 (Enter 키 처리) 대댓글용
    const handleReplyKeyDown = (e, index) => {
        if (e.key === "Enter") {
            handleAddReply(index);
        }
    };

    // 답글 입력 토글 핸들러
    const handleReplyToggle = (index) => {
        setReplyIndex(replyIndex === index ? null : index); // 활성화 상태 토글
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
                {comments.length > 0 ? (
                    <ul className="CommentsPanel_list">
                        {comments.map((comment, index) => (
                            <li key={index} className="CommentsPanel_item">
                                <div className="CommentsPanel_User">
                                    <div className="CommentsPanel_User_Img">
                                        <img
                                            src="https://cdn.4mation.net/profile/image/tmdals4872_7de6ba24-cec8-4862-89f3-e303a4ff8e01.png?s=100x100&q=100"
                                            alt=""
                                        />
                                    </div>
                                    <div className="CommentsPanel_Author_Time">
                                        <div className="CommentsPanel_Author">
                                            {comment.author}
                                        </div>
                                        <div className="CommentsPanel_Text">
                                            {comment.text}
                                        </div>
                                        <div className="CommentsPanel_Time">
                                            {comment.formattedDate}
                                            <button
                                                className="CommentsPanel_ReComment"
                                                onClick={() => handleReplyToggle(index)}
                                            >
                                                댓글달기
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 대댓글 목록 출력 */}
                                {comment.replies.length > 0 && (
                                    <ul className="CommentsPanel_replies">
                                        {comment.replies.map((reply, replyIndex) => (
                                            <li key={replyIndex} className="CommentsPanel_reply">
                                                <div className="CommentsPanel_Author">
                                                    {reply.author}
                                                    <div className="CommentsPanel_Text">
                                                    {reply.text}
                                                </div>
                                                </div>
                                                <div className="CommentsPanel_Time">
                                                    {reply.formattedDate}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* 답글 입력창 */}
                                {replyIndex === index && (
                                    <div className="CommentsPanel_ReplyInput">
                                        <input
                                            id="Re_Comment"
                                            type="text"
                                            className="CommentsPanel_ReplyInput_Comment"
                                            value={reComment}
                                            onChange={handleReplyChange}
                                            onKeyDown={(e) => handleReplyKeyDown(e, index)} // Enter 키 처리
                                            placeholder="답글을 남기세요"
                                        />
                                        <button onClick={() => handleAddReply(index)}>등록</button>
                                    </div>
                                )}
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
