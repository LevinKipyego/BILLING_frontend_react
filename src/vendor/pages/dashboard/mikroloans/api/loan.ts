import { apiFetch } from "../../../../api/client";
import type { LoanPackage, MicroLoan,  LoanAnalytics } from "../types";



// --------------------------------------------------
// LOAN API FUNCTIONS
// --------------------------------------------------
export const fetchLoanPackages = () => 
    apiFetch<LoanPackage[]>(`/loan/loan-packages/`);

export const saveLoanPackageAPI = (pkg: Partial<LoanPackage>, vendorId: number) => {
    const method = pkg.id ? 'PUT' : 'POST';
    // Updated endpoints to ensure proper URL slashes and matching prefixes
    const endpoint = pkg.id ? `/loan/loan-packages/${pkg.id}/` : `/loan/loan-packages/`;
    
    return apiFetch<LoanPackage>(endpoint, {
        method,
        body: JSON.stringify({ ...pkg, vendor: vendorId }),
    });
};

export const deleteLoanPackageAPI = (id: number) => 
    apiFetch(`/loan/loan-packages/${id}/`, { method: 'DELETE' });

export const fetchMicroLoans = () => 
    apiFetch<MicroLoan[]>(`/loan/micro-loans/`);

export const fetchLoanAnalytics = () => 
    apiFetch<LoanAnalytics>(`/loan/loan-analytics/`);