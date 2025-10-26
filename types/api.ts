// Types for the API (types/api.ts)
export interface APRRequest {
    _id: string;
    timestamp: string;
    loanAmount: number;
    financeCharge: number;
    APR: number;
    paymentFrequency: string;
    response: boolean;
    message: string;
    numberOfPayments: number;
    advanceDate: string;
  }
  
  export interface PaginatedResponse {
    success: boolean;
    requests: APRRequest[];
    totalRequests: number;
    stats: {
      totalRequests: number;
      successRate: number;
      averageAPR: number;
      totalLoanAmount: number;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }