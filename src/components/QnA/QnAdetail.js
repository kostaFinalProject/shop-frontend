import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./QnAdetail.css";

const QnAdetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questionDetail, setQuestionDetail] = useState(null);
  const [answerDetail, setAnswerDetail] = useState(null);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionComment, setQuestionComment] = useState(""); // 질문 내용 상태
  const [answerComment, setAnswerComment] = useState(""); // 답변 내용 상태
  const [editing, setEditing] = useState(false); // 답변 수정 여부 상태
  const [editingQuestion, setEditingQuestion] = useState(false); // 질문 수정 여부 상태
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const queryParams = new URLSearchParams(location.search);
  const questionId = queryParams.get("questionId");

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true); // 데이터 로딩 시작
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        if (accessToken && refreshToken) {
          headers["Authorization"] = accessToken;
          headers["Refresh-Token"] = refreshToken;
        }

        const questionResponse = await fetch(
          `http://localhost:8080/api/v1/qna/${questionId}`,
          { headers }
        );

        if (!questionResponse.ok) {
          throw new Error(`질문 조회 실패: ${questionResponse.status}`);
        }
        const questionData = await questionResponse.json();

        // 이미지 경로 포맷팅
        const formattedRepImgYn = questionData.repImgYn.replace(
          "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
          ""
        );

        setQuestionDetail({
          ...questionData,
          repImgYn: formattedRepImgYn,
        });

        // 질문 수정 모드로 전환 시 questionComment를 기존 질문 내용으로 설정
        if (editingQuestion) {
          setQuestionComment(questionData.content); // 질문 수정 시 텍스트 영역 초기화
        }

        const answerResponse = await fetch(
          `http://localhost:8080/api/v1/qna/answer/${questionId}`
        );
        if (answerResponse.status === 200) {
          const answerData = await answerResponse.json();

          if (answerData && Object.keys(answerData).length > 0) {
            setAnswerDetail(answerData);
            setAnswerComment(answerData.content);
          } else {
            setAnswerDetail(null);
            setAnswerComment("");
          }
        }
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("질문 또는 답변 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false); // 데이터 로딩 완료
      }
    };

    if (questionId) {
      fetchDetails();
    }
  }, [questionId, editingQuestion]);

  const handleQuestionUpdate = async (e) => {
    e.preventDefault();

    if (!accessToken || !refreshToken) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    if (!questionComment.trim()) {
      alert("질문 내용을 입력해주세요.");
      return;
    }

    console.log(questionDetail.questionId)

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/qna/question/${questionDetail.questionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
            "Refresh-Token": refreshToken,
          },
          body: JSON.stringify({
            itemId: questionDetail.itemId,
            title: questionTitle,
            content: questionComment,
          }),
        }
      );

      if (response.ok) {
        alert("질문이 성공적으로 수정되었습니다.");
        setEditingQuestion(false);
        const updatedQuestionResponse = await fetch(
          `http://localhost:8080/api/v1/qna/${questionDetail.questionId}`
        );
        const updatedQuestion = await updatedQuestionResponse.json();
        setQuestionDetail(updatedQuestion);
      } else {
        throw new Error("질문 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error updating question:", err);
      setError("질문 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken || !refreshToken) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    if (!answerComment.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/qna/answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
            "Refresh-Token": refreshToken,
          },
          body: JSON.stringify({
            questionId: questionId,
            content: answerComment,
          }),
        }
      );

      if (response.ok) {
        alert("답변이 성공적으로 저장되었습니다.");
        window.location.reload();
      } else {
        throw new Error("답변 저장에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error saving comment:", err);
      setError("답변 저장 중 오류가 발생했습니다.");
    }
  };

  const handleCommentUpdate = async (e) => {
    e.preventDefault();

    if (!accessToken || !refreshToken) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    if (!answerComment.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/qna/answer/${answerDetail.answerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
            "Refresh-Token": refreshToken,
          },
          body: JSON.stringify({
            content: answerComment,
          }),
        }
      );

      if (response.ok) {
        alert("답변이 성공적으로 수정되었습니다.");
        setEditing(false);
        const updatedAnswerResponse = await fetch(
          `http://localhost:8080/api/v1/qna/answer/${questionId}`
        );
        const updatedAnswer = await updatedAnswerResponse.json();
        setAnswerDetail(updatedAnswer);
      } else {
        throw new Error("답변 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("답변 수정 중 오류가 발생했습니다.");
    }
  };

  const handleClick = () => {
    navigate("/QnA");
  };

  const handleQuestionDelete = async () => {
    try {
      // 질문 삭제 요청
      const response = await fetch(`http://localhost:8080/api/v1/qna/question/${questionDetail.questionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
          'Refresh-Token': refreshToken,
        },
      });

      if (!response.ok) {
        throw new Error('질문 삭제에 실패했습니다.');
      }

      // 질문 삭제 후 답변 삭제
      const answerResponse = await fetch(`http://localhost:8080/api/v1/qna/answer/${questionDetail.questionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
          'Refresh-Token': refreshToken,
        },
      });

      if (answerResponse.ok) {
        setAnswerDetail(null); // 답변 삭제 후 프론트엔드에서 답변 상태를 null로 설정
      }

      // 질문 삭제 후 상태 업데이트
      setQuestionDetail(null);  // 질문 삭제 후 프론트엔드에서 질문 상태를 null로 설정
      setQuestionComment("");  // 질문 내용 초기화

      alert("질문과 답변이 성공적으로 삭제되었습니다.");
      navigate("/QnA");  // 질문 목록으로 이동

    } catch (error) {
      console.error("Error deleting question:", error);
      setError("질문 삭제에 실패했습니다.");
    }
  };

  // console.log(questionDetail.answerId)

  const handleCommentDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/qna/answer/${answerDetail.answerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
          'Refresh-Token': refreshToken,
        },
      });

      if (!response.ok) {
        throw new Error('댓글 삭제에 실패했습니다.');
      }

      // 답변 삭제 후 상태 갱신
      setAnswerDetail(null);  // 삭제된 상태로 변경
      setAnswerComment("");   // 답변 내용 초기화

      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("댓글 삭제에 실패했습니다.");
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}. ${month}. ${day}. ${hours}:${minutes}`;
  };

  return (
    <div className="QnAdetail_qna-container">
      <h2>Q&A</h2>

      {isLoading ? (
        <div className="QnAdetail_loading">로딩중...</div>
      ) : (
        <>
          {questionDetail && (
            <>
              <div className="QnAdetail_product-info">
                <img
                  src={`/uploads/${questionDetail.repImgYn}`}
                  alt="Product"
                  className="product-image"
                />
                <div className="QnAdetail_product-details">
                  <h3 className="QnAdetail_product-title">
                    {questionDetail.itemName}
                  </h3>
                  <p className="QnAdetail_product-price">
                    {questionDetail.itemPrice}원
                  </p>
                </div>
              </div>

              <div className="QnAdetail_qna-section">
                <h3 className="QnAdetail_qna-title">{questionDetail.title}</h3>
                <p className="QnAdetail_qna-user">
                  {questionDetail.userId} {formatDate(questionDetail.createAt)}
                </p>
                <button className="QnAdetail_qna-list-button" onClick={handleClick}>
                  목록
                </button>
              </div>

              <div>
                {editingQuestion ? (
                  <form onSubmit={handleQuestionUpdate}>
                    <textarea
                      className="QnAdetail_comment-textarea"
                      value={questionTitle}
                      onChange={(e) => setQuestionTitle(e.target.value)}
                    ></textarea>
                    <textarea
                      className="QnAdetail_comment-textarea"
                      value={questionComment}
                      onChange={(e) => setQuestionComment(e.target.value)}
                    ></textarea>
                    <button type="submit" className="QnAdetail_submit-button">
                      수정 완료
                    </button>
                    <button
                      type="button"
                      className="QnAdetail_cancel-button"
                      onClick={() => setEditingQuestion(false)}
                    >
                      취소
                    </button>
                  </form>
                ) : (
                  <p className="QnAdetail_content">{questionDetail.content}</p>
                )}

                {questionDetail.isMe === 'Me' && !editingQuestion && (
                  <div className="QnAdetail_button-group">
                    <button
                      className="QnAdetail_qna-list-button"
                      onClick={handleQuestionDelete}
                    >
                      삭제
                    </button>
                    <button
                      className="QnAdetail_qna-list-button"
                      onClick={() => setEditingQuestion(true)}
                    >
                      수정
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="QnAdetail_comment-section">
            {answerDetail !== null ? (
              <div className="QnAdetail_comment-display">
                <p>{answerDetail.memberNickname} | {answerDetail.createAt}</p>
                {editing ? (
                  <form onSubmit={handleCommentUpdate}>
                    <textarea
                      className="QnAdetail_comment-textarea"
                      value={answerComment}
                      onChange={(e) => setAnswerComment(e.target.value)}
                    ></textarea>
                    <button type="submit" className="QnAdetail_submit-button">
                      수정
                    </button>
                  </form>
                ) : (
                  <p>{answerDetail.content}</p>
                )}

                {/* 수정과 삭제 버튼을 조건부 렌더링 */}
                {!editing && (
                  <>
                    <button
                      className="QnAdetail_qna-list-button"
                      onClick={handleCommentDelete}
                    >
                      삭제
                    </button>
                    <button
                      className="QnAdetail_qna-list-button"
                      onClick={() => setEditing(true)}
                    >
                      수정
                    </button>
                  </>
                )}
              </div>
            ) : (
              // 댓글이 없으면 댓글 입력 폼을 표시
              <form className="QnAdetail_comment-form" onSubmit={handleCommentSubmit}>
                <h5 className="QnAdetail_comment-title">답변 작성</h5>
                <textarea
                  className="QnAdetail_comment-textarea"
                  placeholder="답변 내용을 입력하세요"
                  value={answerComment}
                  onChange={(e) => setAnswerComment(e.target.value)}
                ></textarea>
                <button type="submit" className="QnAdetail_submit-button">
                  등록
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QnAdetail;