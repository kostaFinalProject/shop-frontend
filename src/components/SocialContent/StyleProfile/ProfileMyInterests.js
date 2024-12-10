import React from 'react';
import './ProfileMyInterests.css';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
const ProfileMyInterests = ({ myInterests }) => {
    const breakpointColumnsObj = {
        default: 4,
        900: 3,
        500: 2,
        300: 1
    };
    return (
        <>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="ProfileMyInterests_detail_page_review_list_body"
                columnClassName="ProfileMyInterests_masonry_column"
            >
                {myInterests.map((item, index) => (
                    <Link to='/StyleDetail'>
                        <li key={index} className="ProfileMyInterests_detail_page_review_list_item">
                            <img src={item.img} alt="interestData" className='ProfileMyInterests_detail_page_review_list_item_img' />
                            <span className="ProfileMyInterests_detail_page_review_title_id">{item.userId}</span>
                            <p className="ProfileMyInterests_etail_page_review_MyInterests">{item.myInterests}</p>

                        </li>
                    </Link>
                ))};

            </Masonry>


            {/* <ul className="ProfileMyInterests_detail_page_review_list_body">
                    {myInterests.map((item, index) => (
                        <Link to='/StyleDetail'>
                            <li key={index} className="ProfileMyInterests_detail_page_review_list_item">
                                    <img src={item.img} alt="interestData" className='ProfileMyInterests_detail_page_review_list_item_img' />
                                    <span className="ProfileMyInterests_detail_page_review_title_id">{item.userId}</span>                                   
                                        <p className="ProfileMyInterests_etail_page_review_MyInterests">{item.myInterests}</p>

                            </li>
                        </Link>

                    ))}
                </ul> */}
        </>

    );
};

export default ProfileMyInterests;