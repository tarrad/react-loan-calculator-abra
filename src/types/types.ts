export interface LoanResponse {
    isSuccess: boolean;
    requestedLoanAmount: number;
    totalLoanAmountToPay: number;
    totalLoanAmountToPayBasicInterest: number;
    totalLoanAmountToPayExtraInterest: number;
    errorMsg?: string;
}

export interface LoanRequest {
    birthDate: Date;
    loanAmount: number;
    loanPeriod: number;
}

export interface LoanFormData {
    birthDate: Date;
    loanAmount: number;
    loanPeriod: number;
} 