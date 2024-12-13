import React, { useState } from 'react';
import "./Registproduct.css";

const Registproduct = () => {
  const [imageList, setImageList] = useState([{ file: null, checked: false }]); // 초기 상태에 파일 입력 하나 추가
  const [existingFiles, setExistingFiles] = useState(new Set());

  const addImageInput = () => {
    setImageList(prevList => [...prevList, { file: null, checked: false }]);
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const newImages = [...imageList];
    const previousFileName = newImages[index]?.file?.name;

    if (file) {
      if (existingFiles.has(file.name) && file.name !== previousFileName) {
        alert('이미 이 이미지를 선택했습니다.');
        event.target.value = null; // 필드를 초기화
      } else {
        if (previousFileName) {
          existingFiles.delete(previousFileName); // 이전 파일 이름 제거
        }
        existingFiles.add(file.name);
        newImages[index] = { file, checked: newImages[index].checked }; // 파일 업데이트
        setImageList(newImages);
      }
    } else {
      if (previousFileName) {
        existingFiles.delete(previousFileName);
        newImages[index] = { file: null, checked: newImages[index].checked }; // 파일 초기화
        setImageList(newImages);
      }
    }
  };

  // 체크된 이미지 삭제
  const removeCheckedImages = () => {
    const newImages = imageList.filter((image) => !image.checked);
    setImageList(newImages.length > 0 ? newImages : [{ file: null, checked: false }]); // 최소 하나의 입력 필드 유지

    // 중복된 파일 이름 제거
    const newExistingFiles = new Set(newImages.map((image) => image.file?.name).filter(Boolean));
    setExistingFiles(newExistingFiles);
  };

  const toggleCheck = (index) => {
    const newImages = [...imageList];
    newImages[index].checked = !newImages[index].checked; // 체크 상태 토글
    setImageList(newImages);
  };

  return (
    <section className="registproductsection">

      <div className="list">
        <div className="introduce">
          <div className="name">
            <strong style={{ marginRight: 5, marginLeft: 10 }}>최고 관리자</strong>
            님
          </div>
        </div>
        <div className="detail">
          <div className="detail-list" />
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/reportuser")}
          >
            <div className="item">신고 유저 관리</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/adminright")}
          >
            <div className="item">관리자 권한 관리</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/categorymaker")}
          >
            <div className="item">카테고리 등록</div>
          </div>
          <div
            className="detail-select"
            onClick={() => (window.location.href = "/AdminPage/registproduct")}
          >
            <div className="item">상품 등록</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/modifyproduct")}
          >
            <div className="item">상품 수정</div>
          </div>
          <div
            className="detail-noselect"
            onClick={() => (window.location.href = "/AdminPage/admindelivery")}
          >
            <div className="item">배송 관리</div>
          </div>
        </div>
      </div>

      <div className="info">
        <div className="content-name" style={{ marginBottom: 7, fontSize: 20 }}>
          상품등록
        </div>
        <hr />
        <form id="updateItemForm" action="/api/v1/items" method="post">
          <div className='categoryselect'>
            <div className='mainselect'>
              <div className="category">상위 카테고리</div>
              <div>
                <select id="maincategory" name="maincategory" required>
                  <option value="해축">해외축구</option>
                  <option value="국축">국내축구</option>
                  <option value="야구">국내야구</option>
                  <option value="배구">국내배구</option>
                  <option value="e스포츠">E스포츠</option>
                </select>
              </div>
            </div>
            <div className='subselect'>
              <div className="category">하위 카테고리</div>
              <div>
                <select id="subcategory" name="subcategory" required>
                  <option value="#">맨체스터 유나이티드</option>
                  <option value="#">FC 인테르나치오날레 밀라노</option>
                  <option value="#">브라이튼 앤 호브 알비온 FC</option>
                  <option value="#">OK저축은행 브리온</option>
                  <option value="#">KWANGDONG FREECS</option>
                  <option value="#">6</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name">상품명</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="price">가격</label>
            <input type="number" id="price" name="price" required />
          </div>
          <div className="form-group">
            <label htmlFor="salepercent">제조사</label>
            <input type="number" id="stockQuantity" name="stockQuantity" required />
          </div>
          <div className="form-group">
            <label htmlFor="stockQuantity">수량</label>
            XS<input type="number" id="stockQuantity" name="stockQuantity" required/>
            S<input type="number" id="stockQuantity" name="stockQuantity" required/>
            M<input type="number" id="stockQuantity" name="stockQuantity" required/>
            L<input type="number" id="stockQuantity" name="stockQuantity" required/>
            XL<input type="number" id="stockQuantity" name="stockQuantity" required/>
            2XL<input type="number" id="stockQuantity" name="stockQuantity" required/>
          </div>
          <div className="form-group">
            <label>이미지 등록</label>
            <ul className="image-list" id="imageList">
              {imageList.map((item, index) => (
                <li key={index}>
                  {index > 0 && (
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      checked={item.checked} // 체크 상태 반영
                      onChange={() => toggleCheck(index)} // 체크 상태 변경
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                    required
                  />
                  {index === 0 && <span className="rep-img-label">대표 이미지</span>}
                </li>
              ))}
            </ul>
            <button type="button" className="add-image-btn" onClick={addImageInput}>
              + 이미지 추가
            </button>
            <button type="button" className="remove-image-btn" onClick={removeCheckedImages} disabled={imageList.length <= 1}>
              선택 이미지 삭제
            </button>
          </div>
          <button type="submit">등록하기</button>
        </form>
      </div>
    </section>
  );
};

export default Registproduct;
