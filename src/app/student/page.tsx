import { createClient } from '@/lib/supabase/server';
import { AlertCircle, GraduationCap, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StudentDashboardUI } from '@/components/student/StudentDashboardUI';

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch the user_profile and student record
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('id', user.id)
    .single();

  const isProfileComplete = !!student;
  const studentName = profile?.full_name || 'Student';

  return (
    <StudentDashboardUI 
      isProfileComplete={isProfileComplete} 
      studentName={studentName} 
    />
  );
}
