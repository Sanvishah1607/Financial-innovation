import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { TransactionCategory, TransactionType, PaymentMethod, Transaction } from '../types';

export const TransactionsPage: React.FC = () => {
  const { transactions, deleteTransaction, totalIncome, totalExpenses } = useFinancial();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Delete modal state
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);

  const categories: TransactionCategory[] = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Education',
    'Entertainment',
    'Healthcare',
    'Salary',
    'Freelance',
    'Investment',
    'Other'
  ];

  const paymentMethods: PaymentMethod[] = [
    'UPI',
    'Debit Card',
    'Credit Card',
    'Bank Transfer',
    'Cash'
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch =
        tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'ALL' || tx.category === selectedCategory;

      const matchesType =
        selectedType === 'ALL' || tx.type === selectedType;

      const matchesPayment =
        selectedPaymentMethod === 'ALL' || tx.paymentMethod === selectedPaymentMethod;

      return matchesSearch && matchesCategory && matchesType && matchesPayment;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType, selectedPaymentMethod, sortBy]);

  const filteredStats = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return { income, expense, count: filteredTransactions.length };
  }, [filteredTransactions]);

  const handleDelete = () => {
    if (deletingTx) {
      deleteTransaction(deletingTx.id);
      addToast('success', `Transaction "${deletingTx.name}" deleted successfully.`);
      setDeletingTx(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Amount', 'Type', 'Category', 'Date', 'Time', 'Payment Method', 'Notes'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      `"${tx.name}"`,
      tx.amount,
      tx.type,
      tx.category,
      tx.date,
      tx.time,
      tx.paymentMethod,
      `"${tx.notes || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinShield_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('info', 'Exported transactions as CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Transactions History
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            View, filter, categorize, and track all your incoming and outgoing transactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5 text-[#6B6B6B]" />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Link to="/add-expense">
            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Mini Stat Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Filtered Items</span>
            <Badge variant="neutral">{filteredStats.count} Total</Badge>
          </div>
          <p className="text-xl font-mono font-bold text-[#242424] mt-2">
            {filteredStats.count} record{filteredStats.count !== 1 ? 's' : ''}
          </p>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#218739] uppercase tracking-wider">Filtered Inflow</span>
            <div className="w-6 h-6 rounded-full bg-[#EAF5EC] flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5 text-[#218739]" />
            </div>
          </div>
          <p className="text-xl font-mono font-bold text-[#218739] mt-2">
            +₹{filteredStats.income.toLocaleString('en-IN')}
          </p>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#C62828] uppercase tracking-wider">Filtered Outflow</span>
            <div className="w-6 h-6 rounded-full bg-[#FCE8E8] flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C62828]" />
            </div>
          </div>
          <p className="text-xl font-mono font-bold text-[#C62828] mt-2">
            -₹{filteredStats.expense.toLocaleString('en-IN')}
          </p>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="p-4 bg-white">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#F0F0F0]">
          <Filter className="w-4 h-4 text-[#8B1E3F]" />
          <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">Filter & Search</h2>
          {(searchQuery || selectedCategory !== 'ALL' || selectedType !== 'ALL' || selectedPaymentMethod !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedType('ALL');
                setSelectedPaymentMethod('ALL');
              }}
              className="ml-auto text-xs text-[#8B1E3F] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search merchant, tag, or note..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-[#6B6B6B]" />}
            />
          </div>

          {/* Type Select */}
          <div>
            <Select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Types' },
                { value: 'income', label: 'Income Only' },
                { value: 'expense', label: 'Expense Only' }
              ]}
            />
          </div>

          {/* Category Select */}
          <div>
            <Select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Categories' },
                ...categories.map(c => ({ value: c, label: c }))
              ]}
            />
          </div>

          {/* Sort By Select */}
          <div>
            <Select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              options={[
                { value: 'date-desc', label: 'Date: Newest First' },
                { value: 'date-asc', label: 'Date: Oldest First' },
                { value: 'amount-desc', label: 'Amount: High to Low' },
                { value: 'amount-asc', label: 'Amount: Low to High' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="bg-white overflow-hidden p-0">
        <div className="px-5 py-3.5 bg-[#FAFAFA] border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#242424] uppercase tracking-wider">
              Transaction Records ({filteredTransactions.length})
            </span>
          </div>
          <span className="text-xs text-[#6B6B6B]">Showing all matching records</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No transactions found"
              description="No records match your active search or filter criteria. Try resetting filters or add a new transaction."
              actionLabel="Add New Expense"
              onAction={() => window.location.href = '/add-expense'}
            />
          </div>
        ) : (
          <div className="divide-y divide-[#F0F0F0]">
            {filteredTransactions.map(tx => (
              <div
                key={tx.id}
                className="p-4 hover:bg-[#FDF9FA] transition-colors flex items-center justify-between gap-4 group"
              >
                {/* Left side: icon & info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'income' ? 'bg-[#EAF5EC] text-[#218739]' : 'bg-[#F8E9EE] text-[#8B1E3F]'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#242424] truncate">{tx.name}</h4>
                      <Badge variant="neutral">{tx.category}</Badge>
                      <span className="text-[10px] font-mono text-[#6B6B6B] px-1.5 py-0.5 rounded bg-[#F5F5F5]">
                        {tx.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mt-1">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span>{tx.time}</span>
                      {tx.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate italic max-w-xs">{tx.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: amount & delete action */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p
                      className={`text-base font-mono font-bold ${
                        tx.type === 'income' ? 'text-[#218739]' : 'text-[#242424]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-[#6B6B6B] uppercase font-semibold">
                      {tx.type === 'income' ? 'CREDIT' : 'DEBIT'}
                    </span>
                  </div>

                  <button
                    onClick={() => setDeletingTx(tx)}
                    title="Delete transaction"
                    className="p-2 text-[#6B6B6B] hover:text-[#C62828] hover:bg-[#FCE8E8] rounded transition-colors opacity-80 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTx}
        onClose={() => setDeletingTx(null)}
        title="Confirm Delete Transaction"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#FCE8E8] text-[#C62828]">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Are you sure you want to delete this record?</p>
              <p className="mt-1 text-[#242424]">
                This will remove <strong className="font-semibold">{deletingTx?.name}</strong> (₹{deletingTx?.amount.toLocaleString('en-IN')}) from your dashboard balance and expense totals.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingTx(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={handleDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionsPage;
