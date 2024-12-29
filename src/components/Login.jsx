import { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from 'axios'; 
import { useHistory } from 'react-router-dom';


const initialValues = {
  email: '',
  password: '',
}

export default function Login() {
  const [formData, setFormData] = useState(initialValues);
  const history = useHistory();

  const handleChange =(event) => {
    const { name, value } = event.target;
    const newState = { ...formData, [name]: value };
    setFormData(newState);
  } 
  const handleSubmit = (event) => {
    event.preventDefault();
    axios. get("https://6540a96145bedb25bfc247b4.mockapi.io/api/login")
    .then(response => {
      const user = response.data.find(item => item.email == formData.email && item.password === formData.password);
   
      if(user){
      history.push('/main');
    }else {
      history.push('/error');
    }
  })
  .catch((error)=>{
    console.warn(error);
  })
}
  return (
    <Form onSubmit ={handleSubmit}>
      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange = {handleChange}
          value = {formData.email}
        />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Enter your password "
          type="password"
          onChange = {handleChange}
          value = {formData.password}
        />
      </FormGroup>
      <Button color="primary">Sign In</Button>
    </Form>
  );
 
}

