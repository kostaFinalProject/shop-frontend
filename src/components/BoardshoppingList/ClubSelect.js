import React, { useState } from 'react';
import './ClubSelect.css';

function ClubSelect() {
  const clubs = [
    '리버풀', '토트넘', '첼시', '아스날', '맨시티', 
    '맨유', '뉴캐슬', '레알마드리드', '바르셀로나', 
    '바이에른 뮌헨', 'PSG'
  ];

  const [activeClub, setActiveClub] = useState(null);

  const handleClubClick = (index) => {
    setActiveClub(index); // 클릭된 클럽의 인덱스를 상태로 저장
  };

  return (
    <div className="select_club">
      <ul className="select_club_ul">
        {clubs.map((club, index) => (
          <li key={index}>
            <a
              href="#"
              className={activeClub === index ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault(); // 기본 동작 방지
                handleClubClick(index);
              }}
            >
              {club}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClubSelect;