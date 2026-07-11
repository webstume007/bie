'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchStudentByCnicAction } from '@/features/academic/actions';

interface CnicLookupProps {
  onResult: (data: any) => void;
}

export function CnicLookup({ onResult }: CnicLookupProps) {
  const [cnic, setCnic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (cnic.length < 13) {
      setError('Please enter a valid CNIC');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetchStudentByCnicAction(cnic);
      if (res.found) {
        onResult({ found: true, student: res.studentRecord, userProfile: res.userProfile, eligibility: res.eligibility, cnic });
      } else {
        onResult({ found: false, cnic });
      }
    } catch (err: any) {
      setError('Failed to fetch record. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Student Lookup</h3>
      <p className="text-sm text-slate-500 mb-4">Enter the student's CNIC / B-Form number to fetch their existing record and check eligibility.</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="00000-0000000-0" 
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
        />
        <Button onClick={handleSearch} disabled={isLoading || !cnic} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
          {isLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Search className="size-4 mr-2" />}
          Lookup
        </Button>
      </div>
      
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
