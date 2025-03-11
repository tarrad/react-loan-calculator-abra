import React from 'react';
import { LoanResponse } from '../types/types';
import '../styles/LoanSuccessView.css';

interface LoanSuccessViewProps {
    response: LoanResponse;
    onClose: () => void;
}

const LoanSuccessView: React.FC<LoanSuccessViewProps> = ({ response, onClose }) => {
    const formatCurrency = (value: number) => {
        const formattedValue = value.toFixed(2);
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(Number(formattedValue));
    };

    return (
        <div className="success-view-overlay">
            <div className="success-view-content">
                <div className="success-header">
                    <div className="success-icon">✓</div>
                    <h2>הצעת ההלוואה אושרה!</h2>
                </div>
                
                <div className="loan-details">
                    <div className="detail-item">
                        <span className="detail-label">סכום מבוקש:</span>
                        <span className="detail-value">{formatCurrency(response.requestedLoanAmount)}</span>
                    </div>
                    <div className="detail-item highlight">
                        <span className="detail-label">סך הכל לתשלום:</span>
                        <span className="detail-value">{formatCurrency(response.totalLoanAmountToPay)}</span>
                    </div>
                    <div className="interest-details">
                        <div className="detail-item">
                            <span className="detail-label">ריבית בסיסית:</span>
                            <span className="detail-value">{formatCurrency(response.totalLoanAmountToPayBasicInterest)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">ריבית נוספת:</span>
                            <span className="detail-value">{formatCurrency(response.totalLoanAmountToPayExtraInterest)}</span>
                        </div>
                    </div>
                </div>

                <div className="success-actions">
                    <button className="primary-button" onClick={onClose}>
                        אישור
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoanSuccessView; 