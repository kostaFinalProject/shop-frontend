import React, { useState } from 'react';
import "./Modifyproduct.css";
import AdminNavi from './AdminComponent/AdminNavi';

const Modifyproduct = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('page1');

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // 스크롤 막기
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // 스크롤 다시 활성화

  };

  const openPage = (pageName) => {
    setActivePage(pageName);
  };

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
    <section className="modifyproductsection">

      <AdminNavi />
      <div className="info">
        <div className="content-name" style={{ marginBottom: 7, fontSize: 20 }}>
          상품수정
        </div>
        <hr />
        <div className="typelist">
          <table border={0} summary="">
            <colgroup>
              <col style={{ width: "auto" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">이름</th>
                <th scope="col">가격</th>
                <th scope="col">할인율</th>
                <th scope="col">재고</th>
                <th scope="col">버튼</th>
              </tr>
            </thead>
            <tbody className="data">
              <tr>
                <td scope="col">ADIDAS 아르헨티나 1994 RETRO AWAY #10 (XS~2XL)</td>
                <td scope="col">180000</td>
                <td scope="col">10%</td>
                <td scope="col">500</td>
                <td scope="col">
                  <button id="modal-open" onClick={openModal}>수정</button>
                  <button id="delete">삭제</button>

                  {isModalOpen && (
                    <div id="popup" className="modal" onClick={closeModal}>
                      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {/* 탭 */}
                        <div className="tabs">
                            수정하기
                        </div>
                        {/* 페이지 내용 */}
                        <div id="page1" className={`page ${activePage === "page1" ? "active" : ""}`}>
                          <article>
                            <form id="updateItemForm">
                              <div className='categoryselect'>
                                <div className='mainselect'>
                                  <div className="selectcategory">상위 카테고리</div>
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
                                  <div className="selectcategory">하위 카테고리</div>
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
                                <label htmlFor="salepercent">할인율</label>
                                <input type="number" id="stockQuantity" name="stockQuantity" required />
                              </div>
                              <div className="form-group">
                                <label htmlFor="stockQuantity">수량</label>
                                XS<input type="number" id="stockQuantity" name="stockQuantity" required />
                                S<input type="number" id="stockQuantity" name="stockQuantity" required />
                                M<input type="number" id="stockQuantity" name="stockQuantity" required />
                                L<input type="number" id="stockQuantity" name="stockQuantity" required />
                                XL<input type="number" id="stockQuantity" name="stockQuantity" required />
                                2XL<input type="number" id="stockQuantity" name="stockQuantity" required />
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
                              <button type="submit">수정하기</button>
                            </form>
                          </article>
                        </div>
                        {/* 모달 닫기 버튼 */}
                        <button id="close" onClick={closeModal}>Close</button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="loading" style={{ display: "none" }}>
            <i className="xi-spinner-3 xi spin" />
          </p>
          <p className="empty">주문 내역이 없습니다.</p>
        </div>
      </div>
    </section >
  );
};

export default Modifyproduct;
