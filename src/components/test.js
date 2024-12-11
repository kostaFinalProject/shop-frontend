import React, { useState } from 'react';

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <div style={styles.container}>
      <label htmlFor="start-date" style={styles.label}>시작 날짜:</label>
      <input
        type="date"
        id="start-date"
        value={startDate}
        onChange={handleStartDateChange}
        style={styles.input}
      />
      
      <label htmlFor="end-date" style={styles.label}>종료 날짜:</label>
      <input
        type="date"
        id="end-date"
        value={endDate}
        onChange={handleEndDateChange}
        style={styles.input}
      />
      
      {startDate && endDate && (
        <p style={styles.selectedDate}>
          선택한 날짜 범위: {startDate}부터 {endDate}까지
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
  },
  label: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '15px',
  },
  selectedDate: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#333',
  },
};

export default DateRangePicker;
