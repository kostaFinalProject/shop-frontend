import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './Main.css';
import { Link } from 'react-router-dom';
import ScrollUp from '../ScrollUp/ScrollUp.js';

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [bestItems, setBestItems] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [updatedArticles, setUpdatedArticles] = useState([]); // 기존 updatedArticles 상태
  const [articleId, setArticleId] =useState([]);
  const [data, setData] = useState([]);
  const [articleData, setArticleData] = useState([]);
  const [articles, setArticles] = useState([]);
  
  // 데이터 가져오기
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/items");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
       
        const updatedArticles = data.content.map((item) => ({
          itemId: item.itemId,
          itemCategory: item.itemCategory,
          manufacturer: item.manufacturer,
          name: item.name,
          price: item.price,
          itemImage: item.repImgUrl.replace('C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\', ''),
          itemStatus: item.itemStatus,
          seller: item.seller,
          // discountPercent: item.discountPercent,
          discountPercent: 10,  // 할인율 임시 설정
          discountPrice: item.discountPrice,
        }));

        // BEST ITEM: 가격 내림차순 정렬
        const sortedByPriceDesc = [...updatedArticles].sort((a, b) => b.price - a.price);
        // NEW ITEM: 아이디 내림차순 정렬
        const sortedByIdDesc = [...updatedArticles].sort((a, b) => b.itemId - a.itemId);

        // 초기 상태 설정 (8개씩만 보여줌)
        setBestItems(sortedByPriceDesc.slice(0, 8));
        setNewItems(sortedByIdDesc.slice(0, 8));
        // 전체 데이터 저장
        setAllItems(updatedArticles);
      } catch (error) {
        console.error("Error fetching items:", error.message);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };
    fetchItems(); // 함수 호출
  }, []);  // 의존성 배열

  // ---------------------------- 가져온 데이터 원하는대로 뿌려주기


  const loadMoreBestItems = () => {
    const sortedByPriceDesc = [...updatedArticles].sort((a, b) => b.price - a.price);
    setBestItems((prev) => [
      ...prev,
      ...sortedByPriceDesc.slice(prev.length, prev.length + 8),
    ]);

  };

  const loadMoreNewItems = () => {
    const sortedByIdDesc = [...updatedArticles].sort((a, b) => b.itemId - a.itemId);
    setNewItems((prev) => [
      ...prev,
      ...sortedByIdDesc.slice(prev.length, prev.length + 8),
    ]);
  };

  const isBestMoreButtonVisible = bestItems.length < allItems.length; // 전체 아이템 수와 비교
  const isNewMoreButtonVisible = newItems.length < allItems.length; // 전체 아이템 수와 비교


  // ----------------style 데이터 가져오기-----
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/articles`, {
        method: "GET",
      });
      const data = await response.json();
       
console.log("data 스타일 스타일",data);
console.log("data.content 스타일 스타일",data.content);
console.log("data.content 첫 번째 요소:", data.content[0]);
console.log("articles:", articles);
      // const processedData = data.content.map((article) => ({
      //   articleId: article.articleId,
      //   memberId: article.memberId,
      //   memberName: article.memberName,
      //   memberProfileImageUrl: article.memberProfileImageUrl
      //     ? article.memberProfileImageUrl.replace(
      //         "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
      //         ""
      //       )
      //     : null,
      //     itemImage: item.repImgUrl.replacee(
      //     "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
      //     ""
      //   ),
      //   hashtags: article.hashtags,
      //   content: article.content,
      //   likeCount: article.likeCount,
      //   likeId: article.likeId,
      //   viewCount: article.viewCount,
      // }));
      
      // console.log("processedData:", processedData); // 여기에서 processedData 로그 찍기
      // setArticleData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [articleId]);

  return (
    <main className="mainContainer">
      <article className="mainArticle slider">
        <Swiper
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false, // 사용자가 상호작용해도 autoplay가 중지되지 않도록 설정
          }}
          navigation
          pagination={{ clickable: true }}
        >
          <SwiperSlide><img src="/img/manchestercity.png" alt="Image 1" /></SwiperSlide>
          <SwiperSlide><img src="/img/realmadrid.png" alt="Image 2" /></SwiperSlide>
        </Swiper>
      </article>
      {/* Brand Leader */}
      <article className="mainArticle itemProduct">
        <div className="best">
          <h2 className="ProductTitle">BEST ITEM <span className="aaa">인기 제품을 여기서 한눈에 보세요</span></h2>

          <div className="board_list_body">
            {bestItems.map(item => (
              <Link to={`/DetailPage?itemId=${item.itemId}`}>
                <div className="item" key={item.itemId}>
                  <div className="board_img"><img src={`uploads/${item.itemImage}`} alt={item.name} /></div>
                  <div className="board_content">
                    <div className="board_title"><a href="#">{item.name}</a></div>
                    <div className="board_price">
                      {item.discountPrice && item.discountPercent !== 0 ? (
                        <>
                          <span className="original-price" style={{ textDecoration: 'line-through' }}>
                            {item.price.toLocaleString()}원
                          </span>
                          <span className="discounted-price">
                            {item.discountPrice.toLocaleString()}원
                          </span>
                          <span className="discount-rate">{item.discountPercent}%</span>
                        </>
                      ) : (
                        <span className="original-price">{item.price.toLocaleString()}원</span>
                      )}
                    </div>
                    <div className="board_name">{item.seller}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="more">
            {isBestMoreButtonVisible && <button className="moreBtn" onClick={loadMoreBestItems}>더보기</button>}
          </div>
        </div>
      </article>
      {/* New Itekm */}
      <article className="mainArticle itemProduct">
        <div className="best">
          <h2 className="ProductTitle">NEW ITEM <span className="aaa">새 제품을 여기서 한눈에 보세요</span></h2>
          <div className="board_list_body">
            {newItems.map(item => (
              <Link to={`/DetailPage?itemId=${item.itemId}`}>
                <div className="item" key={item.itemId}>
                  <div className="board_img"><img src={`uploads/${item.itemImage}`} alt={item.name} /></div>
                  <div className="board_content">
                    <div className="board_title"><a href="#">{item.name}</a></div>
                    <div className="board_price">
                      {item.discountPrice && item.discountPercent !== 0 ? (
                        <>
                          <span className="original-price" style={{ textDecoration: 'line-through' }}>
                            {item.price.toLocaleString()}원
                          </span>
                          <span className="discounted-price">
                            {item.discountPrice.toLocaleString()}원
                          </span>
                          <span className="discount-rate">{item.discountPercent}%</span>
                        </>
                      ) : (
                        <span className="original-price">{item.price.toLocaleString()}원</span>
                      )}
                    </div>
                    <div className="board_name">{item.seller}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="more">
            {isNewMoreButtonVisible && <button className="moreBtn" onClick={loadMoreNewItems}>더보기</button>}
          </div>
        </div>
      </article>


      {/* style  */}
      <article className="mainArticle teamProduct">
        <div className="styleflame">
          <div className="stylehead">
            <h2 className="ProductTitle">
              STYLE
              <span className="aaa">다양한 착용샷을 한눈에 보세요</span>
            </h2>
            <div className="flame-controls">
              <button className='prevSlide_button' id="prevSlide">◀</button>
              <button className='nextSlide_button' id="nextSlide">▶</button>
            </div>
          </div>
          <div className="flame-swiper-container">
            <ul className="flameWrapper" id="swiper-wrapper">
              {/* Style List */}
              {articles.map((article) => (
                <li
                  key={article.articleId}
                  className="swiperSlideItem"
                 
                >
                  <div className="detail_page_review_list_item_img">
                    <img
                      src={article.imageUrl ? `/uploads/${article.imageUrl}` : "https://default-image-url.com"}
                      alt={article.content || "Article Image"}
                    />
                  </div>
                  <div className="detail_page_review_content">
                    <div className="detail_page_review_title">
                      <img
                        src={article.memberProfileImageUrl ? `/uploads/${article.memberProfileImageUrl}` : "https://fakeimg.pl/50x50/"}
                        alt={article.memberName}
                        className="detail_page_review_title_img"
                      />
                      <span className="detail_page_review_title_id">{article.memberName}</span>
                      <span className="detail_page_review_title_like">
                        {article.likeId ? "❤️" : "♡"} {article.likeCount}
                      </span>
                    </div>
                    <p className="detail_page_review_body_tag">
                      {article.hashtags.map((hashtag, index) => (
                        <span key={index} className="StyleMain_sns_card_hashtag">
                          {`${hashtag} `}
                        </span>
                      ))}
                    </p>
                  </div>
                </li>
              ))}


            </ul>
          </div>
        </div>
        <ScrollUp />
      </article>


    </main>

  );
};

export default Main;
