import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchTransactions = useCallback(async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      });
      
      const response = await axios.get(`${API_URL}/transactions?${params}`);
      setTransactions(response.data.transactions);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions/summary`);
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to fetch summary');
    }
  }, []);

  const addTransaction = async (transactionData) => {
    try {
      const response = await axios.post(`${API_URL}/transactions`, transactionData);
      setTransactions(prev => [response.data, ...prev]);
      fetchSummary();
      toast.success('Transaction added successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to add transaction');
      return { success: false };
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      const response = await axios.put(`${API_URL}/transactions/${id}`, transactionData);
      setTransactions(prev => prev.map(t => t._id === id ? response.data : t));
      fetchSummary();
      toast.success('Transaction updated successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to update transaction');
      return { success: false };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t._id !== id));
      fetchSummary();
      toast.success('Transaction deleted successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete transaction');
      return { success: false };
    }
  };

  const value = {
    transactions,
    summary,
    loading,
    pagination,
    fetchTransactions,
    fetchSummary,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};