import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./StyleComment.css";

const StyleComment = ({ isVisible, onClose, comments, setComments, currentUser, header }) => {
    const [image, setImage] = useState(null);
    const [page, setPage] = useState(0); // 현재 페이지
    const [replyPage, setReplyPage] = useState(0);
    const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터 여부
    const [replyHasMore, setReplyHasMore] = useState(true);
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [replyLoading, setReplyLoading] = useState(false);
    const [newComment, setNewComment] = useState(""); // 새 댓글 입력
    const [newReply, setNewReply] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); // 업로드 이미지
    const [replyIndex, setReplyIndex] = useState(null); // 답글창 활성화 인덱스
    const [replies, setReplies] = useState({}); // 대댓글 저장
    const [repliesVisible, setRepliesVisible] = useState({});
    const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
    const [editingContent, setEditingContent] = useState(""); // 수정 중인 댓글 내용
    const [editingImage, setEditingImage] = useState(null); // 수정 중인 이미지
    const [replyImages, setReplyImages] = useState({}); // 답글 이미지 상태
    const observer = useRef(); // 무한 스크롤 감지기
    const replyObserver = useRef();
    const lastCommentRef = useRef(); // 마지막 댓글 참조
    const replyLastCommentRef = useRef();
    const fileInputRef = useRef(null);
    const replyFileInputRef = useRef(null); // 답글 파일 입력창 참조
    const scrollContainerRef = useRef(null); // 스크롤 컨테이너 참조
    const replyScrollContainerRef = useRef(null);
    const replyScrollRefs = useRef({}); // 댓글 ID별로 ref 저장

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const articleId = queryParams.get("articleId");

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // 댓글 조회
    const fetchComments = async (pageNumber) => {
        if (loading || !header) return;
        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/articles/comments/${articleId}?page=${pageNumber}&size=5`,
                {
                    method: "GET",
                    headers: header,
                }
            );

            if (!response.ok) throw new Error("댓글 조회 실패");

            const data = await response.json();
            // 데이터 포맷팅: 이미지 URL 절대 경로 변환
            const formattedComments = data.content.map((comment) => ({
                ...comment,
                imageUrl: comment.imageUrl
                    ? comment.imageUrl.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", "")
                    : comment.imageUrl, // 이미지 URL 없으면 null 처리
            }));
            setComments((prev) => {
                const newComments = formattedComments.filter(
                    (newComment) => !prev.some((prevComment) => prevComment.commentId === newComment.commentId)
                );
                return [...prev, ...newComments];
            });

            setHasMore(!data.last);
            setPage(pageNumber);
        } catch (error) {
            console.error("댓글 불러오기 에러:", error);
        } finally {
            setLoading(false);
        }
    };

    // 대댓글 조회
    const fetchReplies = async (commentId, pageNumber = 0) => {
        if (!header || replyLoading) return;
        setReplyLoading(true);
    
        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/comments/${commentId}?page=${pageNumber}&size=5`,
                {
                    method: "GET",
                    headers: header,
                }
            );
    
            if (!response.ok) throw new Error("대댓글 조회 실패");
    
            const data = await response.json();
    
            // 데이터 포맷팅 및 상태 업데이트
            const formattedReplies = data.content.map((reply) => ({
                ...reply,
                imageUrl: reply.imageUrl
                    ? reply.imageUrl.replace("C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\", "")
                    : null,
                memberProfileImageUrl: reply.memberProfileImageUrl
                    ? `/uploads/${reply.memberProfileImageUrl}`
                    : "https://via.placeholder.com/50",
            }));
    
            setReplies((prevReplies) => ({
                ...prevReplies,
                [commentId]: [
                    ...(prevReplies[commentId] || []),
                    ...formattedReplies.filter(
                        (newReply) => !(prevReplies[commentId] || []).some((reply) => reply.commentId === newReply.commentId)
                    ),
                ],
            }));
    
            // `replyHasMore`와 `replyPage` 업데이트
            setReplyHasMore(!data.last);
            setReplyPage(pageNumber + 1); // 다음 페이지를 요청할 준비
        } catch (error) {
            console.error("대댓글 조회 에러:", error);
        } finally {
            setReplyLoading(false);
        }
    };    

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
            if (isAtBottom && hasMore && !loading) {
                fetchComments(page);
            }
        }
    };

    const handleReplyScroll = (commentId) => {
        const container = replyScrollRefs.current[commentId]?.current;
        if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 1; // 부드러운 감지
            if (isAtBottom && replyHasMore && !replyLoading) {
                fetchReplies(commentId, replyPage);
            }
        }
    };

    const handleAddComment = async () => {
        if (!accessToken && !refreshToken) {
            alert("로그인이 필요한 기능입니다.");
            window.location.href = '/login';
            return;
        }

        const content = document.getElementById("comment").value;

        if (!content && !selectedImage) {
            alert("댓글 내용 또는 이미지를 하나는 반드시 입력해야 합니다.");
            return;
        }

        const formData = new FormData();

        const comment = { content };
        formData.append("comment", new Blob([JSON.stringify(comment)], { type: 'application/json' }));

        const file = selectedImage ? selectedImage : new File([], "");
        formData.append("file", file);

        const multipartHeader = { ...header };
        delete multipartHeader["Content-Type"];

        try {
            const response = await fetch(`http://localhost:8080/api/v1/articles/${articleId}`, {
                method: "POST",
                headers: multipartHeader,
                body: formData,
            });

            if (response.ok) {
                fetchComments(0);
                setNewComment("");
                setSelectedImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                const errorResponse = await response.text();
                throw new Error(`댓글 추가 실패: ${errorResponse}`);
            }
        } catch (error) {
            alert("세션이 만료되었습니다. 다시 로그인하세요.", image);
        }
    };

    const handleAddReply = async (parentCommentId) => {
        if (!accessToken && !refreshToken) {
            alert("로그인이 필요한 기능입니다.");
            window.location.href = '/login';
            return;
        }

        const content = document.getElementById(`reply-${parentCommentId}`).value;

        if (!content && !replyImages) {
            alert("답글 내용 또는 이미지를 입력하세요.");
            return;
        }

        const formData = new FormData();

        const comment = { content };
        formData.append("comment", new Blob([JSON.stringify(comment)], { type: "application/json" }));

        const file = replyImages || new File([], "");
        formData.append("file", file);

        const multipartHeader = { ...header };
        delete multipartHeader["Content-Type"];

        try {
            const response = await fetch(`http://localhost:8080/api/v1/comments/${parentCommentId}`, {
                method: "POST",
                headers: multipartHeader,
                body: formData,
            });

            if (!response.ok) throw new Error("답글 작성 실패");

            fetchReplies(parentCommentId, 0);
            setReplyImages(null);
            setNewReply(null);
            setReplyIndex(null);
        } catch (error) {
            console.error("답글 작성 에러:", error);
            alert("에러");
        }
    };

    const handleEditComment = async (commentId) => {
        if (!accessToken && !refreshToken) {
            alert("로그인이 필요한 기능입니다.");
            window.location.href = '/login';
            return;
        }

        const formData = new FormData();
        const comment = { content: editingContent };
        formData.append("comment", new Blob([JSON.stringify(comment)], { type: "application/json" }));
        const file = editingImage || new File([], "");
        formData.append("file", file);

        const multipartHeader = { ...header };
        delete multipartHeader["Content-Type"];

        try {
            const response = await fetch(`http://localhost:8080/api/v1/comments/${commentId}`, {
                method: "PUT",
                headers: multipartHeader,
                body: formData,
            });

            if (!response.ok) throw new Error("댓글 수정 실패");

            fetchComments(0);
            setEditingCommentId(null);
            setEditingContent("");
            setEditingImage(null);
        } catch (error) {
            console.error("댓글 수정 에러:", error);
        }
    };

    const handleLikeToggle = async (commentId, likeId, isReply = false) => {
        if (!accessToken && !refreshToken) {
            alert("로그인이 필요한 기능입니다.");
            window.location.href = '/login';
            return;
        }

        try {
            if (likeId) {
                // 좋아요 취소 API 호출
                const response = await fetch(`http://localhost:8080/api/v1/likes/comments/${likeId}`, {
                    method: "DELETE",
                    headers: header,
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message || "좋아요 취소 실패");
                }

                // 상태 업데이트
                updateLikeState(commentId, null, -1);
            } else {
                // 좋아요 추가 API 호출
                const response = await fetch(`http://localhost:8080/api/v1/likes/comments/${commentId}`, {
                    method: "POST",
                    headers: header,
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message || "좋아요 추가 실패");
                }

                const data = await response.json(); // 서버에서 반환된 likeId

                // 상태 업데이트
                updateLikeState(commentId, data.likeId, 1);
            }
        } catch (error) {
            console.error("좋아요 처리 에러:", error);
        }
    };

    // 상태 업데이트를 분리하여 댓글과 대댓글 모두 관리
    const updateLikeState = (commentId, likeId, likeDelta) => {
        // 댓글 업데이트
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment.commentId === commentId
                    ? { ...comment, likeId, likeCount: comment.likeCount + likeDelta }
                    : comment
            )
        );

        // 대댓글 업데이트
        setReplies((prevReplies) =>
            Object.keys(prevReplies).reduce((newReplies, key) => {
                newReplies[key] = prevReplies[key].map((reply) =>
                    reply.commentId === commentId
                        ? { ...reply, likeId, likeCount: reply.likeCount + likeDelta }
                        : reply
                );
                return newReplies;
            }, {})
        );
    };


    const toggleRepliesVisibility = async (commentId) => {
        setReplyPage(0);
        setRepliesVisible((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));

        if (!replies[commentId] && !repliesVisible[commentId]) {
            replyScrollRefs.current[commentId] = React.createRef(); // 동적으로 ref 생성
            await fetchReplies(commentId, 0);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleDeleteImage = () => {
        setSelectedImage(null); // 선택된 이미지 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // 파일 입력창 비우기
        }
    };

    const handleReplyToggle = (index) => {
        setReplyImages(null);
        setReplyIndex(replyIndex === index ? null : index);
    };

    const handleReplyImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setReplyImages(file);
        }
    };

    const handleReplyImageDelete = () => {
        setReplyImages(null);
        if (replyFileInputRef.current) {
            replyFileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        if (!isVisible || !header) return;
        fetchComments(0);
    }, [isVisible, header]);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                fetchComments(page + 1);
            }
        });
        if (lastCommentRef.current) observer.current.observe(lastCommentRef.current);
    }, [comments, hasMore]);

    useEffect(() => {
        if (replyObserver.current) replyObserver.current.disconnect();
        replyObserver.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && replyHasMore) {
                fetchReplies(replyIndex, replyPage + 1);
            }
        });
        const lastReplyElement = replyLastCommentRef.current;
        if (lastReplyElement) replyObserver.current.observe(lastReplyElement);
    }, [replies, replyHasMore, replyIndex, replyPage]);


    const isSubmitDisabled = !newComment && !selectedImage;
    const isSubmitReplyDisabled = !newReply && !replyImages;

    function formatDateToKST(isoString) {
        const date = new Date(isoString); // ISO 시간 문자열을 Date 객체로 변환
        const options = {
            timeZone: "Asia/Seoul", // 한국 시간대 설정
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // 24시간 형식
        };

        // 한국 시간 기준으로 포맷팅
        const formattedDate = new Intl.DateTimeFormat("ko-KR", options).format(date);

        // 'YYYY. MM. DD. HH:mm' 형식 유지
        return formattedDate.replace(/,/, "").replace(/-/g, ". ");
    }


    return (
        <div className={`CommentsPanel ${isVisible ? "visible" : ""}`}>
            <button className="CommentsPanel_close" onClick={onClose}>
                닫기
            </button>
            <h3>댓글</h3>

            {/* 댓글 입력창 */}
            <div className="CommentsPanel_input">
                <input
                    id="comment"
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    style={{ marginBottom: "10px" }}
                />

                {/* 이미지 업로드 버튼 */}

                <input
                    type="file"
                    ref={fileInputRef}
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginBottom: "10px" }}
                />

                {/* 등록 버튼 */}
                <button
                    onClick={handleAddComment}
                    disabled={isSubmitDisabled}
                    style={{
                        backgroundColor: isSubmitDisabled ? "grey" : "blue",
                        color: "white",
                    }}
                >
                    등록
                </button>
            </div>

            {/* 이미지 미리보기 및 삭제 버튼 */}
            {selectedImage && (
                <div className="CommentsPanel_ImagePreview">
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="미리보기"
                        width="100"
                        height="100"
                    />
                    <button onClick={handleDeleteImage}>✖</button>
                </div>
            )}

            {/* 댓글 목록 */}
            <ul className="CommentsPanel_list"
                ref={scrollContainerRef}
                onScroll={handleScroll}>
                {comments.map((comment, index) => (
                    <div className="CommentsPanel_content">
                        <li key={comment.commentId} ref={index === comments.length - 1 ? lastCommentRef : null}>
                            <div className="CommentsPanel_User">
                                <div className="CommentsPanel_User_Img">
                                    <img
                                        src={
                                            comment.memberProfileImageUrl
                                                ? `/uploads/${comment.memberProfileImageUrl}`
                                                : "https://via.placeholder.com/50"
                                        }
                                        alt="프로필"
                                        className="CommentsPanel_User_Img"
                                    />
                                </div>
                                <div>
                                    <div>{comment.memberName}</div>
                                    <div>{formatDateToKST(comment.time)}</div>
                                    <div>{comment.content}</div>
                                    {comment.imageUrl && (
                                        <img src={`/uploads/${comment.imageUrl}`} alt="댓글 이미지" width="100" />
                                    )}
                                    <div>
                                        <span onClick={() => handleLikeToggle(comment.commentId, comment.likeId)}>
                                            {comment.likeId ? "❤️" : "♡"}
                                        </span>
                                        {comment.likeCount}

                                        {/* 답글 보기/닫기 버튼 */}
                                        <button onClick={() => toggleRepliesVisibility(comment.commentId)}>
                                            {repliesVisible[comment.commentId] ? "답글 닫기" : "답글 보기"}
                                        </button>

                                        {comment.isMe === "Me" && (
                                            <>
                                                <button>수정</button>
                                                <button>삭제</button>
                                            </>
                                        )}
                                        <button onClick={() => handleReplyToggle(index)}>답글달기</button>
                                    </div>
                                </div>
                            </div>

                            {/* 수정 입력창 */}
                            {editingCommentId === comment.commentId && (
                                <div>
                                    <input
                                        type="text"
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        placeholder="수정할 내용을 입력하세요"
                                    />
                                    <input type="file" onChange={(e) => setEditingImage(e.target.files[0])} />
                                    <button onClick={() => handleEditComment(comment.commentId)}>수정 완료</button>
                                </div>
                            )}

                            {/* 답글 입력창 */}
                            {replyIndex === index && (
                                <div className="CommentsPanel_ReplyInput">
                                    <input
                                        id={`reply-${comment.commentId}`}
                                        value={newReply}
                                        onChange={(e) => setNewReply(e.target.value)}
                                        type="text"
                                        placeholder="답글을 입력하세요"
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <input
                                        type="file"
                                        ref={replyFileInputRef}
                                        id={`reply-file-${comment.commentId}`}
                                        accept="image/*"
                                        onChange={handleReplyImageChange}
                                        style={{ marginBottom: "10px" }}
                                    />
                                    {replyImages && (
                                        <div>
                                            <img
                                                src={URL.createObjectURL(replyImages)}
                                                alt="이미지 미리보기"
                                                width="100"
                                            />
                                            <button onClick={handleReplyImageDelete}>✖</button>
                                        </div>
                                    )}
                                    <button onClick={() => handleAddReply(comment.commentId)}
                                        disabled={isSubmitReplyDisabled}
                                        style={{
                                            backgroundColor: isSubmitReplyDisabled ? "grey" : "blue",
                                            color: "white",
                                        }}>등록</button>
                                </div>
                            )}
                        </li>

                        <div className="CommentsPanel_reply_content">
                            {/* 대댓글 표시 */}
                            {repliesVisible[comment.commentId] && replies[comment.commentId] && (
                                <ul
                                    className="CommentsPanel_reply_list"
                                    ref={replyScrollRefs.current[comment.commentId]}
                                    onScroll={() => handleReplyScroll(comment.commentId)}
                                >
                                    {replies[comment.commentId].map((reply, replyIndex) => (
                                        <li
                                            key={reply.commentId}
                                            ref={replyIndex === replies[comment.commentId].length - 1 ? replyLastCommentRef : null}
                                        >
                                            <div className="CommentsPanel_Reply_User">
                                                <div className="CommentsPanel_Reply_User_Img">
                                                    {/* 프로필 이미지 */}
                                                    <img
                                                        src={reply.memberProfileImageUrl}
                                                        alt="프로필"
                                                        className="CommentsPanel_Reply_User_Img"
                                                        width="40"
                                                        height="40"
                                                    />
                                                </div>

                                                <div>
                                                    <div>{reply.memberName}</div>
                                                    <div>{formatDateToKST(reply.time)}</div>
                                                    <div>{reply.content}</div>

                                                    {/* 좋아요 버튼 */}
                                                    <div>
                                                        <span onClick={() => handleLikeToggle(reply.commentId, reply.likeId)}>
                                                            {reply.likeId ? "❤️" : "♡"}
                                                        </span>
                                                        {reply.likeCount}
                                                    </div>

                                                    {/* 답글 이미지 */}
                                                    {reply.imageUrl && (
                                                        <img src={`/uploads/${reply.imageUrl}`} alt="답글 이미지" width="100" />
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {replyLoading && <p>로딩 중...</p>}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </ul>

            {loading && <p>로딩 중...</p>}
        </div>
    );
};

export default StyleComment;