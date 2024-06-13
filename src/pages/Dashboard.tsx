import React, { useState, useEffect } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';
import { TreeNode } from 'primereact/treenode';
import { addMonths, parseISO, format } from 'date-fns';

interface PaymentPlan {
    paymentDate: string;
    paymentAmount: number;
}

interface Debt {
    id: string;
    debtName: string;
    lenderName: string;
    debtAmount: number;
    interestRate: number;
    amount: number;
    paymentStart: string;
    installment: number;
    description: string;
    paymentPlan: PaymentPlan[];
    isPaid: boolean;
}

const Dashboard: React.FC = () => {
    const [debts, setDebts] = useState<TreeNode[]>([]);
    const navigate = useNavigate();

    const fetchDebts = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('https://study.logiper.com/finance/debt', {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('API Response:', response.data); // API yanıtını konsola yazdır

        
            if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
                const debtsWithPaidStatus = response.data.data.map((debt: Debt) => ({
                    key: debt.id,
                    data: {
                        ...debt,
                        isPaid: debt.isPaid || false, // Backend'den gelen 'isPaid' durumu varsa kullan, yoksa false yap
                    }
                }));
                setDebts(debtsWithPaidStatus);
            } else {
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error('Failed to fetch debts', error);
        }
    };

    useEffect(() => {
        fetchDebts();
    }, []);

    const handleAddDebt = () => {
        navigate('/adddebt');
    };

    const handleDeleteDebt = async (debtId: string) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://study.logiper.com/finance/debt/${debtId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDebts(debts.filter(debt => debt.key !== debtId));
        } catch (error) {
            console.error('Failed to delete debt', error);
        }
    };

    const handleDelayDebt = async (debtId: string) => {
        const token = localStorage.getItem('token');
        const debtToDelay = debts.find(debt => debt.key === debtId);

        if (debtToDelay) {
            const newPaymentStart = format(addMonths(parseISO(debtToDelay.data.paymentStart), 1), 'yyyy-MM-dd');

            try {
             
                await axios.patch(`https://study.logiper.com/finance/debt/${debtId}`, {
                    paymentStart: newPaymentStart
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

               
                const updatedDebts = debts.map((debt) => {
                    if (debt.key === debtId) {
                        return { ...debt, data: { ...debt.data, paymentStart: newPaymentStart } };
                    }
                    return debt;
                });
                setDebts(updatedDebts);
            } catch (error) {
                console.error('Failed to delay debt', error);
            }
        } else {
            console.error('Debt not found');
        }
    };

    const paymentPlanTemplate = (node: TreeNode) => {
        const { paymentPlan } = node.data;
        if (!paymentPlan || !Array.isArray(paymentPlan)) {
            return <span>Ödeme planı yok</span>;
        }
        return (
            <ul>
                {paymentPlan.map((payment: PaymentPlan, index: number) => (
                    <li key={index}>
                        {payment.paymentDate} - {payment.paymentAmount}
                    </li>
                ))}
            </ul>
        );
    };

    const paidTemplate = (node: TreeNode) => {
        return (
            <div>
                <Checkbox checked={node.data.isPaid} onChange={(e) => handleCheckboxChange(e, node.key as string)} />
                {node.data.isPaid && <i className="pi pi-check-circle" style={{ color: 'green', marginLeft: '0.5rem' }}></i>}
            </div>
        );
    };

    const handleCheckboxChange = async (e: any, debtId: string) => {
        const token = localStorage.getItem('token');
        try {
        
            await axios.patch(`https://study.logiper.com/finance/debt/${debtId}`, {
                isPaid: e.target.checked
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Local state'i güncelle
            const updatedDebts = debts.map((debt) => {
                if (debt.key === debtId) {
                    return { ...debt, data: { ...debt.data, isPaid: e.target.checked } };
                }
                return debt;
            });
            setDebts(updatedDebts);
        } catch (error) {
            console.error('Failed to update debt status', error);
        }
    };

    const rowClassName = (node: TreeNode) => {
        return {
            'line-through': node.data.isPaid,
        };
    };

    return (
        <div className="card mt-1">
            <TreeTable value={debts} rowClassName={rowClassName}>
                <Column field="debtName" header="Borç Adı"></Column>
                <Column field="lenderName" header="Borç Veren"></Column>
                <Column field="debtAmount" header="Borç Miktarı"></Column>
                <Column field="interestRate" header="Faiz Oranı"></Column>
                <Column field="amount" header="Miktar"></Column>
                <Column field="paymentStart" header="Ödeme Başlangıcı"></Column>
                <Column field="installment" header="Taksit"></Column>
                <Column field="description" header="Açıklama"></Column>
                <Column field="paymentPlan" header="Ödeme Planı" body={paymentPlanTemplate}></Column>
                <Column header="Ödendi" body={paidTemplate}></Column>
                <Column
                    header="İşlemler"
                    body={(rowData) => (
                        <div className="p-d-flex p-jc-around flex gap-2">
                            <Button label="Sil" className="p-button-danger p-button-sm" onClick={() => handleDeleteDebt(rowData.data.id)} />
                            <Button label="Ertele" className="p-button-warning p-button-sm" onClick={() => handleDelayDebt(rowData.data.id)} />
                        </div>
                    )}
                ></Column>
            </TreeTable>
            <div className="card flex justify-content-center mt-5">
                <Button label="Yeni Borç Ekle" onClick={handleAddDebt} />
            </div>
        </div>
    );
};

export default Dashboard;
