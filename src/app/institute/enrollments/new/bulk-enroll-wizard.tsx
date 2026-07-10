'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { bulkEnrollAction } from '@/features/institute/actions';

type WizardProps = {
  sessions: any[];
  degrees: any[];
  students: any[];
};

export default function BulkEnrollWizard({ sessions, degrees, students }: WizardProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [degreeId, setDegreeId] = useState<string>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleStudent = (id: string) => {
    const next = new Set(selectedStudentIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedStudentIds(next);
  };

  const toggleAll = () => {
    if (selectedStudentIds.size === students.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(students.map(s => s.id)));
    }
  };

  const handleSubmit = async () => {
    if (!sessionId || !degreeId || selectedStudentIds.size === 0) {
      setError('Please select a session, degree, and at least one student.');
      return;
    }

    setIsPending(true);
    setError(null);

    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('degreeId', degreeId);
    formData.append('studentIds', Array.from(selectedStudentIds).join(','));

    const res = await bulkEnrollAction(null, formData);
    
    if (res?.error) {
      setError(res.error);
      setIsPending(false);
    } else if (res?.success) {
      router.push('/institute/enrollments');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/institute/enrollments">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Bulk Enrollment Wizard</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Enroll multiple students into an exam session at once.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Step 1: Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-base">1. Select Session</Label>
            <Select value={sessionId} onValueChange={(val) => setSessionId(val || '')}>
              <SelectTrigger className="bg-neutral-50 dark:bg-neutral-950">
                <SelectValue placeholder="Choose an active session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name} ({s.year})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base">2. Select Degree</Label>
            <Select value={degreeId} onValueChange={(val) => setDegreeId(val || '')}>
              <SelectTrigger className="bg-neutral-50 dark:bg-neutral-950">
                <SelectValue placeholder="Choose a degree program" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <hr className="border-neutral-200 dark:border-neutral-800" />

        {/* Step 2: Roster Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <Label className="text-base">3. Select Students ({selectedStudentIds.size} selected)</Label>
            <Button variant="outline" size="sm" onClick={toggleAll}>
              {selectedStudentIds.size === students.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 w-12"></th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Father Name</th>
                  <th className="px-4 py-3">DOB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                      <Users className="size-10 opacity-20 mx-auto mb-2" />
                      No students in your roster. Add students first.
                    </td>
                  </tr>
                ) : (
                  students.map(student => (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${selectedStudentIds.has(student.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                      onClick={() => toggleStudent(student.id)}
                    >
                      <td className="px-4 py-3">
                        <Checkbox 
                          checked={selectedStudentIds.has(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                          aria-label={`Select ${student.full_name}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{student.full_name}</td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{student.father_name}</td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{student.date_of_birth}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3">
          <Link href="/institute/enrollments">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button 
            onClick={handleSubmit} 
            className="bg-indigo-600 hover:bg-indigo-700 text-neutral-950" 
            disabled={isPending || selectedStudentIds.size === 0 || !sessionId || !degreeId}
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Enroll {selectedStudentIds.size > 0 ? selectedStudentIds.size : ''} Students
          </Button>
        </div>

      </div>
    </div>
  );
}
