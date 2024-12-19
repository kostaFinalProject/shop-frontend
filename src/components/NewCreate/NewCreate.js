import React, { useState, useRef, useEffect } from "react";
import "./NewCreate.css";

const NewCreate = () => {
  const [images, setImages] = useState([{ id: Date.now(), file: null, checked: false }]); // 이미지 리스트
  const [existingFiles, setExistingFiles] = useState(new Set()); // 중복된 이미지를 막기 위한 Set
  const [products, setProducts] = useState([]); // 상품 배열
  const [keywords, setKeywords] = useState([]); // 키워드 배열



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
    tag_product: "@상품",
    tag_keyword: "#",
    form_content: "",
  });

  const [hashTags, setHashTags] = useState([]);  // 해시태그 목록

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


  const formRef = useRef(null);


  // 폼 제출 시 추가적인 검증 및 처리
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사: 필수 항목 체크
    const requiredFields = [
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
    }

    // 이미지 첨부 체크
    if (images.length === 0 || images.every((image) => !image.file)) {
      alert('적어도 하나의 이미지를 업로드해야 합니다.');
      return;
    }

    const article = {
      hashtags: hashTags, //배열로 가야하나 여기는 배열이 아닌듯 확인하기기
      content: formData.form_content,
      itemIds: selectedItems.map((item) => item.itemId), // 선택된 상품 ID
      selectedItems: selectedItems.map((item) => ({
        itemId: item.itemId,
        imgUrl: item.imgUrl,
        name: item.name,
        price: item.price,
      })), // 선택된 상품 정보 추가
    };
    // FormData 객체 생성
    const formDataToSend = new FormData();
    formDataToSend.append(
      "article",
      new Blob([JSON.stringify(article)], { type: "application/json" })
    );

    // 이미지 파일들을 FormData에 추가
    images.forEach((image) => {
      if (image.file) {
        formDataToSend.append("files", image.file);  // "files" 필드명으로 파일을 여러 개 추가
      }
    });


    // FormData 객체의 내용을 출력
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }
    console.log("article : " + article);
    // 로컬 스토리지에서 인증 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // 서버로 데이터 전송
    try {
      const response = await fetch("http://localhost:8080/api/v1/articles", {
        method: "POST",
        headers: {
          Authorization: accessToken,
          "Refresh-Token": refreshToken,
        },
        body: formDataToSend,
      });

      console.log("formDataToSend", formDataToSend);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log("서버 응답:", result);

      alert("게시글이 성공적으로 업로드되었습니다!");
      setFormData({
        tag_product: "@상품",
        tag_keyword: "#",
        form_content: "",
      });
      setImages([]);
      setExistingFiles(new Set());
    } catch (error) {
      console.error("게시글 업로드 실패:", error);
      alert("게시글 업로드 중 오류가 발생했습니다.");
    }
  };




  //상품검색
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [items, setItems] = useState([]);

  // 실시간 검색 함수
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true); // 검색 중 상태
    try {
      const response = await fetch(`http://localhost:8080/api/v1/items`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (Array.isArray(data.content)) {
        const filteredResults = data.content.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults); // 필터링된 결과 설정
      } else {
        console.error("검색 결과가 배열이 아닙니다:", data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("상품 검색 오류:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false); // 검색 완료 상태
    }
  };

  // 검색어 변경 처리
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query); // 실시간 검색 호출
  };

  // 검색 결과에서 상품 선택
  const handleProductSelect = (product) => {
    if (selectedItems.find((item) => item.itemId === product.itemId)) {
      // 중복 선택 시 경고 메시지
      alert("이미 선택된 상품입니다. 중복 선택이 불가능합니다.");
      return;
    }

    if (selectedItems.length >= 4) {
      // 최대 4개 제한 초과 시 경고 메시지
      alert("최대 4개의 상품만 선택 가능합니다.");
      return;
    }
    setSelectedItems((prev) => [...prev, product]); // 선택된 상품 추가
    setSearchQuery(""); // 검색어 초기화
    setSearchResults([]); // 검색 결과 초기화
  };

  // 데이터 가져오기
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/items")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // 전체 데이터 구조 확인
        setItems(data.content); // content 배열만 상태에 저장
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // 아이템 삭제 함수
  const removeItem = (itemId) => {
    setSelectedItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
  };

  //여기까지




  return (
    <div className="NewCreate_full_screen">
      <form ref={formRef} className="NewCreate_Form" method="post" onSubmit={handleFormSubmit} >
        <h2 className="NewCreate_TitleText">SNS STYLE 글 작성</h2>

        <div className="NewCreate_BoxLine">
          {/* 이미지 입력 */}

          <div className="NewCreate_text_cover">
            <label className="NewCreate_Name" htmlFor="tag_product">
              상품 검색
            </label>
            <div className="NewCreate_Input_cover">
              <input
                type="text"
                id="tag_product"
                name="tag_product"
                className="NewCreate_Text_input"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="상품명을 입력하세요"
              />
              <ul className="search-results">
                {Array.isArray(searchResults) &&
                  searchResults.map((product) => (
                    <li
                      key={product.itemId}
                      onClick={() => handleProductSelect(product)}
                      className="search-result-item"
                    >
                      {product.name}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* 선택된 상품만 표시 */}
          <div className="flex_direction_row">
            {selectedItems.map((item) => (
              <div key={item.itemId} className="NewCreate_selected_products">
                <div className="NewCreate_products">
                  <div className="StyleDetail_Lookup_List_Img">
                    <img src={`/uploads/${item.imgUrl}`} alt={item.name} />
                  </div>

                  <div className="StyleDetail_Lookup_List_Content">
                    <p>{item.name}</p>
                  </div>

                  <div className="StyleDetail_Lookup_List_Price">
                    <p>￦ {item.price}원</p>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    className="NewCreate_remove_button"
                    onClick={() => removeItem(item.itemId)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
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
                onKeyDown={(e) => e.key === "Enter" && handleKeywordChange(e)}
                onFocus={(e) => { if (e.target.value === "#") e.target.value = ""; }}
                onBlur={(e) => { if (e.target.value === "") e.target.value = "#"; }}
              />
            </div>
          </div>

          {/* 해시태그 목록 표시 */}
          <div className="NewCreate_hashTagsContainer">
            {hashTags.map((tag, index) => (
              <span key={index} className="hashTagItem">
                {tag}
              </span>
            ))}
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
                    id="files"
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


