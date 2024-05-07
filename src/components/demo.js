import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const MyForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    id: '', // תעודת זהות
    email: '', // הוספת שדה אימייל
  });

  const [errors, setErrors] = useState({
    id: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // בדיקה של תעודת הזהות והצגת הודעת שגיאה במידה שאינה חוקית
    if (name === 'id' && value.length !== 9) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id: 'תעודת הזהות חייבת להכיל 9 ספרות בדיוק',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // בדיקה שכל השדות הם שדות חובה
    if (formData.firstName && formData.lastName && formData.grade && formData.id && formData.email) {
      console.log('נשלח: ', formData);
    } else {
      alert('אנא מלא את כל השדות');
    }
  };

  // סגנון לתיבות טקסט עם רקע אדום במקרה של שגיאה
  const inputStyle = {
    backgroundColor: errors.id ? 'lightcoral' : 'lightgreen',
  };

  // סגנון לכפתור בהיר/כהה בהתאם למילוי של כל השדות
  const buttonStyle = {
    backgroundColor: formData.firstName && formData.lastName && formData.grade && formData.id && formData.email
      ? 'darkgreen'
      : 'lightgreen',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">שם:</label>
        <InputText
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="lastName">משפחה:</label>
        <InputText
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="grade">כיתה:</label>
        <InputText
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="id">תעודת זהות:</label>
        <InputText
          id="id"
          name="id"
          value={formData.id}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        {errors.id && <p style={{ color: 'red' }}>{errors.id}</p>}
      </div>
      <div>
        <label htmlFor="email">אימייל:</label>
        <InputText
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <Button type="submit" label="שלח" style={buttonStyle} />
    </form>
  );
};

export default MyForm;
