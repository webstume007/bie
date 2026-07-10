import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Plus, Book, CheckCircle, CircleDashed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function SessionCourseSubjectsPage({ params }: { params: { id: string, sessionCourseId: string } }) {
  const supabase = await createClient();
  
  // Fetch session course info
  const { data: sessionCourse, error } = await supabase
    .from('session_courses')
    .select(`
      id,
      courses ( name, mandatory_electives_count )
    `)
    .eq('id', params.sessionCourseId)
    .single();

  if (error || !sessionCourse) {
    notFound();
  }

  // Fetch subjects linked to this session course
  const { data: sessionSubjects } = await supabase
    .from('session_course_subjects')
    .select(`
      id,
      is_compulsory,
      total_marks,
      subjects ( id, name )
    `)
    .eq('session_course_id', sessionCourse.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/backstage/sessions/${params.id}`}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Manage Subjects
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            For course: <span className="font-semibold">{(sessionCourse.courses as any).name}</span>
          </p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">Mandatory Electives Required:</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Students must select this many elective subjects.</p>
        </div>
        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
          {(sessionCourse.courses as any).mandatory_electives_count}
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Book className="size-5 text-indigo-500" />
          Subjects Curriculum
        </h3>
        <Link href={`/backstage/sessions/${params.id}/course/${params.sessionCourseId}/add-subject`}>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
            <Plus className="size-4" />
            Add Subject
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-4">Subject Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Total Marks</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {(!sessionSubjects || sessionSubjects.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <Book className="size-8 mx-auto opacity-20 mb-2" />
                  No subjects added to this course yet.
                </td>
              </tr>
            )}
            
            {sessionSubjects?.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {(sub.subjects as any).name}
                </td>
                <td className="px-6 py-4">
                  {sub.is_compulsory ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-medium text-xs">
                      <CheckCircle className="size-3.5" /> Compulsory
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-medium text-xs">
                      <CircleDashed className="size-3.5" /> Selective
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                  {sub.total_marks}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-red-500 hover:text-red-700 font-medium text-sm">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
