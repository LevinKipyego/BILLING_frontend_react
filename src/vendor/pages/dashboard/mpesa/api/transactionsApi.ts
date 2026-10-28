import { fetchTransactions } from "../../../../api/transactions";
import type Transaction from "../../../../types/transactions";

export async function getTransactions(): Promise<Transaction[]> {
  return fetchTransactions();
}
