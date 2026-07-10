'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createFullSessionAction } from '@/features/academic/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

interface UnifiedSessionFormProps {}

export default function UnifiedSessionForm({}: UnifiedSessionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Session state
  const [sessionData, setSessionData] = useState({
    adYear: new Date().getFullYear().toString(),
    ahYear: '',
    type: 'regular',
    admissionOpenDate: '',
    singleFeeDate: '',
    doubleFeeDate: '',
    tripleFeeDate: '',
  });

  // Dynamic courses state
  const [courses, setCourses] = useState<any[]>([]);

  const handleAddCourse = () => {
    setCourses([
      ...courses,
      {
        uid: Date.now().toString(), // unique id for iteration
        courseName: '',
        singleFee: '',
        doubleFee: '',
        tripleFee: '',
        mandatoryCount: '0',
        subjects: [],
      },
    ]);
  };

  const handleRemoveCourse = (uid: string) => {
    setCourses(courses.filter((c) => c.uid !== uid));
  };

  const handleCourseChange = (uid: string, field: string, value: any) => {
    setCourses(
      courses.map((c) => {
        if (c.uid === uid) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

  const handleAddSubject = (courseUid: string) => {
    setCourses(
      courses.map((c) => {
        if (c.uid === courseUid) {
          return {
            ...c,
            subjects: [
              ...c.subjects,
              {
                uid: Date.now().toString() + Math.random().toString(),
                subjectName: '',
                totalMarks: 100,
                isCompulsory: true,
              },
            ],
          };
        }
        return c;
      })
    );
  };

  const handleRemoveSubject = (courseUid: string, subjectUid: string) => {
    setCourses(
      courses.map((c) => {
        if (c.uid === courseUid) {
          return {
            ...c,
            subjects: c.subjects.filter((s: any) => s.uid !== subjectUid),
          };
        }
        return c;
      })
    );
  };

  const handleSubjectChange = (courseUid: string, subjectUid: string, field: string, value: any) => {
    setCourses(
      courses.map((c) => {
        if (c.uid === courseUid) {
          return {
            ...c,
            subjects: c.subjects.map((s: any) => {
              if (s.uid === subjectUid) {
                return { ...s, [field]: value };
              }
              return s;
            }),
          };
        }
        return c;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate payload
    if (!sessionData.adYear || !sessionData.ahYear || !sessionData.admissionOpenDate || !sessionData.singleFeeDate || !sessionData.doubleFeeDate || !sessionData.tripleFeeDate) {
      setError('Please fill all session details including fee deadlines.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      adYear: parseInt(sessionData.adYear),
      ahYear: sessionData.ahYear,
      type: sessionData.type,
      admissionOpenDate: sessionData.admissionOpenDate,
      singleFeeDate: sessionData.singleFeeDate,
      doubleFeeDate: sessionData.doubleFeeDate,
      tripleFeeDate: sessionData.tripleFeeDate,
      courses: courses.map(c => ({
        courseName: c.courseName,
        singleFee: parseFloat(c.singleFee) || 0,
        doubleFee: parseFloat(c.doubleFee) || 0,
        tripleFee: parseFloat(c.tripleFee) || 0,
        mandatoryCount: parseInt(c.mandatoryCount) || 0,
        subjects: c.subjects.map((s: any) => ({
          subjectName: s.subjectName,
          totalMarks: parseInt(s.totalMarks),
          isCompulsory: s.isCompulsory === true || s.isCompulsory === 'true',
        }))
      }))
    };

    try {
      const result = await createFullSessionAction(payload);
      if (result && result.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        // Success
        router.push('/backstage/sessions');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/backstage/sessions"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Complete Session</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Define session, courses, and subjects all at once.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save Session
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-medium text-sm border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      {/* SESSION DETAILS */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Session Details & Deadlines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Year in AD (e.g. 2026)</Label>
            <Input type="number" required value={sessionData.adYear} onChange={e => setSessionData({...sessionData, adYear: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Year in AH (e.g. 1448)</Label>
            <Input type="number" required value={sessionData.ahYear} onChange={e => setSessionData({...sessionData, ahYear: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Session Phase</Label>
            <select
              value={sessionData.type}
              onChange={e => setSessionData({...sessionData, type: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="regular">Regular</option>
              <option value="supply">Supplementary</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Admission Open Date</Label>
            <Input type="date" required value={sessionData.admissionOpenDate} onChange={e => setSessionData({...sessionData, admissionOpenDate: e.target.value})} />
          </div>
          
          <div className="space-y-2">
            <Label>Single Fee Deadline</Label>
            <Input type="date" required value={sessionData.singleFeeDate} onChange={e => setSessionData({...sessionData, singleFeeDate: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Double Fee Deadline</Label>
            <Input type="date" required value={sessionData.doubleFeeDate} onChange={e => setSessionData({...sessionData, doubleFeeDate: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Triple Fee Deadline</Label>
            <Input type="date" required value={sessionData.tripleFeeDate} onChange={e => setSessionData({...sessionData, tripleFeeDate: e.target.value})} />
          </div>
        </div>
      </div>

      {/* COURSES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Courses</h3>
          <Button type="button" onClick={handleAddCourse} variant="outline" className="gap-2 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900">
            <Plus className="size-4" /> Add Course
          </Button>
        </div>

        {courses.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400">
            No courses added yet. Click "Add Course" to begin.
          </div>
        )}

        {courses.map((course, index) => (
          <div key={course.uid} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Course #{index + 1}</h4>
              <button type="button" onClick={() => handleRemoveCourse(course.uid)} className="text-red-500 hover:text-red-700 transition-colors p-1">
                <Trash2 className="size-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2 lg:col-span-2">
                  <Label>Course Name</Label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Aalim"
                    required 
                    value={course.courseName} 
                    onChange={e => handleCourseChange(course.uid, 'courseName', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mandatory Selective Subjects Count</Label>
                  <Input 
                    type="number" 
                    min="0"
                    required 
                    value={course.mandatoryCount} 
                    onChange={e => handleCourseChange(course.uid, 'mandatoryCount', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Single Fee</Label>
                  <Input type="number" required value={course.singleFee} onChange={e => handleCourseChange(course.uid, 'singleFee', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Double Fee</Label>
                  <Input type="number" required value={course.doubleFee} onChange={e => handleCourseChange(course.uid, 'doubleFee', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Triple Fee</Label>
                  <Input type="number" required value={course.tripleFee} onChange={e => handleCourseChange(course.uid, 'tripleFee', e.target.value)} />
                </div>
              </div>

              {/* SUBJECTS WITHIN COURSE */}
              <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-slate-700 dark:text-slate-300">Subjects for this Course</h5>
                  <Button type="button" onClick={() => handleAddSubject(course.uid)} size="sm" variant="secondary" className="gap-1 h-8">
                    <Plus className="size-3" /> Add Subject
                  </Button>
                </div>
                
                {course.subjects.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">No subjects added for this course.</p>
                )}

                <div className="space-y-3">
                  {course.subjects.map((subject: any) => (
                    <div key={subject.uid} className="flex flex-col sm:flex-row items-end gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="w-full sm:flex-1 space-y-1">
                        <Label className="text-xs">Subject Name</Label>
                        <Input 
                          type="text" 
                          placeholder="e.g. Fiqh"
                          required 
                          value={subject.subjectName} 
                          onChange={e => handleSubjectChange(course.uid, subject.uid, 'subjectName', e.target.value)} 
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="w-full sm:w-24 space-y-1">
                        <Label className="text-xs">Total Marks</Label>
                        <Input type="number" required value={subject.totalMarks} onChange={e => handleSubjectChange(course.uid, subject.uid, 'totalMarks', e.target.value)} className="h-8" />
                      </div>
                      <div className="w-full sm:w-32 space-y-1">
                        <Label className="text-xs">Type</Label>
                        <select
                          value={subject.isCompulsory ? 'true' : 'false'}
                          onChange={e => handleSubjectChange(course.uid, subject.uid, 'isCompulsory', e.target.value === 'true')}
                          className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="true">Compulsory</option>
                          <option value="false">Selective</option>
                        </select>
                      </div>
                      <button type="button" onClick={() => handleRemoveSubject(course.uid, subject.uid)} className="h-8 px-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
