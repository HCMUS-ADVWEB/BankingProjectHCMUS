import {
  Users,
  Clock,
  Headphones,
  Star,
  UserCircle2,
  Award,
  Shield,
  PiggyBank,
  Phone,
  Zap,
  Lock,
} from 'lucide-react';
import TransferIcon from '@mui/icons-material/SyncAlt';
import SendIcon from '@mui/icons-material/Send';
import PaymentIcon from '@mui/icons-material/Payment';
import MoneyIcon from '@mui/icons-material/AttachMoney';
//export const BASE_URL = 'http://localhost:8080';
export const BASE_URL = 'https://banking-backend-aca.calmbush-23bf89f4.southeastasia.azurecontainerapps.io';

export const SOLUTIONS = [
  {
    icon: UserCircle2,
    title: 'Account Management',
    description:
      'View all your payment accounts with real-time balance updates. Manage multiple accounts seamlessly with comprehensive transaction history.',
    features: ['Real-time Balance', 'Account Overview', 'Transaction History'],
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Internal Transfers',
    description:
      'Instant money transfers within our banking network. Save beneficiaries for quick transfers with secure OTP verification.',
    features: ['Instant Processing', 'Saved Recipients', 'OTP Security'],
    gradient: 'from-emerald-500 to-green-500',
    iconBg: 'from-emerald-500 to-green-500',
  },
  {
    icon: Shield,
    title: 'Interbank Transfers',
    description:
      'Send money to other banks through our secure network. Connected with partner banks for seamless cross-bank transactions.',
    features: ['Partner Networks', 'Cross-Bank Support', 'Secure Protocol'],
    gradient: 'from-purple-500 to-pink-500',
    iconBg: 'from-purple-500 to-pink-500',
  },
  {
    icon: Phone,
    title: 'Debt Reminders',
    description:
      'Create and manage debt reminders efficiently. Track outstanding debts and receive notifications for due payments.',
    features: ['Smart Reminders', 'Payment Tracking', 'Auto Notifications'],
    gradient: 'from-orange-500 to-red-500',
    iconBg: 'from-orange-500 to-red-500',
  },
  {
    icon: Lock,
    title: 'Recipient Management',
    description:
      'Build and maintain your trusted recipient list. Add custom nicknames and manage beneficiary information securely.',
    features: ['Custom Nicknames', 'Quick Access', 'Secure Storage'],
    gradient: 'from-teal-500 to-blue-600',
    iconBg: 'from-teal-500 to-blue-600',
  },
  {
    icon: Award,
    title: 'Transaction Fees',
    description:
      'Flexible fee payment options for all transfers. Choose between sender pays or recipient pays for maximum convenience.',
    features: ['Flexible Options', 'Transparent Fees', 'Cost Control'],
    gradient: 'from-yellow-500 to-orange-500',
    iconBg: 'from-yellow-500 to-orange-500',
  },
];

export const GENERAL_STATS = [
  {
    number: '8K',
    label: 'Users',
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    number: '100%',
    label: 'Available',
    icon: Clock,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    number: '24/7',
    label: 'Support',
    icon: Headphones,
    color: 'from-purple-500 to-violet-500',
  },
  {
    number: '4.9★',
    label: 'Rating',
    icon: Star,
    color: 'from-amber-500 to-orange-500',
  },
];

export const CUSTOMER_EXPERIENCES = [
  {
    icon: Zap,
    title: 'Instant Transfers',
    description:
      'Send and receive money instantly with real-time notifications and confirmations.',
    gradient: 'from-yellow-500 to-orange-500',
    stat: '< 3 sec',
    statLabel: 'Transfer Time',
  },
  {
    icon: Phone,
    title: '24/7 Support',
    description:
      'Round-the-clock customer support via chat, phone, and email whenever you need help.',
    gradient: 'from-blue-500 to-cyan-500',
    stat: '24/7',
    statLabel: 'Available',
  },
  {
    icon: PiggyBank,
    title: 'Smart Savings',
    description:
      'Automated savings tools and personalized financial insights to grow your wealth.',
    gradient: 'from-green-500 to-emerald-500',
    stat: '4.2%',
    statLabel: 'APY Rate',
  },
];

export const MANAGEMENTS = [
  {
    role: 'Customer',
    icon: UserCircle2,
    description:
      'Complete banking experience with account management, transfers, and debt reminders.',
    features: [
      'Account Dashboard',
      'Internal & Interbank Transfers',
      'Debt Management System',
      'Recipient Management',
      'Transaction History',
      'Secure Password Reset',
    ],
    gradient: 'from-blue-500 to-cyan-500',
    users: 'Active Users',
  },
  {
    role: 'Employee',
    icon: Shield,
    description:
      'Banking operations tools for customer account management and transaction processing.',
    features: [
      'Create Customer Accounts',
      'Account Balance Management',
      'Transaction Monitoring',
      'Customer Support Tools',
      'Deposit Processing',
      'Account History Access',
    ],
    gradient: 'from-emerald-500 to-green-500',
    users: 'Staff Members',
  },
  {
    role: 'Administrator',
    icon: Award,
    description:
      'System administration with full oversight of banking operations and staff management.',
    features: [
      'Employee Management',
      'Interbank Reconciliation',
      'Monthly Transaction Reports',
      'Partner Bank Analytics',
      'System Configuration',
      'Security Oversight',
    ],
    gradient: 'from-purple-500 to-pink-500',
    users: 'Executive Level',
  },
];

export const CONTACT_INFO = {
  email: 'fintech.hub.hcmus2025@gmail.com',
  phone: '+84 (09) 0000 0000',
  location: 'Ho Chi Minh City, Vietnam',
};

export const CURRENT_YEAR = new Date().getFullYear();

export const formatVND = (amount) => {
  if (typeof amount !== 'number') return amount;
  return amount.toLocaleString('vi-VN');
};

export const TRANSACTION_TYPES = [
  { value: 'INTERNAL_TRANSFER', label: 'Internal Transfer' },
  { value: 'INTERBANK_TRANSFER', label: 'Interbank Transfer' },
  { value: 'DEBT_PAYMENT', label: 'Debt Payment' },
  { value: 'DEPOSIT', label: 'Deposit' },
];
export const DEBT_STATUS_TYPE = {
  'PENDING': 'Pending',
  'PAID': 'Paid',
  'CANCELLED': 'Cancelled',
};
// Transaction type icons mapping
export const TRANSACTION_TYPE_ICONS = {
  'INTERNAL_TRANSFER': <TransferIcon />,
  'INTERBANK_TRANSFER': <SendIcon />,
  'DEBT_PAYMENT': <PaymentIcon />,
  'DEPOSIT': <MoneyIcon />,
};

// Transaction status colors
export const STATUS_COLORS = {
  'PENDING': 'warning',
  'PAID': 'success',
  'CANCELLED': 'error',
};