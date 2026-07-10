import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Plus, BookOpen, Calendar, Hash, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function SessionDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !session) {
    notFound();
  }

  // Fetch courses (courses) linked to this session
  const { data: sessionCourses } = await supabase
    .from('session_courses')
    .select(`
      id,
      base_fee,
      single_fee_deadline,
      double_fee_deadline,
      triple_fee_deadline,
      course_id,
      courses ( id, name, mandatory_electives_count )
    `)
    .eq('session_id', session.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/backstage/sessions"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Session Details</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage courses and subjects for {session.ad_year} / {session.ah_year} AH.</p>
        </div>
      </div>

      {/* Session Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Phase</p>
            <p className="font-bold text-slate-900 dark:text-white mt-1 capitalize">{session.type}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">AD Year</p>
            <div className="flex items-center gap-2 mt-1 font-medium text-slate-900 dark:text-white">
              <Calendar className="size-4 text-slate-400" />
              {session.ad_year}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Islamic Year</p>
            <div className="flex items-center gap-2 mt-1 font-medium text-slate-900 dark:text-white">
              <Hash className="size-4 text-slate-400" />
              {session.ah_year || 'N/A'} AH
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Admission Open</p>
            <p className="font-medium text-slate-900 dark:text-white mt-1">
              {session.admission_open_date ? new Date(session.admission_open_date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="flex items-center justify-between mt-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="size-5 text-indigo-500" />
          Courses in this Session
        </h3>
        <Link href={`/backstage/sessions/${session.id}/add-course`}>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
            <Plus className="size-4" />
            Add Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {(!sessionCourses || sessionCourses.length === 0) ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center">
            <BookOpen className="size-12 mx-auto text-slate-400 opacity-50 mb-3" />
            <p className="text-lg font-medium text-slate-900 dark:text-white">No courses added yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Add courses to this session to define their fee deadlines and manage their subjects.
            </p>
          </div>
        ) : (
          sessionCourses.map((sd) => (
            <div key={sd.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{(sd.courses as any).name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Base Fee: <span className="font-semibold text-slate-700 dark:text-slate-300">Rs. {sd.base_fee}</span>
                  </p>
                </div>
                <Link href={`/backstage/sessions/${session.id}/course/${sd.id}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="size-4" />
                    Manage Subjects
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50 dark:bg-slate-800/20 text-center">
                <div className="p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Single Fee Deadline</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-1">{new Date(sd.single_fee_deadline).toLocaleDateString()}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Double Fee Deadline</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-1">{new Date(sd.double_fee_deadline).toLocaleDateString()}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Triple Fee Deadline</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-1">{new Date(sd.triple_fee_deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
