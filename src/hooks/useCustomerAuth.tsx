import { createContext, useContext, useState, ReactNode } from "react";
import { mockCustomers, Customer } from "@/data/mockData";

interface CustomerAuthContextType {
  isAuthenticated: boolean;
  currentCustomer: Customer | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType>({
  isAuthenticated: false,
  currentCustomer: null,
  login: () => false,
  logout: () => {}
});

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedCustomer = localStorage.getItem("currentCustomer");
    return !!savedCustomer;
  });
  
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    const savedCustomer = localStorage.getItem("currentCustomer");
    return savedCustomer ? JSON.parse(savedCustomer) : null;
  });

  const login = (email: string, password: string): boolean => {
    const customer = mockCustomers.find(c => c.email === email && c.password === password);
    if (customer) {
      setIsAuthenticated(true);
      setCurrentCustomer(customer);
      localStorage.setItem("currentCustomer", JSON.stringify(customer));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentCustomer(null);
    localStorage.removeItem("currentCustomer");
  };

  return (
    <CustomerAuthContext.Provider value={{ isAuthenticated, currentCustomer, login, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  return context;
}