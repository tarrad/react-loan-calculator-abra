import React, { useState } from 'react';
import { useLoan } from '../context/LoanContext';
import LoadingView from './LoadingView';
import LoanSuccessView from './LoanSuccessView';
import Slider from 'rc-slider';
import { Tooltip } from 'react-tooltip';
import 'rc-slider/assets/index.css';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/LoanForm.css';

const LoanForm: React.FC = () => {
    const { submitLoan, isLoading, error, loanResponse, clearResponse } = useLoan();
    const [formData, setFormData] = useState({
        birthDate: '',
        loanAmount: '100000',
        loanPeriod: '12'
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isManualInput, setIsManualInput] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const isFormValid = (): boolean => {
        // Birth date validation
        if (!formData.birthDate) return false;
        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18 || birthDate > today) return false;

        // Loan amount validation
        const amount = Number(formData.loanAmount);
        if (!formData.loanAmount || amount <= 0 || amount > 5000000) return false;

        // Loan period validation
        const period = Number(formData.loanPeriod);
        if (!formData.loanPeriod || period < 12) return false;

        return true;
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        
        // Birth date validation
        if (!formData.birthDate) {
            errors.birthDate = 'נא להזין תאריך לידה';
        } else {
            const birthDate = new Date(formData.birthDate);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (age < 18) {
                errors.birthDate = 'גיל מינימלי נדרש הוא 18';
            }
            
            if (birthDate > today) {
                errors.birthDate = 'תאריך לידה לא יכול להיות בעתיד';
            }
        }
        
        // Loan amount validation
        const amount = Number(formData.loanAmount);
        if (!formData.loanAmount || amount <= 0) {
            errors.loanAmount = 'סכום ההלוואה חייב להיות גדול מ-0';
        } else if (amount > 5000000) {
            errors.loanAmount = 'סכום ההלוואה לא יכול לעלות על 5,000,000 ₪';
        }
        
        // Loan period validation
        const period = Number(formData.loanPeriod);
        if (!formData.loanPeriod || period < 12) {
            errors.loanPeriod = 'תקופת ההלוואה חייבת להיות לפחות 12 חודשים';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        await submitLoan({
            birthDate: new Date(formData.birthDate),
            loanAmount: Number(formData.loanAmount),
            loanPeriod: Number(formData.loanPeriod)
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const sliderStyle = {
        railStyle: { backgroundColor: '#e2e8f0', height: 8 },
        trackStyle: { backgroundColor: '#0066cc', height: 8 },
        handleStyle: {
            borderColor: '#ffffff',
            height: 24,
            width: 24,
            marginTop: -8,
            backgroundColor: '#0066cc',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '2px solid #ffffff'
        }
    };

    return (
        <div className="loan-form-container fade-in">
            {isLoading && <LoadingView />}
            {loanResponse && <LoanSuccessView response={loanResponse} onClose={clearResponse} />}
            <div className="form-header slide-down">
                <h2>טופס בקשת הלוואה</h2>
                <p className="subtitle">מלא את הפרטים הבאים לקבלת הצעה</p>
            </div>

            <form onSubmit={handleSubmit} className="loan-form">
                <div className="form-group slide-in">
                    <div className="label-group">
                        <label htmlFor="birthDate">תאריך לידה</label>
                        <span 
                            className="info-icon"
                            data-tooltip-id="birth-date-tooltip"
                            data-tooltip-place="right"
                        >
                            ?
                        </span>
                        <Tooltip id="birth-date-tooltip" className="tooltip-custom">
                            <h4>דרישות גיל:</h4>
                            <ul>
                                <li>גיל מינימלי: 18 שנים</li>
                                <li>גיל 20 ומטה: קבוצה 1</li>
                                <li>גיל 21-35: קבוצה 2</li>
                                <li>גיל 36 ומעלה: קבוצה 3</li>
                            </ul>
                        </Tooltip>
                    </div>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        className="input-field"
                    />
                    {validationErrors.birthDate && (
                        <span className="error-message">{validationErrors.birthDate}</span>
                    )}
                </div>

                <div className="form-group slide-in">
                    <div className="label-group">
                        <label htmlFor="loanAmount">סכום ההלוואה</label>
                        <span 
                            className="info-icon"
                            data-tooltip-id="loan-amount-tooltip"
                            data-tooltip-place="right"
                        >
                            ?
                        </span>
                        <Tooltip id="loan-amount-tooltip" className="tooltip-custom">
                            <h4>דרישות סכום ההלוואה:</h4>
                            <ul>
                                <li>מקסימום: ₪5,000,000</li>
                            </ul>
                        </Tooltip>
                    </div>
                    
                    <div className="range-slider-value">
                        {formatCurrency(Number(formData.loanAmount))}
                    </div>
                    <div className="manual-input-toggle">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isManualInput}
                                onChange={(e) => setIsManualInput(e.target.checked)}
                            />
                            הזנה ידנית
                        </label>
                    </div>
                    {!isManualInput ? (
                        <div className="range-slider-wrapper" dir="ltr">
                            <Slider
                                min={0}
                                max={5000000}
                                step={500}
                                value={Number(formData.loanAmount)}
                                onChange={(value) => handleChange({
                                    target: { name: 'loanAmount', value: value.toString() }
                                } as React.ChangeEvent<HTMLInputElement>)}
                                {...sliderStyle}
                            />
                        </div>
                    ) : (
                        <input
                            type="number"
                            name="loanAmount"
                            value={formData.loanAmount}
                            onChange={(e) => {
                                const value = Math.min(5000000, Math.max(0, Number(e.target.value)));
                                setFormData(prev => ({
                                    ...prev,
                                    loanAmount: value.toString()
                                }));
                            }}
                            className="input-field"
                            min="0"
                            max="5000000"
                            step="1"
                            placeholder="הזן סכום הלוואה"
                        />
                    )}
                    {validationErrors.loanAmount && (
                        <span className="error-message">{validationErrors.loanAmount}</span>
                    )}
                </div>

                <div className="form-group slide-in">
                    <div className="label-group">
                        <label htmlFor="loanPeriod">תקופת ההלוואה (חודשים)</label>
                        <span 
                            className="info-icon"
                            data-tooltip-id="loan-period-tooltip"
                            data-tooltip-place="right"
                        >
                            ?
                        </span>
                        <Tooltip id="loan-period-tooltip" className="tooltip-custom">
                            <h4>דרישות תקופת ההלוואה:</h4>
                            <ul>
                                <li>מינימום 12 חודשים</li>
                            </ul>
                        </Tooltip>
                    </div>
                    <div className="range-slider-container">
                        <div className="range-slider-value">
                            {formData.loanPeriod} חודשים
                        </div>
                        <div className="range-slider-wrapper" dir="ltr">
                            <Slider
                                min={12}
                                max={100}
                                step={1}
                                value={Number(formData.loanPeriod)}
                                onChange={(value) => handleChange({
                                    target: { name: 'loanPeriod', value: value.toString() }
                                } as React.ChangeEvent<HTMLInputElement>)}
                                {...sliderStyle}
                            />
                        </div>
                    </div>
                    {validationErrors.loanPeriod && (
                        <span className="error-message">{validationErrors.loanPeriod}</span>
                    )}
                </div>

                {error && <div className="error-message fade-in">{error}</div>}

                <button 
                    type="submit" 
                    className="submit-button slide-up" 
                    disabled={isLoading || !isFormValid()}
                >
                    {isLoading ? (
                        <>
                            <span className="loading-spinner"></span>
                            שולח בקשה...
                        </>
                    ) : 'שלח בקשת הלוואה'}
                </button>
            </form>
        </div>
    );
};

export default LoanForm; 