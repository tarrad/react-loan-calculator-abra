import { LoanRequest, LoanResponse } from '../types/types';
import { apiClient } from './api';
import { API_CONFIG } from '../config/api';

class LoanService {
    private readonly endpoint = API_CONFIG.ENDPOINTS.LOAN.SUBMIT;

    private calculateClientId(birthDate: Date): number {
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age <= 20) return 1;
        if (age <= 35) return 2;
        return 3;
    }

    private formatNumber(value: number): number {
        return parseFloat(value.toFixed(2));
    }

    private formatResponse(response: LoanResponse): LoanResponse {
        return {
            ...response,
            requestedLoanAmount: this.formatNumber(response.requestedLoanAmount),
            totalLoanAmountToPay: this.formatNumber(response.totalLoanAmountToPay),
            totalLoanAmountToPayBasicInterest: this.formatNumber(response.totalLoanAmountToPayBasicInterest),
            totalLoanAmountToPayExtraInterest: this.formatNumber(response.totalLoanAmountToPayExtraInterest)
        };
    }

    async submitLoan(loanData: LoanRequest): Promise<LoanResponse> {
        try {
            const { birthDate, ...restLoanData } = loanData;
            const clientId = this.calculateClientId(birthDate);
            
            const response = await apiClient.post<LoanResponse>(this.endpoint, {
                ...restLoanData,
                clientId
            });

            return this.formatResponse(response);
        } catch (error) {
            // Handle specific API errors
            if (error instanceof Error) {
                const apiError = error as any;
                if (apiError.status === 400) {
                    // Handle validation errors from the server
                    return this.formatResponse({
                        isSuccess: false,
                        requestedLoanAmount: loanData.loanAmount,
                        totalLoanAmountToPay: 0,
                        totalLoanAmountToPayBasicInterest: 0,
                        totalLoanAmountToPayExtraInterest: 0,
                        errorMsg: apiError.data?.message || 'נתונים לא תקינים'
                    });
                }
                if (apiError.status === 401) {
                    return this.formatResponse({
                        isSuccess: false,
                        requestedLoanAmount: loanData.loanAmount,
                        totalLoanAmountToPay: 0,
                        totalLoanAmountToPayBasicInterest: 0,
                        totalLoanAmountToPayExtraInterest: 0,
                        errorMsg: 'אין הרשאה לביצוע הפעולה'
                    });
                }
                if (apiError.status === 503) {
                    return this.formatResponse({
                        isSuccess: false,
                        requestedLoanAmount: loanData.loanAmount,
                        totalLoanAmountToPay: 0,
                        totalLoanAmountToPayBasicInterest: 0,
                        totalLoanAmountToPayExtraInterest: 0,
                        errorMsg: 'השירות אינו זמין כרגע, אנא נסה שוב מאוחר יותר'
                    });
                }
            }
            
            // Generic error response
            return this.formatResponse({
                isSuccess: false,
                requestedLoanAmount: loanData.loanAmount,
                totalLoanAmountToPay: 0,
                totalLoanAmountToPayBasicInterest: 0,
                totalLoanAmountToPayExtraInterest: 0,
                errorMsg: 'אירעה שגיאה בעת שליחת הבקשה'
            });
        }
    }
}

export const loanService = new LoanService(); 