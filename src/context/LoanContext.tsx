import React, { createContext, useContext, useState } from 'react';
import { loanService } from '../services/loanService';
import { LoanResponse } from '../types/types';

interface LoanContextType {
    submitLoan: (data: { birthDate: Date; loanAmount: number; loanPeriod: number }) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    loanResponse: LoanResponse | null;
    clearResponse: () => void;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loanResponse, setLoanResponse] = useState<LoanResponse | null>(null);

    const submitLoan = async (data: { birthDate: Date; loanAmount: number; loanPeriod: number }) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await loanService.submitLoan(data);
            if (!response.isSuccess) {
                setError(response.errorMsg || 'אירעה שגיאה בעת שליחת הבקשה');
            } else {
                setLoanResponse(response);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'אירעה שגיאה בעת שליחת הבקשה');
        } finally {
            setIsLoading(false);
        }
    };

    const clearResponse = () => {
        setLoanResponse(null);
        setError(null);
    };

    return (
        <LoanContext.Provider value={{ submitLoan, isLoading, error, loanResponse, clearResponse }}>
            {children}
        </LoanContext.Provider>
    );
};

export const useLoan = () => {
    const context = useContext(LoanContext);
    if (context === undefined) {
        throw new Error('useLoan must be used within a LoanProvider');
    }
    return context;
}; 