import React from 'react';
import './ProfilePosts.css';
import { Link } from 'react-router-dom';

const ProfilePosts = ({ posts }) => {

    return (
        <>
            <ul className="Styleprofile_detail_page_review_list_body">
                {posts.map((item, index) => (
                    <Link to={`/StyleDetail/${item.articleId}`} key={index}>
                        <li className="Styleprofile_detail_page_review_list_item">
                            <div className="Styleprofile_detail_page_review_list_item_img">
                                {/* 이미지 파일을 URL로 표시 */}
                               <img src={`/uploads/${item.itemImage}`} alt="" />
                            </div>
                            <div className="Styleprofile_detail_page_review_content">
                                <div className="Styleprofile_detail_page_review_title">
                                    {/* 사용자 이미지 */}
                                    <img src={item.memberProfileImageUrl || 'default-profile-image.jpg'} alt="" className="Styleprofile_detail_page_review_title_img" />
                                    <span className="Styleprofile_detail_page_review_title_id">{item.memberName}</span>
                                    <span className="Styleprofile_detail_page_review_title_like">{item.likeCount}</span>
                                </div>
                                {/* 태그 표시 */}
                                <p className="Styleprofile_etail_page_review_body_tag">
                                    {item.hashtags.join(' ')}
                                </p>
                                {/* 콘텐츠 표시 */}
                                <p className="Styleprofile_detail_page_review_body_content">{item.content}</p>
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </>

    );
};

export default ProfilePosts;
