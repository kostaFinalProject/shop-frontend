import React from 'react';
import './ProfileTags.css';
import { Link } from 'react-router-dom';

const ProfileTags = ({ tags }) => {
    return (
        <>
            <div className="Styleprofile_sns_container">
                <ul className="Styleprofile_detail_page_review_list_body">
                    {tags.map((item, index) => (
                        <Link to='/StyleDetail'>
                            <li key={index} className="Styleprofile_detail_page_review_list_item">
                                <div className="Styleprofile_detail_page_review_list_item_img">
                                    <img src={item.img} alt="tag" />
                                </div>
                                <div className="Styleprofile_detail_page_review_content">
                                    <div className="Styleprofile_detail_page_review_title">
                                        <img src={item.userImg} alt="" className="Styleprofile_detail_page_review_title_img" />
                                        <span className="Styleprofile_detail_page_review_title_id">{item.userId}</span>
                                        <span className="Styleprofile_detail_page_review_title_like">{item.likes}</span>
                                    </div>
                                    <p className="Styleprofile_etail_page_review_body_tag">{item.tags}</p>
                                </div>
                            </li>
                        </Link>

                    ))}
                </ul>
            </div></>

    );
};

export default ProfileTags;
