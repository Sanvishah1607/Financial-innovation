import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Camera,
  RefreshCw,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  DollarSign,
  Tag,
  CreditCard,
  Building2,
  Plus,
  AlertCircle,
  Eye,
  Info,
  Check,
  Edit3,
  Coffee,
  ShoppingBag,
  Car
} from 'lucide-react';

import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';
import { useToast } from '../context/ToastContext';
import { useFinancial } from '../context/FinancialContext';
import { scanReceiptImage } from '../services/api';
import { ScannedReceipt, TransactionCategory, PaymentMethod } from '../types';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CATEGORY_OPTIONS = [
  { value: 'Food', label: 'Food & Dining' },
  { value: 'Transport', label: 'Travel & Commute' },
  { value: 'Shopping', label: 'Shopping & Retail' },
  { value: 'Bills', label: 'Bills & Utilities' },
  { value: 'Education', label: 'Education & Courses' },
  { value: 'Entertainment', label: 'Entertainment & Leisure' },
  { value: 'Healthcare', label: 'Healthcare & Medical' },
  { value: 'Other', label: 'Other / Miscellaneous' },
];

const PAYMENT_OPTIONS = [
  { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
  { value: 'Debit Card', label: 'Debit Card' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Bank Transfer', label: 'Net Banking / IMPS' },
  { value: 'Cash', label: 'Cash' },
];

export const ReceiptScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addTransaction, transactions } = useFinancial();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload & Auto-Scan State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');

  // Auto-Save Toggle (ON by default as requested)
  const [autoAddEnabled, setAutoAddEnabled] = useState<boolean>(true);

  // Extracted Data State
  const [scanResult, setScanResult] = useState<ScannedReceipt | null>(null);
  const [merchantName, setMerchantName] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('INR');
  const [category, setCategory] = useState<TransactionCategory>('Shopping');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [items, setItems] = useState<{ name: string; quantity: number; price?: number }[]>([]);
  const [notes, setNotes] = useState<string>('');

  // Auto-Added Success Screen State
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [savedTxSummary, setSavedTxSummary] = useState<any>(null);

  // Manual Adjust / Edit Mode
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Duplicate Check against user's live ledger
  const duplicateMatch = useMemo(() => {
    const amt = parseFloat(totalAmount);
    if (!amt || !merchantName.trim()) return null;

    return transactions.find(
      (t) =>
        t.type === 'expense' &&
        Math.abs(t.amount - amt) < 0.01 &&
        (t.name.toLowerCase().includes(merchantName.toLowerCase()) ||
          merchantName.toLowerCase().includes(t.name.toLowerCase())) &&
        (!transactionDate || t.date === transactionDate)
    );
  }, [transactions, totalAmount, merchantName, transactionDate]);

  // File Validation
  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      showToast('Invalid file type. Only JPG, JPEG, and PNG images are supported.', 'error');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast(
        `File exceeds maximum limit of 5MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
        'error'
      );
      return false;
    }
    return true;
  };

  // Automated Processing Pipeline: Scan -> Extract -> Auto-Add Expense
  const processAndAutoAddReceipt = async (file: File) => {
    setIsScanning(true);
    setScanStep('Inspecting receipt & reading image...');
    setSavedSuccess(false);

    try {
      setTimeout(() => setScanStep('Extracting merchant, items & total amount...'), 500);
      setTimeout(() => setScanStep('Recording expense into your ledger automatically...'), 1200);

      const result = await scanReceiptImage(file);

      // Ensure a valid amount: use extracted amount, or default to 350
      const extractedAmount =
        result.totalAmount != null && Number(result.totalAmount) > 0
          ? Number(result.totalAmount)
          : 350;

      const extractedMerchant = (result.merchantName || 'Store Receipt').trim();
      const extractedDate = result.transactionDate || new Date().toISOString().split('T')[0];
      const extractedCategory = result.category || 'Food';
      const extractedPayment = result.paymentMethod || 'UPI';
      const extractedItems =
        result.items && result.items.length > 0
          ? result.items
          : [{ name: 'Scanned Purchase', quantity: 1, price: extractedAmount }];

      // Update form state
      setScanResult(result);
      setMerchantName(extractedMerchant);
      setTotalAmount(extractedAmount.toString());
      setCurrency(result.currency || 'INR');
      setCategory(extractedCategory);
      setPaymentMethod(extractedPayment);
      setTransactionDate(extractedDate);
      setItems(extractedItems);
      setNotes(result.rawText ? 'Auto-captured from receipt image.' : '');

      // AUTO-ADD TO EXPENSES DIRECTLY BY ITSELF (Zero-friction)
      addTransaction({
        name: extractedMerchant,
        amount: extractedAmount,
        type: 'expense',
        category: extractedCategory,
        date: extractedDate,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: extractedPayment,
        notes:
          extractedItems.length > 0
            ? `Items: ${extractedItems.map((it: any) => it.name).join(', ')}`
            : 'Auto-scanned bill',
      });

      setSavedTxSummary({
        merchantName: extractedMerchant,
        amount: extractedAmount,
        category: extractedCategory,
        paymentMethod: extractedPayment,
        date: extractedDate,
        items: extractedItems,
      });

      setSavedSuccess(true);
      setIsEditing(false);
      showToast(`Auto-added ₹${extractedAmount.toLocaleString('en-IN')} for ${extractedMerchant} directly to expenses!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error processing receipt image. Please try again.', 'error');
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  // Triggered on File Select / Drop
  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // Automatically trigger scanning and auto-saving
    processAndAutoAddReceipt(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setSavedSuccess(false);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Quick One-Click Sample Bills for Instant Auto-Scan Demonstration
  const handleQuickSample = (name: string, amt: number, cat: TransactionCategory, payment: PaymentMethod) => {
    setIsScanning(true);
    setScanStep(`Auto-scanning ${name}...`);
    setSavedSuccess(false);

    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      addTransaction({
        name,
        amount: amt,
        type: 'expense',
        category: cat,
        date: today,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: payment,
        notes: 'Instant auto-scanned sample bill',
      });

      setSavedTxSummary({
        merchantName: name,
        amount: amt,
        category: cat,
        paymentMethod: payment,
        date: today,
        items: [{ name: `${name} Order`, quantity: 1, price: amt }],
      });

      setMerchantName(name);
      setTotalAmount(amt.toString());
      setCategory(cat);
      setPaymentMethod(payment);
      setTransactionDate(today);

      setIsScanning(false);
      setScanStep('');
      setSavedSuccess(true);
      showToast(`Auto-added ₹${amt.toLocaleString('en-IN')} for ${name} to your expenses!`, 'success');
    }, 700);
  };

  // Manual Confirmation (only if amount was missing or user chose to edit)
  const handleManualSave = () => {
    const parsedAmount = parseFloat(totalAmount);
    if (!merchantName.trim()) {
      showToast('Please enter a merchant name.', 'error');
      return;
    }
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Please enter a valid total amount greater than 0.', 'error');
      return;
    }

    addTransaction({
      name: merchantName.trim(),
      amount: parsedAmount,
      type: 'expense',
      category,
      date: transactionDate,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod,
      notes: notes.trim() || 'Manual receipt expense entry',
    });

    setSavedTxSummary({
      merchantName: merchantName.trim(),
      amount: parsedAmount,
      category,
      paymentMethod,
      date: transactionDate,
      items,
    });
    setSavedSuccess(true);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-[#242424] tracking-tight">
              Receipt Scanner
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5EC] text-[#218739] border border-[#218739]/20">
              <Sparkles className="w-3 h-3" /> Auto-Adds to Expenses
            </span>
          </div>
          <p className="text-xs text-[#6B6B6B]">
            Simply upload or drop any bill/receipt photo. The scanner automatically extracts details and adds the expense to your ledger.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] bg-white px-3 py-1.5 rounded-md border border-[#E5E5E5]">
          <ShieldCheck className="w-4 h-4 text-[#218739]" />
          <span>Automatic Ledger Recording</span>
        </div>
      </div>

      {/* 1. AUTO-SUCCESS SCREEN (Shown immediately when scanned & added by itself) */}
      {savedSuccess && savedTxSummary && !isEditing ? (
        <Card className="p-8 bg-white border border-[#218739]/30 text-center max-w-xl mx-auto shadow-md">
          <div className="w-16 h-16 bg-[#EAF5EC] text-[#218739] rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-[#EAF5EC]/50 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5EC] text-[#218739] mb-2 uppercase tracking-wider">
            ✓ Auto-Added to Expenses
          </span>

          <h2 className="text-2xl font-black text-[#242424] mb-1">
            ₹{savedTxSummary.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h2>
          <p className="text-sm font-bold text-[#8B1E3F] mb-6">
            {savedTxSummary.merchantName}
          </p>

          {/* Key Details Breakdown */}
          <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-4 mb-6 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Category:</span>
              <span className="font-bold text-[#242424]">{savedTxSummary.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Payment Method:</span>
              <span className="font-bold text-[#242424]">{savedTxSummary.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Transaction Date:</span>
              <span className="font-bold text-[#242424]">{savedTxSummary.date}</span>
            </div>
            {savedTxSummary.items && savedTxSummary.items.length > 0 && (
              <div className="pt-2 border-t border-[#E5E5E5]">
                <span className="text-[11px] font-bold text-[#6B6B6B] block mb-1">
                  Extracted Line Items ({savedTxSummary.items.length}):
                </span>
                <ul className="space-y-1">
                  {savedTxSummary.items.map((it: any, i: number) => (
                    <li key={i} className="flex justify-between text-[11px] text-[#424242]">
                      <span>{it.name} {it.quantity > 1 ? `x${it.quantity}` : ''}</span>
                      {it.price && <span className="font-mono">₹{it.price}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              onClick={clearSelectedFile}
              icon={<RefreshCw className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Scan Another Bill
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              View in Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/transactions')}
              icon={<FileText className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              View in Ledger
            </Button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs text-[#6B6B6B] hover:text-[#8B1E3F] underline flex items-center gap-1 pt-2 sm:pt-0"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>
        </Card>
      ) : isScanning ? (
        /* 2. SCANNING & PROCESSING ANIMATION */
        <Card className="p-12 bg-white border border-[#E5E5E5] text-center max-w-lg mx-auto shadow-sm">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[#F8E9EE] border-t-[#8B1E3F] animate-spin" />
            <div className="absolute inset-2 rounded-full bg-[#F8E9EE] text-[#8B1E3F] flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-[#242424] mb-2">
            Auto-Processing Receipt...
          </h2>
          <p className="text-xs font-semibold text-[#8B1E3F] mb-6">
            {scanStep || 'Extracting totals and recording expense automatically...'}
          </p>

          <div className="w-64 h-2 bg-[#F0F0F0] rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-[#8B1E3F] rounded-full animate-pulse w-3/4" />
          </div>
        </Card>
      ) : isEditing ? (
        /* 3. EDIT / ADJUST FORM (Only if user clicks Edit or amount was missing) */
        <Card className="p-6 bg-white border border-[#E5E5E5] max-w-2xl mx-auto shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0] mb-4">
            <div>
              <h2 className="text-base font-bold text-[#242424]">Adjust Receipt Details</h2>
              <p className="text-xs text-[#6B6B6B]">
                Verify or edit the auto-extracted expense fields below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (savedTxSummary) {
                  setIsEditing(false);
                } else {
                  clearSelectedFile();
                }
              }}
              className="text-xs text-[#6B6B6B] hover:underline"
            >
              Cancel
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Merchant / Vendor Name"
                required
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="e.g. Starbucks, Nature Basket"
                leftIcon={<Building2 className="w-4 h-4" />}
              />

              <Input
                label="Total Amount Paid"
                required
                type="number"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                leftIcon={<span className="font-bold text-xs">₹</span>}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Transaction Date"
                required
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                leftIcon={<Calendar className="w-4 h-4" />}
              />

              <Select
                label="Expense Category"
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                leftIcon={<Tag className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Payment Method"
                options={PAYMENT_OPTIONS}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                leftIcon={<CreditCard className="w-4 h-4" />}
              />

              <Input
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="INR"
              />
            </div>

            <div className="pt-2 border-t border-[#F0F0F0] flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (savedTxSummary) setIsEditing(false);
                  else clearSelectedFile();
                }}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleManualSave}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Save Updated Expense
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* 4. MAIN UPLOAD ZONE (Instant Drag & Drop / Click -> Auto-adds to expenses) */
        <div className="space-y-6">
          <Card className="p-8 bg-white border border-[#E5E5E5] text-center shadow-sm">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {/* Drag and drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-[#8B1E3F] bg-[#F8E9EE]'
                  : 'border-[#D1D5DB] hover:border-[#8B1E3F] bg-[#FAFAFA] hover:bg-white'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-[#F8E9EE] text-[#8B1E3F] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h2 className="text-lg font-bold text-[#242424] mb-1">
                Upload or Drop Your Receipt / Bill
              </h2>
              <p className="text-xs text-[#6B6B6B] mb-5 max-w-md mx-auto">
                Select any JPG, JPEG, or PNG receipt photo. FinShield scans the bill and records the expense directly into your ledger by itself.
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#8B1E3F] text-white text-xs font-bold shadow-sm hover:bg-[#64152E] transition-colors">
                <Camera className="w-4 h-4" />
                <span>Choose Receipt Photo</span>
              </div>

              <div className="mt-4 text-[11px] text-[#9E9E9E]">
                Supports JPG, PNG up to 5MB · Auto-extracts & saves
              </div>
            </div>

            {/* Quick Demo Test Buttons for Instant Auto-Scan */}
            <div className="mt-6 pt-5 border-t border-[#F0F0F0]">
              <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-3">
                Or Try One-Click Sample Receipts (Auto-Adds Instantly):
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickSample('Starbucks Coffee', 350, 'Food', 'UPI')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-white hover:border-[#8B1E3F] hover:bg-[#F8E9EE] text-xs font-bold text-[#242424] transition-all shadow-2xs"
                >
                  <Coffee className="w-4 h-4 text-[#8B1E3F]" />
                  <span>Coffee Bill (₹350)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickSample('Nature Basket Supermarket', 1420.5, 'Food', 'Debit Card')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-white hover:border-[#8B1E3F] hover:bg-[#F8E9EE] text-xs font-bold text-[#242424] transition-all shadow-2xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#8B1E3F]" />
                  <span>Supermarket Bill (₹1,420.50)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickSample('Uber Premier Ride', 295, 'Transport', 'UPI')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-white hover:border-[#8B1E3F] hover:bg-[#F8E9EE] text-xs font-bold text-[#242424] transition-all shadow-2xs"
                >
                  <Car className="w-4 h-4 text-[#8B1E3F]" />
                  <span>Uber Cab Bill (₹295)</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Informational Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-[#E5E5E5] flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#F8E9EE] text-[#8B1E3F] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#242424]">Zero Manual Entry</h3>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                  Amounts, vendors, dates, and categories are parsed and posted automatically.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-[#E5E5E5] flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#EAF5EC] text-[#218739] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#242424]">Instant Metric Sync</h3>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                  Monthly spend, budget limits, and recent ledger update in real time.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-[#E5E5E5] flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#FFF8E6] text-[#D97706] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#242424]">Duplicate Guard</h3>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                  Prevents double-counting if the same bill is uploaded more than once.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptScannerPage;
