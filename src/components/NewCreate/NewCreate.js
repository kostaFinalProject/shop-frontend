import React, { useState, useRef } from "react";
import "./NewCreate.css";

const NewCreate = () => {
  const [images, setImages] = useState([]); // 이미지 리스트
  const [existingFiles, setExistingFiles] = useState(new Set()); // 중복된 이미지를 막기 위한 Set

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
    const previousFileName = newImages[index].fileName;

    if (file) {
      if (existingFiles.has(file.name) && file.name !== previousFileName) {
        alert('이미 이 이미지를 선택했습니다.');
        event.target.value = null; // 필드를 초기화
        return;
      }

      // 중복이 아닐 경우, Set에 추가하고 파일 이름 업데이트
      if (previousFileName) {
        setExistingFiles((prevFiles) => {
          const newFiles = new Set(prevFiles);
          newFiles.delete(previousFileName); // 이전 파일 이름 제거
          return newFiles;
        });
      }
      setExistingFiles((prevFiles) => new Set(prevFiles).add(file.name));

      newImages[index].file = file;
      newImages[index].fileName = file.name;
      setImages(newImages);
    } else {
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

  const [formData, setFormData] = useState({
    tag_id: "@아이디",
    tag_product: "@상품",
    tag_keyword: "@키워드",
    form_title: "제목을 입력해주세요",
    form_content: "",
  });

  const [hashTags, setHashTags] = useState([]);  // 해시태그 목록

  // 해시태그 입력 처리
  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, tag_keyword: value }));

    // 해시태그 추출
    const hashtags = value.match(/@[a-zA-Z0-9ㄱ-ㅎ가-힣?!.,-_]+/g);  // 해시태그 추출 정규식
    if (hashtags) {
      setHashTags(hashtags);
    } else {
      setHashTags([]);
    }
  };

    // 해시태그 삭제
    const removeHashTag = (tag) => {
      setHashTags((prevTags) => prevTags.filter((t) => t !== tag));
      setFormData((prev) => ({ ...prev, tag_keyword: prev.tag_keyword.replace(tag, "") }));
    };


  const formRef = useRef(null);


  // 폼 제출 시 추가적인 검증 및 처리
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사: 필수 항목 체크
    const requiredFields = [
      // { name: "tag_id", label: "태그 아이디" },
      // { name: "tag_product", label: "상품" },
      // { name: "tag_keyword", label: "키워드" },
      { name: "form_title", label: "제목" },
      { name: "form_content", label: "내용" },
    ];

    // 입력 필드 체크
    for (let field of requiredFields) {
      const value = formData[field.name]?.trim();

      // 빈 필드 확인
      if (!value || value === "") {
        alert(`${field.label}을(를) 입력해주세요.`);
        return;
      }

      // // @로 시작하는지 확인 (태그아이디, 상품, 키워드)
      // if (["tag_id", "tag_product"].includes(field.name)) {
      //   if (!value.startsWith("@")) {
      //     alert(`${field.label}은(는) @로 시작해야 합니다.`);
      //     return;
      //   }
      // }
    }

    // 이미지 첨부 체크
    if (images.length === 0 || images.every((image) => !image.file)) {
      alert('적어도 하나의 이미지를 업로드해야 합니다.');
      return;
    }

    // 제출 데이터 확인
    const submittedData = {
      ...formData,
      hashTags,  // 해시태그 추가
      images: images.map((image) => image.fileName), // 업로드된 이미지 파일 이름 리스트
    };

    console.log("폼 제출 데이터:", submittedData);

    alert("폼이 성공적으로 제출되었습니다!");


    setFormData({
      tag_id: "@아이디",
      tag_product: "@상품",
      tag_keyword: "@키워드",
      form_title: "제목을 입력해주세요",
      form_content: "",
    });
    setImages([]);
    setExistingFiles(new Set());
  };

  return (
    <div className="NewCreate_full_screen">
      <form ref={formRef} className="NewCreate_Form" onSubmit={handleFormSubmit}>
        <h2 className="NewCreate_TitleText">게시글 작성</h2>
        {/* 옵션 선택 */}
        <div className="NewCreate_option_form">
          <div className="NewCreate_option_form_select">
            <select className="NewCreate_select_list">
              <option value="*" disabled>- 스포츠를 선택해 주세요 -</option>
              <option value="1">해외축구</option>
              <option value="2">국내축구</option>
              <option value="3">축구 국가대표</option>
              <option value="4">한국야구</option>
              <option value="5">여자배구</option>
              <option value="6">E-스포츠</option>
            </select>
          </div>
          <div className="NewCreate_option_form_select">
            <select className="NewCreate_select_list">
              <option value="*" disabled>- 구단을 선택해 주세요 -</option>
              <option value="1">울산 HD FC</option>
              <option value="2">김천상무 FC</option>
              <option value="3">강원 FC</option>
              <option value="4">포항 노틸러스</option>
              <option value="5">FC서울</option>
              <option value="6">수원FC</option>
              <option value="7">제주 유나이티드</option>
              <option value="8">대전 하나 시티즌</option>
              <option value="9">광주 FC</option>
              <option value="10">전북 현대 모터스</option>
              <option value="11">대구FC</option>
              <option value="12">인천 유나이티드</option>
            </select>
          </div>
        </div>
        <div className="NewCreate_option_form">
          <div className="NewCreate_option_form_select">
            <select className="NewCreate_select_list">
              <option value="*" disabled>- 사이즈를 선택해 주세요 -</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="XXXL">XXXL</option>
            </select>
          </div>
          <div className="NewCreate_option_form_select">
            <select className="NewCreate_select_list">
              <option value="*" disabled>- 홈 어웨이 선택해 주세요 -</option>
              <option value="1">홈</option>
              <option value="2">어웨이</option>
            </select>
          </div>
        </div>


        {/* 이미지 입력 */}
        <div className="NewCreate_BoxLine">
          <div className="NewCreate_text_cover_file">
            <label className="NewCreate_Name_file">이미지 등록</label>
            <ul className="NewCreate_image_list_file">
              {images.map((item, index) => (
                <li key={item.id} className="NewCreate_f">
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
                    name="files"
                    accept="image/*"
                    required
                    onChange={(e) => handleFileChange(index, e)}
                  />
                  <span>{item.fileName}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="NewCreate_Btn_add" onClick={addImageInput}>
              + 이미지 추가
            </button>

            <button
              type="button"
              className="NewCreate_Btn_remove"
              onClick={removeCheckedImages}
              disabled={images.length <= 1}
            >
              체크된 이미지 삭제
            </button>

          </div>

          {/* 태그 및 텍스트 입력란
          <div className="NewCreate_text_cover">
            <label className="NewCreate_Name" htmlFor="tag_id">
              태그 아이디
            </label>
            <div className="NewCreate_Input_cover">
              <input
                type="text"
                id="tag_id"
                name="tag_id"
                className="NewCreate_Text_input"
                value={formData.tag_id}
                onChange={handleInputChange}
                onFocus={(e) => { if (e.target.value === "@아이디") e.target.value = ""; }}
                onBlur={(e) => { if (e.target.value === "") e.target.value = "@아이디"; }}
              />
            </div>
          </div> */}

          <div className="NewCreate_text_cover">
            <label className="NewCreate_Name" htmlFor="tag_product">
              상품
            </label>
            <div className="NewCreate_Input_cover">
              <input
                type="text"
                id="tag_product"
                name="tag_product"
                className="NewCreate_Text_input"
                value={formData.tag_product}
                onChange={handleInputChange}
                onFocus={(e) => { if (e.target.value === "@상품") e.target.value = ""; }}
                onBlur={(e) => { if (e.target.value === "") e.target.value = "@상품"; }}
              />
            </div>
          </div>

          <div className="NewCreate_text_cover">
            <label className="NewCreate_Name" htmlFor="tag_keyword">
              키워드
            </label>
            <div className="NewCreate_Input_cover">
              <input
                type="text"
                id="tag_keyword"
                name="tag_keyword"
                className="NewCreate_Text_input"
                value={formData.tag_keyword}
                onChange={handleKeywordChange}  // 키워드 변경 시 해시태그 처리
              />
            </div>
          </div>

          {/* 해시태그 목록 표시 */}
          <div className="hashTagsContainer">
            {hashTags.map((tag, index) => (
              <span key={index} className="hashTagItem">
                {tag}
                <button type="button" onClick={() => removeHashTag(tag)}>x</button>
              </span>
            ))}
          </div>

          <div className="NewCreate_text_cover">
            <label className="NewCreate_Name" htmlFor="form_title">
              제목
            </label>
            <div className="NewCreate_Input_cover">
              <input
                type="text"
                id="form_title"
                name="form_title"
                className="NewCreate_Text_input"
                value={formData.form_title}
                onChange={handleInputChange}
                onFocus={(e) => { if (e.target.value === "제목을 입력해주세요") e.target.value = ""; }}
                onBlur={(e) => { if (e.target.value === "") e.target.value = "제목을 입력해주세요"; }}
              />
            </div>
          </div>

          <div className="cover_form_TextArea">
            <label className="NewCreate_Name_TextArea" htmlFor="form_content">
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

          <div className="NewCreate_text_cover_Btn">
            <button type="button" className="NewCreate_listBtn">
              목록
            </button>
            <button type="submit" className="NewCreate_primaryBtn">
              작성완료
            </button>
            <button type="button" className="NewCreate_dangerBtn">
              취소
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewCreate;


