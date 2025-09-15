// Utility functions for managing advance payments with local storage

interface AdvancePayment {
  id: string;
  employeeId: string;
  amount: number;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'paid';
  remainingBalance: number;
}

interface AdvanceDeduction {
  employeeId: string;
  payrollId: string;
  deductionAmount: number;
  deductionDate: string;
}

const STORAGE_KEY = 'employee_advances';
const DEDUCTIONS_KEY = 'advance_deductions';

export const getEmployeeAdvances = (): AdvancePayment[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveEmployeeAdvances = (advances: AdvancePayment[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(advances));
};

export const addAdvancePayment = (employeeId: string, amount: number, reason: string): AdvancePayment => {
  const advances = getEmployeeAdvances();
  const newAdvance: AdvancePayment = {
    id: `ADV-${Date.now()}`,
    employeeId,
    amount,
    date: new Date().toISOString().split('T')[0],
    reason,
    status: 'approved',
    remainingBalance: amount
  };
  
  advances.push(newAdvance);
  saveEmployeeAdvances(advances);
  return newAdvance;
};

export const getEmployeeAdvanceBalance = (employeeId: string): number => {
  const advances = getEmployeeAdvances();
  return advances
    .filter(advance => advance.employeeId === employeeId && advance.status === 'approved')
    .reduce((total, advance) => total + advance.remainingBalance, 0);
};

export const getEmployeeAdvanceHistory = (employeeId: string): AdvancePayment[] => {
  const advances = getEmployeeAdvances();
  return advances.filter(advance => advance.employeeId === employeeId);
};

export const deductFromAdvance = (employeeId: string, deductionAmount: number, payrollId: string): void => {
  const advances = getEmployeeAdvances();
  let remainingDeduction = deductionAmount;
  
  // Deduct from oldest advances first
  const employeeAdvances = advances
    .filter(advance => advance.employeeId === employeeId && advance.remainingBalance > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  for (const advance of employeeAdvances) {
    if (remainingDeduction <= 0) break;
    
    const deductFromThisAdvance = Math.min(advance.remainingBalance, remainingDeduction);
    advance.remainingBalance -= deductFromThisAdvance;
    remainingDeduction -= deductFromThisAdvance;
  }
  
  saveEmployeeAdvances(advances);
  
  // Track the deduction
  const deductions = getAdvanceDeductions();
  deductions.push({
    employeeId,
    payrollId,
    deductionAmount,
    deductionDate: new Date().toISOString().split('T')[0]
  });
  localStorage.setItem(DEDUCTIONS_KEY, JSON.stringify(deductions));
};

export const getAdvanceDeductions = (): AdvanceDeduction[] => {
  const stored = localStorage.getItem(DEDUCTIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getTotalAdvancesGiven = (): number => {
  const advances = getEmployeeAdvances();
  return advances
    .filter(advance => advance.status === 'approved')
    .reduce((total, advance) => total + advance.amount, 0);
};

export const getTotalOutstandingAdvances = (): number => {
  const advances = getEmployeeAdvances();
  return advances
    .filter(advance => advance.status === 'approved')
    .reduce((total, advance) => total + advance.remainingBalance, 0);
};