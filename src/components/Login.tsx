import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "/node_modules/primeflex/primeflex.css";

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const response = await axios.post(
            "https://study.logiper.com/auth/login",
            loginData
        );

     
        localStorage.setItem('token', response.data.data);

        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Login successful!', life: 3000 });

       
        navigate('/dashboard');
    } catch (error) {
        console.error("There was an error logging in!", error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Login failed!', life: 3000 });
    }
};

  return (
    <div>
      <Toast ref={toast} className="shadow-8" />
      <div className="card flex justify-content-center mt-5">
        <form onSubmit={handleSubmit} className="mt-5 flex gap-5 flex-column align-items-center box-shadow p-8 border-round-2xl">
          <h1 className="text-white">Login Page</h1>
          <FloatLabel>
            <label htmlFor="email" className="pl-2">
              Email
            </label>
            <InputText
              id="email"
              name="email"
              className="w-20rem"
              value={loginData.email}
              onChange={handleChange}
            />
          </FloatLabel>

          <div className="card flex justify-content-center">
          <FloatLabel>
            <Password
              name="password"
              value={loginData.password}
              onChange={handleChange}
              toggleMask
              inputClassName="w-20rem"
            />
            <label htmlFor="password">Password</label>
            </FloatLabel>
          </div>
          <Button label="Login" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Login;
