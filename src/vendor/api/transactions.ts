import {apiFetch} from './client';
import type Transaction from '../types/transactions';
import type { MpesaC2BTransaction } from '../types/transactions';

export function fetchTransactions():Promise<Transaction[]>{
    return apiFetch('/stk-transactions/');
}
   

export function fetchMpesaC2BTransactions():Promise<MpesaC2BTransaction[]>{
    return apiFetch('/client/c2b/c2btransactions/');
}