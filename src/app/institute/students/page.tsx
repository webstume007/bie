import { createClient } from '@/lib/supabase/server';
import { InstituteShell } from '@/components/institute/institute-shell';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function InstituteStudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: institute } = await supabase
    .from('institutes')
    .select('id')
    .eq('head_user_id', user.id)
    .single();

  if (!institute) {
    return (
      <InstituteShell>
        <div className="p-8 text-center text-red-500">Institute profile not found.</div>
      </InstituteShell>
    );
  }

  const { data: students } = await supabase
    .from('institute_students')
    .select('*')
    .eq('institute_id', institute.id)
    .order('created_at', { ascending: false });

  return (
    <InstituteShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Student Roster</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Manage your institute's registered students.</p>
          </div>
          <Link href="/institute/students/new">
            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
              <Plus className="size-4 mr-2" />
              Add Student
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Father Name</th>
                  <th className="px-6 py-4">Date of Birth</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {!students || students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <Users className="size-12 mb-3 opacity-20" />
                        <p className="text-base font-medium text-neutral-900 dark:text-white">No students found</p>
                        <p className="mt-1">Add students to your roster to enroll them in exams.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{student.full_name}</td>
                      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{student.father_name}</td>
                      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{student.date_of_birth}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </InstituteShell>
  );
}
