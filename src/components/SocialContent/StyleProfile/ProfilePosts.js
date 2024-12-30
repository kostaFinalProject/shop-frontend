import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProfilePosts.css";

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
    return <div className="Styleprofile_private_account_message">비공개 계정입니다.</div>;
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
      <div className="ProfilePosts_Box">
    <ul className="ProfilePosts_list_body">
      {article.length === 0 ? (
        <div className="Styleprofile_private_account_message">
          등록된 게시물이 없습니다.
        </div>
      ) : (
        article.map((article) => (
          <Link
            to={`/StyleDetail?articleId=${article.articleId}`}
            key={article.articleId}
            className="ProfilePosts_list_item"
          >
            <li>
              {/* 게시물 이미지 */}
              <div className="ProfilePosts_list_item_Box">
                <img
                  src={`/uploads/${article.imageUrl}`}
                  alt="post"
                  className="ProfilePosts_list_img"
                />
              </div>

              {/* 게시물 정보 */}
              <div className="ProfilePosts_content">
                {/* 제목 영역 */}
                <div className="ProfilePosts_title_Box">
                  <div className="ProfilePosts_title">
                    <img
                      src={
                        article.memberProfileImageUrl
                          ? `/uploads/${article.memberProfileImageUrl}`
                          : "https://fakeimg.pl/50x50/"
                      }
                      alt="profile"
                      className="ProfilePosts_title_img"
                    />
                    <span className="ProfilePosts_title_id">
                      {article.memberName}
                    </span>
                    <span style={{ fontSize: "15px" }}>
                      {article.likeId ? "❤️" : "♡"}
                    </span>
                    <span className="ProfilePosts_title_like">
                      {article.likeCount}
                    </span>
                  </div>
                </div>

                {/* 해시태그 */}
                <div className="ProfilePosts_body_tag_Box">
                  <p className="ProfilePosts_body_tag">
                    {article.hashtags.join(", ")}
                  </p>
                </div>

              </div>
            </li>
          </Link>
        ))
      )}
    </ul>
    </div>
  );
};

export default ProfilePosts;
