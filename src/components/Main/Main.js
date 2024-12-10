import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './Main.css';

const Main = () => {
  const items = [
    {
      id: 1,
      image: "/img/ACuniform.jpg",
      title: "ADIDAS 아르헨티나 1994 RETRO AWAY #10 (XS~2XL)",
      soldCount: 120,
      originalPrice: 209000,
      discountedPrice: 99000,
      discountRate: 53,
      description: "Official Licensed Product"
    },
    {
      id: 2,
      image: "/img/ALUniform.avif",
      title: "NIKE 브라질 2002 홈 유니폼 #9 (S~L)",
      soldCount: 200,
      originalPrice: 199000,
      discountedPrice: 129000,
      discountRate: 35,
      description: "Official Replica Jersey"
    },
    {
      id: 3,
      image: "/img/MCUuniform.avif",
      title: "MAN UTD 2008 HOME KIT #7 (M~XL)",
      soldCount: 80,
      originalPrice: 219000,
      discountedPrice: 149000,
      discountRate: 32,
      description: "Official Replica Jersey"
    },
    {
      id: 4,
      image: "/img/CFCuniform.avif",
      title: "CHELSEA 2020 AWAY KIT #10 (S~L)",
      soldCount: 250,
      originalPrice: 179000,
      discountedPrice: 119000,
      discountRate: 34,
      description: "Official Replica Jersey"
    },
    {
      id: 5,
      image: "/img/BarcelonaUniform.jpg",
      title: "FC BARCELONA 2021 HOME KIT #9 (M~XL)",
      soldCount: 500,
      originalPrice: 189000,
      discountedPrice: 129000,
      discountRate: 31,
      description: "Official Replica Jersey"
    },
    {
      id: 6,
      image: "/img/PSGuniform.avif",
      title: "PSG 2022 HOME KIT #30 (M~L)",
      soldCount: 300,
      originalPrice: 229000,
      discountedPrice: 159000,
      discountRate: 30,
      description: "Official Replica Jersey"
    },
    {
      id: 7,
      image: "/img/RealMadridUnifom.avif",
      title: "REAL MADRID 2020 AWAY KIT #7 (S~L)",
      soldCount: 110,
      originalPrice: 199000,
      discountedPrice: 129000,
      discountRate: 35,
      description: "Official Replica Jersey"
    },
    {
      id: 8,
      image: "/img/Juniform.avif",
      title: "JUVENTUS 2019 HOME KIT #10 (M~XL)",
      soldCount: 190,
      originalPrice: 209000,
      discountedPrice: 139000,
      discountRate: 34,
      description: "Official Replica Jersey"
    },
    {
      id: 9,
      image: "/img/MCCuniform.avif",
      title: "JUVENTUS 2009 HOME KIT #11 (M~XL)",
      soldCount: 90,
      originalPrice: 109000,
      discountedPrice: 0,
      discountRate: 0,
      description: "Official Replica Jersey"
    },
    // 나머지 아이템들도 동일하게 작성...
  ];

  const [bestItems, setBestItems] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [allItems, setAllItems] = useState(items); // 전체 아이템을 저장하는 상태 추가

  useEffect(() => {
    const sortedBySales = [...items].sort((a, b) => b.soldCount - a.soldCount);
    const sortedByIdDesc = [...items].sort((a, b) => b.id - a.id);

    setBestItems(sortedBySales.slice(0, 8));
    setNewItems(sortedByIdDesc.slice(0, 8));

    const loadBestItems = () => {
      setBestItems(prev => {
        const nextItems = [...prev, ...sortedBySales.slice(prev.length, prev.length + 8)];
        return nextItems;
      });
    };

    const loadNewItems = () => {
      setNewItems(prev => {
        const nextItems = [...prev, ...sortedByIdDesc.slice(prev.length, prev.length + 8)];
        return nextItems;
      });
    };

    document.getElementById("bestMoreBtn").addEventListener("click", loadBestItems);
    document.getElementById("newMoreBtn").addEventListener("click", loadNewItems);

    return () => {
      document.getElementById("bestMoreBtn").removeEventListener("click", loadBestItems);
      document.getElementById("newMoreBtn").removeEventListener("click", loadNewItems);
    };
  }, []);

  const isBestMoreButtonVisible = bestItems.length < allItems.length; // 전체 아이템 수와 비교
  const isNewMoreButtonVisible = newItems.length < allItems.length; // 전체 아이템 수와 비교



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

      <article className="mainArticle itemProduct">
        <div className="best">
          <h2 className="ProductTitle">BEST ITEM <span className="aaa">인기 제품을 여기서 한눈에 보세요</span></h2>
          <div className="board_list_body">
            {bestItems.map(item => (
              <div className="item" key={item.id}>
                <div className="board_img"><img src={item.image} alt={item.title} /></div>
                <div className="board_content">
                  <div className="board_title"><a href="#">{item.title}</a></div>
                  <div className="board_price">
                    {item.discountedPrice && item.discountRate !== 0 ? (
                      <>
                        <span className="original-price" style={{ textDecoration: 'line-through' }}>
                          {item.originalPrice.toLocaleString()}원
                        </span>
                        <span className="discounted-price">
                          {item.discountedPrice.toLocaleString()}원
                        </span>
                        <span className="discount-rate">{item.discountRate}%</span>
                      </>
                    ) : (
                      <span className="original-price">{item.originalPrice.toLocaleString()}원</span>
                    )}
                  </div>
                  <div className="board_name">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="more">
            {isBestMoreButtonVisible && <button className="moreBtn" id="bestMoreBtn">더보기</button>}
          </div>
        </div>
      </article>

      <article className="mainArticle itemProduct">
        <div className="best">
          <h2 className="ProductTitle">NEW ITEM <span className="aaa">새 제품을 여기서 한눈에 보세요</span></h2>
          <div className="board_list_body">
            {newItems.map(item => (
              <div className="item" key={item.id}>
                <div className="board_img"><img src={item.image} alt={item.title} /></div>
                <div className="board_content">
                  <div className="board_title"><a href="#">{item.title}</a></div>
                  <div className="board_price">
                    {item.discountedPrice && item.discountRate !== 0 ? (
                      <>
                        <span className="original-price" style={{ textDecoration: 'line-through' }}>
                          {item.originalPrice.toLocaleString()}원
                        </span>
                        <span className="discounted-price">
                          {item.discountedPrice.toLocaleString()}원
                        </span>
                        <span className="discount-rate">{item.discountRate}%</span>
                      </>
                    ) : (
                      <span className="original-price">{item.originalPrice.toLocaleString()}원</span>
                    )}
                  </div>
                  <div className="board_name">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="more">
            {isNewMoreButtonVisible && <button className="moreBtn" id="newMoreBtn">더보기</button>}
          </div>
        </div>
      </article>

      <article className="mainArticle teamProduct">
        <div className="styleflame">
          <div className="stylehead">
            <h2 className="ProductTitle">
              STYLE
              <span className="aaa">다양한 착용샷을 한눈에 보세요</span>
            </h2>
            <div className="flame-controls">
              <button id="prevSlide">◀</button>
              <button id="nextSlide">▶</button>
            </div>
          </div>
          <div className="flame-swiper-container">
            <ul className="flameWrapper" id="swiper-wrapper">
              <li className="swiperSlideItem">
                <div className="detail_page_review_list_item_img">
                  <img
                    src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202411/7d090c9573a58fe7fb7553e5cc8ea5b2.jpg"
                    alt=""
                  />
                </div>
                <div className="detail_page_review_content">
                  <div className="detail_page_review_title">
                    <img
                      src="https://fakeimg.pl/26x26/"
                      alt=""
                      className="detail_page_review_title_img"
                    />
                    <span className="detail_page_review_title_id">아이디</span>
                    <span className="detail_page_review_title_like">♡4</span>
                    {/* 하트 이미지 다시 넣기  */}
                  </div>
                  <p className="detail_page_review_body_tag">
                    #겨울코디추천 #겨울코디추천 #아우터추천 #연말선물 #연말룩
                    #사이즈팁 #KICKS
                  </p>
                </div>
              </li>
              <li className="swiperSlideItem">
                <div className="detail_page_review_list_item_img">
                  <img
                    src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202411/7d090c9573a58fe7fb7553e5cc8ea5b2.jpg"
                    alt=""
                  />
                </div>
                <div className="detail_page_review_content">
                  <div className="detail_page_review_title">
                    <img
                      src="https://fakeimg.pl/26x26/"
                      alt=""
                      className="detail_page_review_title_img"
                    />
                    <span className="detail_page_review_title_id">아이디</span>
                    <span className="detail_page_review_title_like">♡4</span>
                    {/* 하트 이미지 다시 넣기  */}
                  </div>
                  <p className="detail_page_review_body_tag">
                    #겨울코디추천 #겨울코디추천 #아우터추천 #연말선물 #연말룩
                    #사이즈팁 #KICKS
                  </p>
                </div>
              </li>
              <li className="swiperSlideItem">
                <div className="detail_page_review_list_item_img">
                  <img
                    src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202411/7d090c9573a58fe7fb7553e5cc8ea5b2.jpg"
                    alt=""
                  />
                </div>
                <div className="detail_page_review_content">
                  <div className="detail_page_review_title">
                    <img
                      src="https://fakeimg.pl/26x26/"
                      alt=""
                      className="detail_page_review_title_img"
                    />
                    <span className="detail_page_review_title_id">아이디</span>
                    <span className="detail_page_review_title_like">♡4</span>
                    {/* 하트 이미지 다시 넣기  */}
                  </div>
                  <p className="detail_page_review_body_tag">
                    #겨울코디추천 #겨울코디추천 #아우터추천 #연말선물 #연말룩
                    #사이즈팁 #KICKS
                  </p>
                </div>
              </li>
              <li className="swiperSlideItem">
                <div className="detail_page_review_list_item_img">
                  <img
                    src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202411/7d090c9573a58fe7fb7553e5cc8ea5b2.jpg"
                    alt=""
                  />
                </div>
                <div className="detail_page_review_content">
                  <div className="detail_page_review_title">
                    <img
                      src="https://fakeimg.pl/26x26/"
                      alt=""
                      className="detail_page_review_title_img"
                    />
                    <span className="detail_page_review_title_id">아이디</span>
                    <span className="detail_page_review_title_like">♡4</span>
                    {/* 하트 이미지 다시 넣기  */}
                  </div>
                  <p className="detail_page_review_body_tag">
                    #겨울코디추천 #겨울코디추천 #아우터추천 #연말선물 #연말룩
                    #사이즈팁 #KICKS
                  </p>
                </div>
              </li>
              <li className="swiperSlideItem">
                <div className="detail_page_review_list_item_img">
                  <img
                    src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202411/7d090c9573a58fe7fb7553e5cc8ea5b2.jpg"
                    alt=""
                  />
                </div>
                <div className="detail_page_review_content">
                  <div className="detail_page_review_title">
                    <img
                      src="https://fakeimg.pl/26x26/"
                      alt=""
                      className="detail_page_review_title_img"
                    />
                    <span className="detail_page_review_title_id">아이디</span>
                    <span className="detail_page_review_title_like">♡4</span>
                    {/* 하트 이미지 다시 넣기  */}
                  </div>
                  <p className="detail_page_review_body_tag">
                    #겨울코디추천 #겨울코디추천 #아우터추천 #연말선물 #연말룩
                    #사이즈팁 #KICKS
                  </p>
                </div>
              </li>
              <li className="swiperSlideItem">
                <div className="detail_page_review_list_item_img">
                  <img
                    src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202411/7d090c9573a58fe7fb7553e5cc8ea5b2.jpg"
                    alt=""
                  />
                </div>
                <div className="detail_page_review_content">
                  <div className="detail_page_review_title">
                    <img
                      src="https://fakeimg.pl/26x26/"
                      alt=""
                      className="detail_page_review_title_img"
                    />
                    <span className="detail_page_review_title_id">아이디</span>
                    <span className="detail_page_review_title_like">♡4</span>
                    {/* 하트 이미지 다시 넣기  */}
                  </div>
                  <p className="detail_page_review_body_tag">
                    #겨울코디추천 #겨울코디추천 #아우터추천 #연말선물 #연말룩
                    #사이즈팁 #KICKS
                  </p>
                </div>
              </li>
              <li className="swiperSlideItem">
                <div className="detail_page_review_list_item_img">
                  <img
                    src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202411/7d090c9573a58fe7fb7553e5cc8ea5b2.jpg"
                    alt=""
                  />
                </div>
                <div className="detail_page_review_content">
                  <div className="detail_page_review_title">
                    <img
                      src="https://fakeimg.pl/26x26/"
                      alt=""
                      className="detail_page_review_title_img"
                    />
                    <span className="detail_page_review_title_id">아이디</span>
                    <span className="detail_page_review_title_like">♡4</span>
                    {/* 하트 이미지 다시 넣기  */}
                  </div>
                  <p className="detail_page_review_body_tag">
                    #겨울코디추천 #겨울코디추천 #아우터추천 #연말선물 #연말룩
                    #사이즈팁 #KICKS
                  </p>
                </div>
              </li>
              <li className="swiperSlideItem">
                <div className="detail_page_review_list_item_img">
                  <img
                    src="https://cafe24.poxo.com/ec01/enemy0000/fYw07Q+e08011Z5Qzbz300jECh5aaMmmDMQ7QH7NAQ9NK2EXhqgvmfbzfda0mDNO/Jp2ZgYE1irrrDpzeiP8fA==/_/web/product/big/202411/7d090c9573a58fe7fb7553e5cc8ea5b2.jpg"
                    alt=""
                  />
                </div>
                <div className="detail_page_review_content">
                  <div className="detail_page_review_title">
                    <img
                      src="https://fakeimg.pl/26x26/"
                      alt=""
                      className="detail_page_review_title_img"
                    />
                    <span className="detail_page_review_title_id">아이디</span>
                    <span className="detail_page_review_title_like">♡4</span>
                    {/* 하트 이미지 다시 넣기  */}
                  </div>
                  <p className="detail_page_review_body_tag">
                    #겨울코디추천 #겨울코디추천 #아우터추천 #연말선물 #연말룩
                    #사이즈팁 #KICKS
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </article>


    </main>
  );
};

export default Main;
