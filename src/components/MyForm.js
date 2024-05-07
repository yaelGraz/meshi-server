import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
import { Form, useNavigate } from 'react-router-dom';
import './MyForm.css';


const MyForm = () => {

  const navigate=useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    id: '', // תעודת זהות
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
    
  };
 
const handleSubmit = (e) => {
  e.preventDefault();
// בדיקה של תעודת הזהות והצגת הודעת שגיאה במידה שאינה חוקית
 if (formData["id"].length !== 9) {
  setErrors((prevErrors) => ({
    ...prevErrors,
    id: 'תעודת הזהות חייבת להכיל 9 ספרות בדיוק',
  }));
} 
else if(formData["firstName"]===''){
  setErrors((prevErrors) => ({
    ...prevErrors,
    firstName: 'שדה חובה',
  }));
}
else if(formData["lastName"]===''){
  setErrors((prevErrors) => ({
    ...prevErrors,
    lastName: 'שדה חובה',
  }));
}
else if(formData["grade"]===''){
  setErrors((prevErrors) => ({
    ...prevErrors,
    grade: 'שדה חובה',
  }));
}
else {
  setErrors((prevErrors) => ({
    ...prevErrors,
    id: '',
    firstName:'',
    lastName:'',
    grade:''
    
  })
  );
  navigate('/pie');
}
  // בדיקה שכל השדות הם שדות חובה
  if (formData.firstName && formData.lastName && formData.grade && formData.id ) {
    console.log('נשלח: ', formData);
   
  } else {
    alert('אנא מלא את כל השדות');
  }
};

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
    <form id="form" onSubmit={handleSubmit}>
      <div class="lain">
        <InputText
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder='שם פרטי'
          required
        />
         {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
      </div>
      <div class="lain">
        
         <InputText
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder='שם משפחה'
          required
         
        />
         {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
       </div>
       <div class="lain">
         <InputText
          id="grade"
           name="grade"
          value={formData.grade}
          onChange={handleChange}
           placeholder='כיתה'
          required
         
         />
          {errors.grade && <p style={{ color: 'red' }}>{errors.grade}</p>}
      </div>
      <div class="lain">
        <InputText
          id="id"
          name="id"
          value={formData.id}
          onChange={handleChange}
          required
          placeholder='תעודת זהות'
        />
        {errors.id && <p style={{ color: 'red' }}>{errors.id}</p>}
      </div>
      <Button  id="submit" type="submit" label="היכנס" style={buttonStyle}/>
     </form>
  );
};

export default MyForm;

