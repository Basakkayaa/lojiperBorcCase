import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate kancasını içe aktarın
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from 'primereact/divider';
import "/node_modules/primeflex/primeflex.css";
import '../assets/css/style.css';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const toast = useRef<Toast>(null);
  const navigate = useNavigate(); // useNavigate kancasını kullanarak navigate fonksiyonunu alın

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://study.logiper.com/auth/register",
        formData
      );
      console.log("Response:", response.data);

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Registration successful!', life: 3000 });

      navigate('/login'); 
      
    } catch (error) {
      console.error("There was an error registering!", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Registration failed!', life: 3000 });
    }
  };

  const header = <div className="font-bold mb-3">Pick a password</div>;
  const footer = (
    <>
      <Divider />
      <div className="surface-200">
        <p className="mt-2 surface-200">Suggestions</p>
        <ul className="pl-2 ml-2 mt-0 line-height-3 surface-200">
          <li>At least one lowercase</li>
          <li>At least one uppercase</li>
          <li>At least one numeric</li>
          <li>Minimum 8 characters</li>
        </ul>
      </div>
    </>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card flex justify-content-center mt-5 ">
        <form onSubmit={handleSubmit} className="mt-5 flex gap-5 flex-column align-items-center box-shadow p-8 border-round-2xl">
          <h1 className="text-white">Sign Up</h1>
          <FloatLabel>
            <label htmlFor="name" className="pl-2">
              Name
            </label>
            <InputText
              id="name"
              className="w-20rem"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FloatLabel>

          <FloatLabel>
            <label htmlFor="email" className="pl-2">
              Email
            </label>
            <InputText
              id="email"
              name="email"
              className="w-20rem"
              value={formData.email}
              onChange={handleChange}
            />
          </FloatLabel>

          <div className="card flex justify-content-center">
            <Password
              name="password"
              value={formData.password}
              onChange={handleChange}
              header={header}
              footer={footer}
              inputClassName="w-20rem"
            />
          </div>
          <Button label="Submit" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
