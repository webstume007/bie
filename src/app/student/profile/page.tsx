'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateStudentProfileAction } from '@/features/students/actions';
import { useFormDraft } from '@/hooks/useFormDraft';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialFormValues = {
  fullName: '',
  contactNumber: '',
  cnic: '',
  fatherName: '',
  dob: '',
  gender: '',
  bFormCnic: '',
  address: '',
};

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { values, setValues, handleChange, clearDraft, isDirty } = useFormDraft(
    'student_profile',
    initialFormValues
  );

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name, contact_number, cnic')
          .eq('id', user.id)
          .single();
          
        const { data: student } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single();
          
        const dbValues = {
          fullName: profile?.full_name || '',
          contactNumber: profile?.contact_number || '',
          cnic: profile?.cnic || '',
          fatherName: student?.father_name || '',
          dob: student?.dob || '',
          gender: student?.gender || '',
          bFormCnic: student?.b_form_cnic || '',
          address: student?.permanent_address || '',
        };

        // Load saved local storage draft to merge over database values
        let savedDraft = {};
        try {
          const rawDraft = localStorage.getItem('draft_student_profile');
          if (rawDraft) savedDraft = JSON.parse(rawDraft);
        } catch (e) {
          console.error(e);
        }

        setValues({
          ...dbValues,
          ...savedDraft,
        });
      }
      setFetching(false);
    }
    loadProfile();
  }, [setValues]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const result = await updateStudentProfileAction(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
      clearDraft(); // Clean up draft since it successfully saved
    }
    
    setLoading(false);
  }

  if (fetching) {
    return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Complete your demographic information for enrollments.</p>
        </div>
        {isDirty && (
          <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full font-medium animate-pulse">
            Unsaved Draft
          </span>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <form action={handleSubmit} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  value={values.fullName} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input 
                  id="fatherName" 
                  name="fatherName" 
                  value={values.fatherName} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bFormCnic">B-Form / CNIC Number</Label>
                <Input 
                  id="bFormCnic" 
                  name="bFormCnic" 
                  value={values.bFormCnic} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                  placeholder="XXXXX-XXXXXXX-X" 
                />
                <p className="text-xs text-slate-500">Used for official verification.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input 
                  id="dob" 
                  name="dob" 
                  type="date" 
                  value={values.dob} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
            </div>

            <div className="space-y-2 max-w-sm">
              <Label htmlFor="gender">Gender</Label>
              <select 
                id="gender" 
                name="gender" 
                value={values.gender}
                onChange={handleChange}
                required 
                className="flex h-10 w-full items-center justify-between whitespace-nowrap rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Mobile Number (Optional)</Label>
                <Input 
                  id="contactNumber" 
                  name="contactNumber" 
                  value={values.contactNumber} 
                  onChange={handleChange}
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Permanent Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={values.address} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
            </div>
          </div>

          {error && <div className="text-sm text-red-500 font-medium p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/50">{error}</div>}
          {success && <div className="text-sm text-green-600 font-medium p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/50">{success}</div>}

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto px-8 rounded-xl hover-lift" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
