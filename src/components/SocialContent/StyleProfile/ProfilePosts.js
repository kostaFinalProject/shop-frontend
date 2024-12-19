import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProfilePosts = ({ headers, profile }) => {
    const [article, setArticle] = useState(null);

    // 비공개 계정 여부 판단
    const isPrivateAccount = profile.memberStatus === "PRIVATE" && profile.follow === "Not Follow";

    useEffect(() => {
        if (!isPrivateAccount) {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:8080/api/v1/members/articles/${profile.memberId}`,
                        {
                            method: "GET",
                            headers: headers,
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        const processedData = data.content.map((article) => ({
                            articleId: article.articleId,
                            memberId: article.memberId,
                            memberName: article.memberName,
                            memberProfileImageUrl: article.memberProfileImageUrl
                                ? article.memberProfileImageUrl.replace(
                                      "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                                      ""
                                  )
                                : null,
                            imageUrl: article.imageUrl.replace(
                                "C:\\Users\\JungHyunSu\\react\\soccershop\\public\\uploads\\",
                                ""
                            ),
                            content: article.content,
                            likeCount: article.likeCount,
                            likeId: article.likeId,
                            viewCount: article.viewCount,
                            hashtags: article.hashtags || [],
                        }));
                        setArticle(processedData);
                    } else {
                        console.error("Error fetching posts:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [isPrivateAccount, profile.memberId, headers]);

    if (isPrivateAccount) {
        return <div className="private-account-message" style={{
            width: "100%",
            height: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}>비공개 계정입니다.</div>;
    }

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <ul className="Styleprofile_detail_page_review_list_body">
          {article.length === 0 ? (
            <div
              className="private-account-message"
              style={{
                width: "100%",
                height: "500px",
                display: "flex",
                justifyContent: "center", // 가로 중앙 정렬
                alignItems: "center", // 세로 중앙 정렬
                textAlign: "center",
              }}
            >
              등록된 게시물이 없습니다.
            </div>
          ) : (
            article.map((article) => (
              <Link
                to={`/StyleDetail?articleId=${article.articleId}`}
                key={article.articleId}
                className="Styleprofile_detail_page_review_list_item"
              >
                <li>
                  {/* 게시물 이미지 */}
                  <div className="Styleprofile_detail_page_review_list_item_img">
                    <img
                      src={`/uploads/${article.imageUrl}`}
                      alt="post"
                      className="Styleprofile_detail_page_review_list_img"
                    />
                  </div>
      
                  {/* 게시물 정보 */}
                  <div className="Styleprofile_detail_page_review_content">
                    {/* 제목 영역 */}
                    <div className="Styleprofile_detail_page_review_title">
                      <img
                        src={
                          article.memberProfileImageUrl
                            ? `/uploads/${article.memberProfileImageUrl}`
                            : "https://fakeimg.pl/50x50/"
                        }
                        alt="profile"
                        className="Styleprofile_detail_page_review_title_img"
                      />
                      <span className="Styleprofile_detail_page_review_title_id">
                        {article.memberName}
                      </span>
                      <span style={{ fontSize: "15px" }}>
                        {article.likeId ? "❤️" : "♡"}
                      </span>
                      <span className="Styleprofile_detail_page_review_title_like">
                        {article.likeCount}
                      </span>
                    </div>
      
                    {/* 해시태그 */}
                    <p className="Styleprofile_detail_page_review_body_tag">
                      {article.hashtags.join(", ")}
                    </p>
                  </div>
                </li>
              </Link>
            ))
          )}
        </ul>
      );
};

export default ProfilePosts;
