'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processAdmissionAction } from '@/features/academic/actions';

interface AdmissionWizardProps {
  initialData?: any;
  isPrivate?: boolean;
  instituteId?: string; // Pre-filled if institute is doing it, or selected later if private
  onComplete?: () => void;
}

export function AdmissionWizard({ initialData, isPrivate, instituteId, onComplete }: AdmissionWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    studentId: initialData?.student?.id || '',
    cnic: initialData?.cnic || '',
    fatherName: initialData?.student?.father_name || '',
    nameUrdu: initialData?.student?.name_urdu || '',
    fatherNameUrdu: initialData?.student?.father_name_urdu || '',
    dob: initialData?.student?.dob || '',
    gender: initialData?.student?.gender || '',
    email: initialData?.student?.email || initialData?.userProfile?.email || '',
    mobile: initialData?.userProfile?.contact_number || '',
    whatsapp: initialData?.student?.whatsapp_number || '',
    permanentAddress: initialData?.student?.permanent_address || '',
    currentInstituteName: initialData?.student?.current_institute_name || '',
    instituteAddress: initialData?.student?.institute_address || '',
    nearExamCenter: initialData?.student?.near_examination_center || '',
    // Academic fields
    sessionId: '',
    courseId: initialData?.eligibility?.eligibleCourseIds?.[0] || '', // Default to first eligible
    subjectIds: initialData?.eligibility?.supplySubjectIds || [], // Pre-fill supply subjects if applicable
    instituteId: instituteId || '', // For private students this must be selected
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const res = await processAdmissionAction({ ...formData, isPrivate });
      if (res.error) {
        setError(res.error);
      } else {
        if (onComplete) onComplete();
      }
    } catch (err: any) {
      setError('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800 relative">
        {/* Placeholder Stepper Design based on screenshot */}
        <div className={`flex flex-col items-center ${step === 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>1</div>
          <span className="text-xs font-medium">Personal Information</span>
        </div>
        <div className={`flex flex-col items-center ${step === 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>2</div>
          <span className="text-xs font-medium">Academic Information</span>
        </div>
        <div className={`flex flex-col items-center ${step === 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>3</div>
          <span className="text-xs font-medium">Upload Documents</span>
        </div>
        <div className={`flex flex-col items-center ${step === 4 ? 'text-indigo-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${step === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>4</div>
          <span className="text-xs font-medium">Verification</span>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      {step === 1 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Personal Information</h3>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white" dir="rtl">ذاتی معلومات</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name (in English)</label>
              <input name="name" value={initialData?.userProfile?.full_name || ''} readOnly className="w-full px-4 py-2 bg-slate-50 border rounded-lg" placeholder="Enter Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-right" dir="rtl">نام (اردو میں)</label>
              <input name="nameUrdu" value={formData.nameUrdu} onChange={handleChange} dir="rtl" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="اپنا نام درج کریں" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Father Name (in English)</label>
              <input name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Enter Your Father Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-right" dir="rtl">ولدیت (اردو میں)</label>
              <input name="fatherNameUrdu" value={formData.fatherNameUrdu} onChange={handleChange} dir="rtl" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="اپنے والد کا نام درج کریں" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CNIC No</label>
              <input name="cnic" value={formData.cnic} readOnly className="w-full px-4 py-2 bg-slate-50 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail</label>
              <input name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Enter Your Email Address" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0000-0000000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
              <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0000-0000000" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Permanent Address</label>
              <input name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Enter Your Address" />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Academic Information</h3>
          {initialData?.eligibility?.isSupply && (
             <div className="mb-4 p-4 bg-orange-50 text-orange-800 rounded-lg text-sm font-medium">
               {initialData.eligibility.message}
             </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Session</label>
              <select name="sessionId" value={formData.sessionId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Session</option>
                {/* Options should be passed in as props or fetched */}
                <option value="1">Annual 2026</option> 
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
              <select name="courseId" value={formData.courseId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Course</option>
                {initialData?.eligibility?.eligibleCourseIds?.map((cId: string) => (
                  <option key={cId} value={cId}>Course ID: {cId}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Verification & Submission</h3>
          <p className="text-slate-600 mb-6">Please verify all information before submission. Once submitted, you cannot change the details.</p>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
        )}
        {step < 4 ? (
          <Button onClick={() => setStep(s => s + 1)} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]">Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]">
            {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Submit Application
          </Button>
        )}
      </div>

    </div>
  );
}
