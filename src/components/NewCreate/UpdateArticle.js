import React, { useState, useRef, useEffect } from "react";
import "./UpdateArticle.css";
import { useParams, useNavigate } from 'react-router-dom';

const UpdateArticle = () => {
  const [images, setImages] = useState([{ id: Date.now(), file: null, checked: false }]); // 이미지 리스트
  const [existingFiles, setExistingFiles] = useState(new Set()); // 중복된 이미지를 막기 위한 Set
  const [products, setProducts] = useState([]); // 상품 배열
  const [keywords, setKeywords] = useState([]); // 키워드 배열
  const [formData, setFormData] = useState({
    tag_product: "@상품",
    tag_keyword: "#",
    form_content: "",
  });  // 폼 데이터

  const [hashTags, setHashTags] = useState([]);  // 해시태그 목록
  const formRef = useRef(null);
  const { articleId } = useParams(); // URL에서 articleId 가져오기
  const navigate = useNavigate();    // 수정 완료 후 이동을 위해 사용

  // 데이터 불러오기 함수
  const fetchArticleData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/articles/${articleId}`);
      if (!response.ok) throw new Error("게시글 데이터를 가져오지 못했습니다.");

      const data = await response.json();
      setFormData({
        tag_product: data.tag_product || "",
        tag_keyword: data.hashtags || "",
        form_content: data.content || "",
      });
      setImages(data.imageUrl || []);
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchArticleData();
    }
  }, [articleId]);

  // 유효성 검사 함수
  const validateForm = () => {
    const requiredFields = [{ name: "form_content", label: "내용" }];

    // 필수 필드 체크
    for (let field of requiredFields) {
      const value = formData[field.name]?.trim();
      if (!value) {
        alert(`${field.label}을(를) 입력해주세요.`);
        return false;
      }
    }

    // 이미지 첨부 체크
    if (images.length === 0 || images.every((image) => !image.file)) {
      alert("적어도 하나의 이미지를 업로드해야 합니다.");
      return false;
    }

    return true; // 모든 유효성 검사 통과
  };

  // 폼 제출 함수
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // 유효성 검사 실패 시 종료

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const article = {
        hashtags: hashTags, 
        content: formData.form_content,
        itemIds: formData.itemIds,
      };
      // FormData 객체 생성
  const UpdateArticle = new FormData();
  UpdateArticle.append(
    "article",
    new Blob([JSON.stringify(article)], { type: "application/json" })
  );
      // 이미지 파일 추가
      images.forEach((image) => {
        if (image.file) {
          UpdateArticle.append("files", image.file);  // "files" 필드명으로 파일을 여러 개 추가
        }
      });
      // FormData 객체의 내용을 출력
  for (let [key, value] of UpdateArticle.entries()) {
    console.log(`${key}:`, value);
  }


      const response = await fetch(`http://localhost:8080/api/v1/articles/${articleId}`, {
        method: "PUT",
        headers: {
          Authorization: accessToken,
          "Refresh-Token": refreshToken,
        },
        body: UpdateArticle,
      });

      console.log("fetch 후 UpdateArticle ", UpdateArticle);

      if (!response.ok) throw new Error("수정 실패");

      alert("게시글 수정 완료!");
      navigate(`/StyleDetail/${articleId}`);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  // 이미지 추가 함수
  const addImageInput = () => {
    if (images.length >= 5) {
      alert('최대 5개의 이미지만 업로드할 수 있습니다.');
      return;
    }

    setImages((prevImages) => [
      ...prevImages,
      { id: Date.now(), file: null, fileName: '', checked: false },
    ]);


  };

  // 파일 선택 시 처리
  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const newImages = [...images];
    const previousFileName = newImages[index]?.fileName || ''; // 기존 파일 이름 확인

    // 방어 코드: 객체 구조가 아닌 경우 초기화
    if (typeof newImages[index] !== 'object') {
      newImages[index] = { file: null, fileName: '', id: index };
    }

    if (file) {
      if (existingFiles.has(file.name) && file.name !== previousFileName) {
        alert('이미 이 이미지를 선택했습니다.');
        event.target.value = null; // 필드를 초기화
        return;
      }

      // 기존 파일 이름 제거
      if (previousFileName) {
        setExistingFiles((prevFiles) => {
          const newFiles = new Set(prevFiles);
          newFiles.delete(previousFileName);
          return newFiles;
        });
      }
      // 새 파일 이름 추가
      setExistingFiles((prevFiles) => new Set(prevFiles).add(file.name));

      // 이미지 업데이트
      newImages[index].file = file;
      newImages[index].fileName = file.name;
      setImages(newImages);
    } else {
      // 파일이 제거된 경우 처리
      if (previousFileName) {
        setExistingFiles((prevFiles) => {
          const newFiles = new Set(prevFiles);
          newFiles.delete(previousFileName);
          return newFiles;
        });
      }
      newImages[index].file = null;
      newImages[index].fileName = '';
      setImages(newImages);
    }
  };


  // 체크박스 상태 변경
  const handleCheckboxChange = (index) => {
    const newImages = [...images];
    newImages[index].checked = !newImages[index].checked;
    setImages(newImages);
  };

  // 체크된 이미지 삭제
  const removeCheckedImages = () => {
    const newImages = images.filter((image) => !image.checked);
    setImages(newImages);

    // 중복된 파일 이름 제거
    const newExistingFiles = new Set(newImages.map((image) => image.fileName));
    setExistingFiles(newExistingFiles);
  };

  // 대표 이미지 레이블 업데이트
  const updateRepresentativeLabel = () => {
    const items = images;

    // 대표 이미지 레이블을 첫 번째 항목에만 추가
    return items.length > 0 ? (
      <span className="rep-img-label">대표 이미지</span>
    ) : null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 상품 배열 추가
  const handleProductChange = (e) => {
    const value = e.target.value.trim();

    // 중복된 값이 아닌 경우만 추가
    if (value && !products.includes(value)) {
      setProducts((prev) => [...prev, value]);
    }
  };

  // 키워드 배열 추가
  const handleKeywordChange = (e) => {
    let value = e.target.value.trim();

    // #이 없으면 강제로 추가
    if (value && !value.startsWith("#")) {
      value = "#" + value;
    }

    // 중복된 키워드가 아닌 경우만 추가
    if (value && !keywords.includes(value)) {
      setKeywords((prev) => [...prev, value]);
    }

    // 해시태그 추출
    const hashtags = value.match(/#[a-zA-Z0-9ㄱ-ㅎ가-힣?!.,-_]+/g);  // 해시태그 추출 정규식
    if (hashtags) {
      setHashTags(hashtags);
    } else {
      setHashTags([]);
    }


    // formData 업데이트
    setFormData((prev) => ({ ...prev, tag_keyword: value }));
  };

  // --------------------------게시글 삭제 fetch-----------
  const handleDeleteArticle = async () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return; // 확인창 표시

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const response = await fetch(`http://localhost:8080/api/v1/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: accessToken,
          "Refresh-Token": refreshToken,
        },
      });

      if (!response.ok) throw new Error("삭제 실패");

      alert("게시글이 삭제되었습니다.");
      navigate("/StyleMain"); // 삭제 후 메인 페이지 또는 다른 경로로 이동
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };


  return (
    <div className="UpdateArticle_full_screen">
      <form ref={formRef} className="UpdateArticle_Form" method="put" onSubmit={handleFormSubmit} >
        <h2 className="UpdateArticle_TitleText">SNS STYLE 글 수정</h2>


        <div className="UpdateArticle_BoxLine">
          {/* 상품 */}
          <div className="UpdateArticle_text_cover">
            <label className="UpdateArticle_Name" htmlFor="tag_product">
              상품
            </label>
            <div className="UpdateArticle_Input_cover">
              <input
                type="text"
                id="tag_product"
                name="tag_product"
                className="UpdateArticle_Text_input"
                value={formData.tag_product}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleProductChange(e)}
                onFocus={(e) => { if (e.target.value === "@상품") e.target.value = ""; }}
                onBlur={(e) => { if (e.target.value === "") e.target.value = "@상품"; }}
              />
            </div>
          </div>
          {/* 키워드 */}
          <div className="UpdateArticle_text_cover">
            <label className="UpdateArticle_Name" htmlFor="tag_keyword">
              키워드
            </label>
            <div className="UpdateArticle_Input_cover">
              <input
                type="text"
                id="tag_keyword"
                name="tag_keyword"
                className="UpdateArticle_Text_input"
                value={formData.tag_keyword}
                onChange={handleKeywordChange}  // 키워드 변경 시 해시태그 처리
                onKeyDown={(e) => e.key === "Enter" && handleKeywordChange(e)}
                onFocus={(e) => { if (e.target.value === "#") e.target.value = ""; }}
                onBlur={(e) => { if (e.target.value === "") e.target.value = "#"; }}
              />
            </div>
          </div>

          {/* 해시태그 목록 표시 */}
          <div className="UpdateArticle_hashTagsContainer">
            {hashTags.map((tag, index) => (
              <span key={index} className="hashTagItem">
                {tag}
              </span>
            ))}
          </div>
          {/* 내용  */}
          <div className="cover_form_TextArea">
            <label className="UpdateArticle_Name_TextArea" htmlFor="form_content">
              내용
            </label>
            <textarea
              id="form_content"
              name="form_content"
              rows="3"
              value={formData.form_content}
              onChange={handleInputChange}
            />
          </div>
          {/* 이미지 등록 */}
          <div className="UpdateArticle_text_cover_file">
            <label className="UpdateArticle_Name_file">이미지 등록</label>
            <ul className="UpdateArticle_image_list_file">
              {images.map((item, index) => (
                <li key={item.id} className="UpdateArticle_f">
                  {index === 0 && updateRepresentativeLabel()}
                  {index !== 0 && (
                    <input
                      type="checkbox"
                      className="img-checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  )}
                  <input
                    type="file"
                    id="files"
                    accept="image/*"
                    required
                    onChange={(e) => handleFileChange(index, e)}
                  />
                  <span>{item.fileName}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="UpdateArticle_Btn_add" onClick={addImageInput}>
              + 이미지 추가
            </button>

            <button
              type="button"
              className="UpdateArticle_Btn_remove"
              onClick={removeCheckedImages}
              disabled={images.length <= 1}
            >
              체크된 이미지 삭제
            </button>

          </div>
          {/* 버튼 */}
          <div className="UpdateArticle_text_cover_Btn">
            <button type="button" className="UpdateArticle_listBtn">
              목록
            </button>
            <button type="submit" className="UpdateArticle_primaryBtn">
              수정 완료
            </button>
            <button type="button" className="UpdateArticle_dangerBtn">
              취소
            </button>
            <button
              type="button"
              className="UpdateArticle_deleteBtn"
              style={{ background: "red" }}
              onClick={handleDeleteArticle} // 삭제 핸들러 연결
            >
              삭제
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default UpdateArticle;
