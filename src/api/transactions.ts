import {apiFetch} from './client';
import type Transaction from '../types/transactions';

export function fetchTransactions():Promise<Transaction[]>{
    return apiFetch('/stk-transactions/');
}
   