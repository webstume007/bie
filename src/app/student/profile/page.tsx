'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateStudentProfileAction } from '@/features/students/actions';
import { useFormDraft } from '@/hooks/useFormDraft';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud } from 'lucide-react';
import Image from 'next/image';

const initialFormValues = {
  fullName: '',
  contactNumber: '',
  cnic: '',
  fatherName: '',
  nameUrdu: '',
  fatherNameUrdu: '',
  dob: '',
  gender: '',
  bFormCnic: '',
  address: '',
  whatsappNumber: '',
  instituteId: '',
  profileImageUrl: '',
};

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { values, setValues, handleChange, clearDraft, isDirty } = useFormDraft(
    'student_profile',
    initialFormValues
  );

  useEffect(() => {
    async function loadData() {
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
          
        const { data: institutesData } = await supabase
          .from('institutes')
          .select('id, name, affiliation_no')
          .order('name');
          
        if (institutesData) {
          setInstitutes(institutesData);
        }

        const dbValues = {
          fullName: profile?.full_name || '',
          contactNumber: profile?.contact_number || '',
          cnic: profile?.cnic || '',
          fatherName: student?.father_name || '',
          nameUrdu: student?.name_urdu || '',
          fatherNameUrdu: student?.father_name_urdu || '',
          dob: student?.dob || '',
          gender: student?.gender || '',
          bFormCnic: student?.b_form_cnic || '',
          address: student?.permanent_address || '',
          whatsappNumber: student?.whatsapp_number || '',
          instituteId: student?.institute_id?.toString() || '',
          profileImageUrl: student?.profile_image_url || '',
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
    loadData();
  }, [setValues]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setValues(prev => ({ ...prev, profileImageUrl: publicUrl }));
      setSuccess('Image uploaded. Don\'t forget to save your profile.');
    } catch (err: any) {
      console.error(err);
      setError('Failed to upload image. Make sure the "avatars" bucket is created and public.');
    } finally {
      setUploadingImage(false);
    }
  }

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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
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
          
          {/* Profile Picture Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
              {values.profileImageUrl ? (
                <Image src={values.profileImageUrl} alt="Profile" fill className="object-cover" />
              ) : (
                <UploadCloud className="size-8 text-slate-400" />
              )}
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">Profile Picture</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Upload a passport size picture. This will be used on your admission forms and roll number slips.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                <Label htmlFor="picture-upload" className="cursor-pointer inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                  {uploadingImage ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Choose File
                </Label>
                <input 
                  id="picture-upload" 
                  type="file" 
                  accept="image/*" 
                  className="sr-only" 
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                <input type="hidden" name="profileImageUrl" value={values.profileImageUrl} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Name (English)</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  value={values.fullName} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
              <div className="space-y-2 text-right">
                <Label htmlFor="nameUrdu" dir="rtl">نام (اردو میں)</Label>
                <Input 
                  id="nameUrdu" 
                  name="nameUrdu" 
                  value={values.nameUrdu} 
                  onChange={handleChange}
                  dir="rtl"
                  className="h-10 rounded-xl focus-ring-glow text-right" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name (English)</Label>
                <Input 
                  id="fatherName" 
                  name="fatherName" 
                  value={values.fatherName} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
              <div className="space-y-2 text-right">
                <Label htmlFor="fatherNameUrdu" dir="rtl">ولدیت (اردو میں)</Label>
                <Input 
                  id="fatherNameUrdu" 
                  name="fatherNameUrdu" 
                  value={values.fatherNameUrdu} 
                  onChange={handleChange}
                  dir="rtl"
                  className="h-10 rounded-xl focus-ring-glow text-right" 
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
                className="flex h-10 w-full items-center justify-between whitespace-nowrap rounded-xl border border-input bg-transparent dark:bg-slate-900 px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Academic & Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="instituteId">Affiliated Institute (Optional)</Label>
                <select 
                  id="instituteId" 
                  name="instituteId" 
                  value={values.instituteId}
                  onChange={handleChange}
                  className="flex h-10 w-full items-center justify-between whitespace-nowrap rounded-xl border border-input bg-transparent dark:bg-slate-900 px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select your institute (if regular student)</option>
                  {institutes.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.affiliation_no ? `${inst.affiliation_no} - ` : ''}{inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Mobile Number (Optional)</Label>
                <Input 
                  id="contactNumber" 
                  name="contactNumber" 
                  value={values.contactNumber} 
                  onChange={handleChange}
                  className="h-10 rounded-xl focus-ring-glow" 
                  placeholder="0300-0000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input 
                  id="whatsappNumber" 
                  name="whatsappNumber" 
                  value={values.whatsappNumber} 
                  onChange={handleChange}
                  className="h-10 rounded-xl focus-ring-glow" 
                  placeholder="0300-0000000"
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
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
