import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {AppState} from 'react-native';
import {Storage} from './Storage';

export type Beneficiary = {
  firstName: string;
  lastName: string;
  IBAN: string;
};

type PersistedData = {
  balance: number;
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
};

type Transaction = {
  id: number;
  amount: number;
  account: Beneficiary;
};

type TransactionContextType = {
  transactions: any[];
  addTransaction: (amount: string, account: any) => void;
  balance?: number;
  beneficiaries: Beneficiary[];
  addBeneficiary: (beneficiary: Beneficiary) => void;
  selectedAccount?: Beneficiary;
  selectAccount: (beneficiary?: Beneficiary) => void;
};

const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  beneficiaries: [],
  balance: 0,
  selectedAccount: undefined,
  addBeneficiary: () => {},
  addTransaction: () => {},
  selectAccount: () => {},
});

export const useTransactions = () => {
  const {
    transactions,
    beneficiaries,
    balance = 0,
    selectedAccount,
    addBeneficiary,
    addTransaction,
    selectAccount,
  } = useContext(TransactionContext);

  return {
    transactions,
    beneficiaries,
    balance,
    selectedAccount,
    addBeneficiary,
    addTransaction,
    selectAccount,
  };
};

export const TransactionProvider = ({children}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(1000);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Beneficiary>();

  const [appState, setAppState] = useState(AppState.currentState);
  const lastState = useRef(AppState.currentState);

  const addTransaction = (amount: string, account: Beneficiary) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      account,
    };
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    setBalance(prevBalance => prevBalance - parseFloat(amount));
  };

  const addBeneficiary = (beneficiary: Beneficiary) => {
    setBeneficiaries(prev => [...prev, beneficiary]);
  };

  const selectAccount = (beneficiary?: Beneficiary) => {
    setSelectedAccount(beneficiary);
  };

  const loadDataFromStorage = async () => {
    const data = await Storage.getData<PersistedData>('data');
    if (data) {
      setBalance(data.balance);
      setBeneficiaries(data.beneficiaries);
      setTransactions(data.transactions);
    }
  };

  const storeDataToStorage = async () => {
    await Storage.storeData('data', {
      balance,
      beneficiaries,
      transactions,
    });
  };

  useEffect(() => {
    if (
      lastState.current === 'active' &&
      appState.match(/inactive|background/)
    ) {
      storeDataToStorage();
    }
    lastState.current = appState;
  }, [appState]);

  useEffect(() => {
    loadDataFromStorage();
    const subcribe = AppState.addEventListener('change', nextAppState =>
      setAppState(nextAppState),
    );

    return () => {
      subcribe.remove();
    };
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        balance,
        beneficiaries,
        addBeneficiary,
        selectedAccount,
        selectAccount,
      }}>
      {children}
    </TransactionContext.Provider>
  );
};
