
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import SupplyForm from './components/SupplyForm';
import SupplyTable from './components/SupplyTable';
import { DailySupply } from './types';

const APP_STORAGE_KEY = 'officeSupplyRecords';

const App: React.FC = () => {
  const [supplies, setSupplies] = useState<DailySupply[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingSupply, setEditingSupply] = useState<DailySupply | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedSupplies = localStorage.getItem(APP_STORAGE_KEY);
      if (storedSupplies) {
        setSupplies(JSON.parse(storedSupplies));
      }
    } catch (error) {
      console.error("Failed to load supplies from localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(supplies));
      } catch (error) {
        console.error("Failed to save supplies to localStorage:", error);
      }
    }
  }, [supplies, isLoading]);

  const handleSetEditingSupply = useCallback((supply: DailySupply) => {
    setEditingSupply(supply);
    if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingSupply(null);
  }, []);

  const handleAddSupply = useCallback((newSupplyData: Omit<DailySupply, 'id'>) => {
    setEditingSupply(null); // Clear any editing state
    const newSupply: DailySupply = {
      ...newSupplyData,
      id: Date.now().toString(),
    };
    setSupplies(prevSupplies => 
      [newSupply, ...prevSupplies].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || parseInt(b.id) - parseInt(a.id))
    );
  }, []);

  const handleUpdateSupply = useCallback((updatedSupply: DailySupply) => {
    setSupplies(prevSupplies =>
      prevSupplies.map(supply => (supply.id === updatedSupply.id ? updatedSupply : supply))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || parseInt(b.id) - parseInt(a.id))
    );
    setEditingSupply(null);
  }, []);

  const handleDeleteSupply = useCallback((idToDelete: string) => {
    if (editingSupply && editingSupply.id === idToDelete) {
        setEditingSupply(null); // Clear editing state if the edited item is deleted
    }
    setSupplies(prevSupplies => prevSupplies.filter(supply => supply.id !== idToDelete));
  }, [editingSupply]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Header />
      <main className="container mx-auto mt-8 px-4 max-w-4xl">
        <div ref={formRef}>
          <SupplyForm
            onAddSupply={handleAddSupply}
            editingSupply={editingSupply}
            onUpdateSupply={handleUpdateSupply}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        <SupplyTable 
            supplies={supplies} 
            onDeleteSupply={handleDeleteSupply}
            onEditSupply={handleSetEditingSupply} 
        />
      </main>
      <footer className="text-center py-8 mt-12 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Office Records. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
