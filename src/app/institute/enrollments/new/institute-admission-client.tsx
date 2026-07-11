'use client';

import { useState } from 'react';
import { CnicLookup } from '@/components/cnic-lookup';
import { AdmissionWizard } from '@/components/admission-wizard';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InstituteAdmissionClient({ instituteId }: { instituteId: string }) {
  const [studentData, setStudentData] = useState<any>(null);
  const [mode, setMode] = useState<'lookup' | 'wizard'>('lookup');

  const handleLookupResult = (data: any) => {
    setStudentData(data);
    setMode('wizard');
  };

  if (mode === 'wizard') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Enrollment</h2>
            {studentData?.found ? (
              <p className="text-sm text-green-600">Existing record found for CNIC: {studentData.cnic}</p>
            ) : (
              <p className="text-sm text-blue-600">New student record for CNIC: {studentData.cnic}</p>
            )}
          </div>
          <Button variant="outline" onClick={() => setMode('lookup')}>Back to Lookup</Button>
        </div>
        <AdmissionWizard 
          initialData={studentData} 
          isPrivate={false} 
          instituteId={instituteId} 
          onComplete={() => {
            alert('Admission successful!');
            setMode('lookup');
            setStudentData(null);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserPlus className="size-6 text-indigo-600" />
          Enroll New Student
        </h2>
        <p className="text-sm text-slate-500 mt-1">Look up a student by CNIC to begin the enrollment process.</p>
      </div>

      <div className="max-w-xl">
        <CnicLookup onResult={handleLookupResult} />
      </div>
    </div>
  );
}
