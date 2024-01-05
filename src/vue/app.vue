<template>
    <Header />
    <div class="container">
      <Balance :total="total" />
      <IncomeExpenses :income="+income" :expenses="+expenses" />
      <TransactionList
        :transactions="transactions"
        @transactionDeleted="handleTransactionDeleted"
      />
      <AddTransaction @transactionSubmitted="handleTransactionSubmitted" />
    </div>
  </template>
  
  <script setup>
  import 'vue-toastification/dist/index.css';
  import '../../styles/vue.css'

  import { ref, computed, onMounted } from 'vue';

  import Header from '../../components/vue/Header.vue';
  import Balance from '../../components/vue/Balance.vue';
  import IncomeExpenses from '../../components/vue/IncomeExpenses.vue';
  import TransactionList from '../../components/vue/TransactionList.vue';
  import AddTransaction from '../../components/vue/AddTransaction.vue';
  
  
  import { useToast } from 'vue-toastification';
  
  const toast = useToast();
  
  const transactions = ref([]);
  
  onMounted(() => {
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') ?? '[]');
    console.log(savedTransactions);
    if (savedTransactions) {
      transactions.value = savedTransactions;
    }
  });
  
  // Get total
  const total = computed(() => {
    return transactions.value.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);
  });
  
  // Get income
  const income = computed(() => {
    return transactions.value
      .filter((transaction) => transaction.amount > 0)
      .reduce((acc, transaction) => acc + transaction.amount, 0)
      .toFixed(2);
  });
  
  // Get expenses
  const expenses = computed(() => {
    return transactions.value
      .filter((transaction) => transaction.amount < 0)
      .reduce((acc, transaction) => acc + transaction.amount, 0)
      .toFixed(2);
  });
  
  // Submit transaction
  const handleTransactionSubmitted = (transactionData) => {
    transactions.value.push({
      id: generateUniqueId(),
      text: transactionData.text,
      amount: transactionData.amount,
    });
  
    saveTransactionsToLocalStorage();
  
    toast.success('Transaction added.');
  };
  
  // Generate unique ID
  const generateUniqueId = () => {
    return Math.floor(Math.random() * 1000000);
  };
  
  // Delete transaction
  const handleTransactionDeleted = (id) => {
    transactions.value = transactions.value.filter(
      (transaction) => transaction.id !== id
    );
  
    saveTransactionsToLocalStorage();
  
    toast.success('Transaction deleted.');
  };
  
  // Save transactions to local storage
  const saveTransactionsToLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions.value));
  };
  </script>