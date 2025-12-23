import { create } from "zustand";

interface Transactions {
  id: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
}

interface WalletState {
  balance: number;
  transactions: Transactions[];

  setBalance: (amount: number) => void;
  addTransaction: (data: Transactions) => void;
  resetWallet: () => void;
}

const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  transactions: [],

  setBalance: (amount) => set({ balance: amount }),
  resetWallet: () => set({ balance: 0, transactions: [] }),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      balance:
        transaction.type === "credit"
          ? state.balance + transaction.amount
          : state.balance - transaction.amount,
    })),
}));

export default useWalletStore;
