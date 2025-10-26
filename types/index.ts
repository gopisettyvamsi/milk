// types/index.ts
export interface APRRequest {
    _id: string;
    loanAmount: number;
    financeCharge: number;
    numberOfPayments: number;
    paymentFrequency: string;
    advanceDate: string;
    response: boolean;
    APR: number;
    message: string;
    timestamp: string;
    installmentDates?: string[];
    installmentAmounts?: number[];
  }
  
  export interface PaginationParams {
    page: number;
    limit: number;
    total: number;
  }
  
  export interface DashboardStats {
    totalRequests: number;
    successRate: number;
    averageAPR: number;
    totalLoanAmount: number;
  }