import React, { useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Loading";

const AddDebt: React.FC = () => {
  const [debtData, setDebtData] = useState({
    debtName: "",
    lenderName: "",
    debtAmount: 0,
    interestRate: 0,
    amount: 0,
    paymentStart: new Date(),
    installment: 0,
    description: "",
    paymentPlan: [{ paymentDate: new Date(), paymentAmount: 0 }],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDebtData({
      ...debtData,
      [name]:
        name === "debtAmount" ||
        name === "interestRate" ||
        name === "amount" ||
        name === "installment"
          ? parseFloat(value)
          : value,
    });
  };

  const handleDateChange = (value: Date) => {
    setDebtData({
      ...debtData,
      paymentStart: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Lütfen giriş yapın.");
      navigate("/login");
      return;
    }

    

    try {
      const response = await axios.post(
        "https://study.logiper.com/finance/debt",
        debtData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Borç başarıyla eklendi!");
        navigate("/dashboard", { state: { refresh: true } });
      } else {
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (error: any) {
      if (error.response) {
       
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        alert(
          `Sunucu hatası: ${error.response.status}. Lütfen tekrar deneyin.`
        );
      } else if (error.request) {
       
        console.error("Request data:", error.request);
        alert(
          "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin."
        );
      } else {
      
        console.error("Error message:", error.message);
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card flex justify-content-center mt-5">

        {loading ?  (<div className="flex justify-content-center">
          <Spinner />
        </div>) : (<form
        onSubmit={handleSubmit}
        className="mt-5 flex gap-5 flex-column align-items-center"
      >
        <h1>Yeni Borç Ekle</h1>
        <InputText
          name="debtName"
          placeholder="Borç Adı"
          value={debtData.debtName}
          onChange={handleChange}
        />
        <InputText
          name="lenderName"
          placeholder="Borç Veren"
          value={debtData.lenderName}
          onChange={handleChange}
        />
        <InputText
          name="debtAmount"
          type="number"
          placeholder="Borç Miktarı"
          value={debtData.debtAmount.toString()}
          onChange={handleChange}
        />
        <InputText
          name="interestRate"
          type="number"
          placeholder="Faiz Oranı"
          value={debtData.interestRate.toString()}
          onChange={handleChange}
        />
        <InputText
          name="amount"
          type="number"
          placeholder="Miktar"
          value={debtData.amount.toString()}
          onChange={handleChange}
        />
        <Calendar
          name="paymentStart"
          placeholder="Ödeme Başlangıcı"
          value={debtData.paymentStart}
        />
        <InputText
          name="installment"
          type="number"
          placeholder="Taksit"
          value={debtData.installment.toString()}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Açıklama"
          value={debtData.description}
          onChange={handleChange}
        ></textarea>

        <Button label="Ekle" type="submit" disabled={loading} />
      </form>)}
    </div>
  );
};

export default AddDebt;
