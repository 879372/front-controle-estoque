'use client';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextProps {
  modalPass: boolean;
  setModalPass: (modalPass: boolean) => void;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  token: string;
  setToken: (token: string) => void;
  isMaster: string;
  setIsMaster: (isMaster: string) => void;
  companyId: string;
  setCompanyId: (companyId: string) => void;
  companyName: string;
  SetCompanyName: (companyName: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token') || '';
    }
    return '';
  });
  const [isMaster, setIsMaster] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('isMaster') || '';
    }
    return '';
  });
  const [companyId, setCompanyId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('companyId') || '';
    }
    return '';
  });
  const [companyName, SetCompanyName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('companyName') || '';
    }
    return '';
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('activeTab') || '';
    }
    return '';
  });
  const [modalPass, setModalPass] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedValue = sessionStorage.getItem('modalPass');
      return storedValue === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem('token', token);
      } else {
        sessionStorage.removeItem('token');
      }
    }
  }, [token]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isMaster) {
        sessionStorage.setItem('isMaster', isMaster);
      } else {
        sessionStorage.removeItem('isMaster');
      }
    }
  }, [isMaster]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeTab) {
        sessionStorage.setItem('activeTab', activeTab);
      } else {
        sessionStorage.removeItem('activeTab');
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (companyId) {
        sessionStorage.setItem('companyId', companyId);
      } else {
        sessionStorage.removeItem('companyId');
      }
    }
  }, [companyId]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (companyName) {
        sessionStorage.setItem('companyName', companyName);
      } else {
        sessionStorage.removeItem('companyName');
      }
    }
  }, [companyName]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (modalPass) {
        sessionStorage.setItem('modalPass', String(modalPass));
      } else {
        sessionStorage.removeItem('modalPass');
      }
    }
  }, [modalPass]);

  return (
    <AuthContext.Provider value={{ token, setToken, isMaster, setIsMaster, companyId, setCompanyId, companyName, SetCompanyName, activeTab, setActiveTab, modalPass, setModalPass }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
