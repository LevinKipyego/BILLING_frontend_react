import { fetchTransactions } from "../../../../../api/transactions";
import type Transaction from "../../../../../types/transactions";

export async function getStkTransactions(): Promise<Transaction[]> {
  return fetchTransactions();
}
