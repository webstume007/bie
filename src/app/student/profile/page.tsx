'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateStudentProfileAction } from '@/features/students/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [initialData, setInitialData] = useState<any>({});

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
          
        setInitialData({
          fullName: profile?.full_name || '',
          contactNumber: profile?.contact_number || '',
          cnic: profile?.cnic || '',
          fatherName: student?.father_name || '',
          dob: student?.dob || '',
          gender: student?.gender || '',
          bFormCnic: student?.b_form_cnic || '',
          address: student?.permanent_address || '',
        });
      }
      setFetching(false);
    }
    loadProfile();
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const result = await updateStudentProfileAction(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    
    setLoading(false);
  }

  if (fetching) {
    return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Complete your demographic information for enrollments.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form action={handleSubmit} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" defaultValue={initialData.fullName} required className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input id="fatherName" name="fatherName" defaultValue={initialData.fatherName} required className="h-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bFormCnic">B-Form / CNIC Number</Label>
                <Input id="bFormCnic" name="bFormCnic" defaultValue={initialData.bFormCnic || initialData.cnic} required className="h-10" placeholder="XXXXX-XXXXXXX-X" />
                <p className="text-xs text-slate-500">Used for official verification.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" name="dob" type="date" defaultValue={initialData.dob} required className="h-10" />
              </div>
            </div>

            <div className="space-y-2 max-w-sm">
              <Label htmlFor="gender">Gender</Label>
              <select 
                id="gender" 
                name="gender" 
                defaultValue={initialData.gender}
                required 
                className="flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Mobile Number (Optional)</Label>
                <Input id="contactNumber" name="contactNumber" defaultValue={initialData.contactNumber} className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Permanent Address</Label>
                <Input id="address" name="address" defaultValue={initialData.address} required className="h-10" />
            </div>
          </div>

          {error && <div className="text-sm text-red-500 font-medium p-3 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-100 dark:border-red-900/50">{error}</div>}
          {success && <div className="text-sm text-green-600 font-medium p-3 bg-green-50 dark:bg-green-900/10 rounded-md border border-green-100 dark:border-green-900/50">{success}</div>}

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto px-8" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
