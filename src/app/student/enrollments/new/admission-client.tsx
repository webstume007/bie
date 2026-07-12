'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processAdmissionAction } from '@/features/academic/actions';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface SinglePageAdmissionFormProps {
  initialData: any;
  activeSessions: any[];
  examCenters: any[];
}

export function SinglePageAdmissionForm({ initialData, activeSessions, examCenters }: SinglePageAdmissionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Ensure we use the CNIC that the account was created with/locked to
  const lockedCnic = initialData?.userProfile?.cnic || initialData?.cnic || '';

  const [formData, setFormData] = useState({
    studentId: initialData?.student?.id || '',
    cnic: lockedCnic,
    fatherName: initialData?.student?.father_name || '',
    nameUrdu: initialData?.student?.name_urdu || '',
    fatherNameUrdu: initialData?.student?.father_name_urdu || '',
    dob: initialData?.student?.dob || '',
    gender: initialData?.student?.gender || '',
    email: initialData?.student?.email || initialData?.userProfile?.email || '',
    mobile: initialData?.userProfile?.contact_number || '',
    whatsapp: initialData?.student?.whatsapp_number || '',
    permanentAddress: initialData?.student?.permanent_address || '',
    
    // Academic fields
    sessionId: activeSessions?.length === 1 ? activeSessions[0].id.toString() : '',
    courseId: initialData?.eligibility?.eligibleCourses?.[0]?.id || '',
    subjectIds: initialData?.eligibility?.supplySubjectIds || [],
    instituteId: '', // The Examination Center
    isPrivate: true, // Defaulting to private, but user selects
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isPrivate: e.target.value === 'private' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.sessionId || !formData.courseId || !formData.instituteId) {
      setError('Please select Session, Course, and Examination Center.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await processAdmissionAction(formData);
      if (res.error) {
        setError(res.error);
      } else {
        router.push(`/student/enrollments`);
      }
    } catch (err: any) {
      setError('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg text-sm">{error}</div>}

      <div className="space-y-8">
        
        {/* Profile Readonly Section */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Personal Information</h3>
            <span className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded font-medium">Locked Data</span>
          </div>
          
          <div className="flex items-start gap-6">
            {initialData?.student?.profile_image_url && (
              <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Image src={initialData.student.profile_image_url} alt="Profile" fill className="object-cover" />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 flex-1">
              <div>
                <Label className="text-xs text-slate-500">Name</Label>
                <div className="font-medium">{initialData?.userProfile?.full_name || 'N/A'}</div>
              </div>
              <div className="text-right" dir="rtl">
                <Label className="text-xs text-slate-500 block">نام</Label>
                <div className="font-medium">{formData.nameUrdu || 'N/A'}</div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">CNIC (Locked)</Label>
                <div className="font-medium text-slate-700 dark:text-slate-300">{lockedCnic}</div>
              </div>
              
              <div>
                <Label className="text-xs text-slate-500">Father's Name</Label>
                <div className="font-medium">{formData.fatherName || 'N/A'}</div>
              </div>
              <div className="text-right" dir="rtl">
                <Label className="text-xs text-slate-500 block">ولدیت</Label>
                <div className="font-medium">{formData.fatherNameUrdu || 'N/A'}</div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">DOB</Label>
                <div className="font-medium">{formData.dob || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Application Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Admission Details</h3>
          
          {initialData?.eligibility?.isSupply && (
             <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50 rounded-lg text-sm font-medium">
               {initialData.eligibility.message}
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Regular vs Private */}
            <div className="space-y-3 md:col-span-2">
              <Label>Enrollment Type</Label>
              <div className="flex items-center gap-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="enrollmentType" 
                    value="regular"
                    checked={!formData.isPrivate}
                    onChange={handleRadioChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800"
                  />
                  <span className="text-sm font-medium">Regular Student (Institution)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="enrollmentType" 
                    value="private"
                    checked={formData.isPrivate}
                    onChange={handleRadioChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800"
                  />
                  <span className="text-sm font-medium">Private Student</span>
                </label>
              </div>
            </div>

            {(!activeSessions || activeSessions.length > 1) && (
              <div className="space-y-2">
                <Label htmlFor="sessionId">Session</Label>
                <select 
                  id="sessionId"
                  name="sessionId" 
                  value={formData.sessionId} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-input bg-transparent dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Session</option>
                  {activeSessions?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name || `${s.year} ${s.type}`}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="courseId">Course applying for</Label>
              <select 
                id="courseId"
                name="courseId" 
                value={formData.courseId} 
                onChange={handleChange} 
                required
                className="w-full px-4 py-2 rounded-xl border border-input bg-transparent dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Course</option>
                {initialData?.eligibility?.eligibleCourses?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="instituteId">Examination Center</Label>
              <select 
                id="instituteId"
                name="instituteId" 
                value={formData.instituteId} 
                onChange={handleChange} 
                required
                className="w-full px-4 py-2 rounded-xl border border-input bg-transparent dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Exam Center</option>
                {examCenters.map((center) => (
                  <option key={center.id} value={center.id}>{center.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500">Select the center where you will appear for examinations.</p>
            </div>
            
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
          <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px] rounded-xl h-12 hover-lift">
            {isSubmitting ? <Loader2 className="size-5 animate-spin mr-2" /> : null}
            Submit Application
          </Button>
        </div>

      </div>
    </form>
  );
}
