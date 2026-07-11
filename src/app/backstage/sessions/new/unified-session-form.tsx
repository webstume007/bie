'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createFullSessionAction, updateFullSessionAction } from '@/features/academic/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowLeft, Loader2, Save, CheckCircle2, ChevronRight, Edit2 } from 'lucide-react';
import Link from 'next/link';

interface UnifiedSessionFormProps {
  initialData?: any;
  mode?: 'create' | 'edit' | 'clone';
  editingId?: string;
}

export default function UnifiedSessionForm({ initialData, mode = 'create', editingId }: UnifiedSessionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

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

  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (initialData) {
      setSessionData({
        adYear: initialData.ad_year?.toString() || '',
        ahYear: initialData.ah_year || '',
        type: initialData.type || 'regular',
        admissionOpenDate: initialData.admission_open_date || '',
        singleFeeDate: initialData.single_fee_date || '',
        doubleFeeDate: initialData.double_fee_date || '',
        tripleFeeDate: initialData.triple_fee_date || '',
      });

      if (initialData.courses) {
        const mappedCourses = initialData.courses.map((c: any) => ({
          uid: Date.now().toString() + Math.random().toString(),
          originalId: mode === 'edit' ? c.id : undefined, // Keep IDs only if editing
          courseName: c.courseName,
          singleFee: c.singleFee?.toString() || '0',
          doubleFee: c.doubleFee?.toString() || '0',
          tripleFee: c.tripleFee?.toString() || '0',
          mandatoryCount: c.mandatoryCount?.toString() || '0',
          subjects: (c.subjects || []).map((s: any) => ({
            uid: Date.now().toString() + Math.random().toString(),
            originalId: mode === 'edit' ? s.id : undefined,
            subjectName: s.subjectName,
            totalMarks: s.totalMarks,
            isCompulsory: s.isCompulsory,
          })),
        }));
        setCourses(mappedCourses);
      }
    }
  }, [initialData, mode]);

  const handleAddCourse = () => {
    const newUid = Date.now().toString();
    setCourses([
      ...courses,
      {
        uid: newUid,
        courseName: '',
        singleFee: '',
        doubleFee: '',
        tripleFee: '',
        mandatoryCount: '0',
        subjects: [],
      },
    ]);
    setExpandedCourseId(newUid);
  };

  const handleRemoveCourse = (uid: string) => {
    setCourses(courses.filter((c) => c.uid !== uid));
    if (expandedCourseId === uid) setExpandedCourseId(null);
  };

  const handleCourseChange = (uid: string, field: string, value: any) => {
    setCourses(
      courses.map((c) => {
        if (c.uid === uid) return { ...c, [field]: value };
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
              if (s.uid === subjectUid) return { ...s, [field]: value };
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
    if (expandedCourseId) {
      setError("Please click 'Mark Done' on the currently open course before saving.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

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
        id: c.originalId,
        courseName: c.courseName,
        singleFee: parseFloat(c.singleFee) || 0,
        doubleFee: parseFloat(c.doubleFee) || 0,
        tripleFee: parseFloat(c.tripleFee) || 0,
        mandatoryCount: parseInt(c.mandatoryCount) || 0,
        subjects: c.subjects.map((s: any) => ({
          id: s.originalId,
          subjectName: s.subjectName,
          totalMarks: parseInt(s.totalMarks),
          isCompulsory: s.isCompulsory === true || s.isCompulsory === 'true',
        }))
      }))
    };

    try {
      let result;
      if (mode === 'edit' && editingId) {
        result = await updateFullSessionAction({ ...payload, id: editingId });
      } else {
        result = await createFullSessionAction(payload);
      }
      
      if (result && result.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {mode === 'edit' ? 'Edit Session' : mode === 'clone' ? 'Clone Session' : 'Create Session'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure session configuration and its courses.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting || expandedCourseId !== null} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {mode === 'edit' ? 'Update Session' : 'Save Session'}
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

      {/* COURSES STEP-BY-STEP */}
      <div className="space-y-6 pt-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Courses Setup</h3>
        
        {courses.length === 0 && (
          <div className="flex justify-center pt-8 pb-12">
            <button 
              onClick={handleAddCourse}
              className="flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:border-indigo-400 transition-all"
            >
              <Plus className="size-10" />
              <span className="text-lg font-semibold">Add Your First Course</span>
            </button>
          </div>
        )}

        <div className="space-y-4">
          {courses.map((course, index) => {
            const isExpanded = expandedCourseId === course.uid;
            
            if (!isExpanded) {
              return (
                <div key={course.uid} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-500" />
                      {course.courseName || `Course ${index + 1}`}
                    </h4>
                    <span className="text-sm text-slate-500 ml-7">{course.subjects.length} Subjects configured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setExpandedCourseId(course.uid)}>
                      <Edit2 className="size-4 mr-2" /> Edit
                    </Button>
                    <button type="button" onClick={() => handleRemoveCourse(course.uid)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={course.uid} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 overflow-hidden relative shadow-lg ring-4 ring-indigo-50 dark:ring-indigo-900/20">
                <div className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-lg">Configuring Course #{index + 1}</h4>
                  <button type="button" onClick={() => handleRemoveCourse(course.uid)} className="text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2 lg:col-span-2">
                      <Label className="text-slate-700 dark:text-slate-300 font-semibold">Course Name</Label>
                      <Input type="text" placeholder="e.g. Aalim" required value={course.courseName} onChange={e => handleCourseChange(course.uid, 'courseName', e.target.value)} className="bg-white dark:bg-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300 font-semibold">Mandatory Electives Count</Label>
                      <Input type="number" min="0" required value={course.mandatoryCount} onChange={e => handleCourseChange(course.uid, 'mandatoryCount', e.target.value)} className="bg-white dark:bg-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300 font-semibold">Single Fee (PKR)</Label>
                      <Input type="number" required value={course.singleFee} onChange={e => handleCourseChange(course.uid, 'singleFee', e.target.value)} className="bg-white dark:bg-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300 font-semibold">Double Fee (PKR)</Label>
                      <Input type="number" required value={course.doubleFee} onChange={e => handleCourseChange(course.uid, 'doubleFee', e.target.value)} className="bg-white dark:bg-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300 font-semibold">Triple Fee (PKR)</Label>
                      <Input type="number" required value={course.tripleFee} onChange={e => handleCourseChange(course.uid, 'tripleFee', e.target.value)} className="bg-white dark:bg-slate-900" />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Subjects</h5>
                      <Button type="button" onClick={() => handleAddSubject(course.uid)} size="sm" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300">
                        <Plus className="size-4 mr-1" /> Add Subject
                      </Button>
                    </div>
                    
                    {course.subjects.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        No subjects added yet. Add subjects to complete this course.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {course.subjects.map((subject: any) => (
                          <div key={subject.uid} className="flex flex-col sm:flex-row items-end gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="w-full sm:flex-1 space-y-1.5">
                              <Label className="text-xs text-slate-500">Subject Name</Label>
                              <Input type="text" placeholder="e.g. Fiqh" required value={subject.subjectName} onChange={e => handleSubjectChange(course.uid, subject.uid, 'subjectName', e.target.value)} />
                            </div>
                            <div className="w-full sm:w-24 space-y-1.5">
                              <Label className="text-xs text-slate-500">Total Marks</Label>
                              <Input type="number" required value={subject.totalMarks} onChange={e => handleSubjectChange(course.uid, subject.uid, 'totalMarks', e.target.value)} />
                            </div>
                            <div className="w-full sm:w-32 space-y-1.5">
                              <Label className="text-xs text-slate-500">Type</Label>
                              <select
                                value={subject.isCompulsory ? 'true' : 'false'}
                                onChange={e => handleSubjectChange(course.uid, subject.uid, 'isCompulsory', e.target.value === 'true')}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="true">Compulsory</option>
                                <option value="false">Selective</option>
                              </select>
                            </div>
                            <button type="button" onClick={() => handleRemoveSubject(course.uid, subject.uid)} className="h-10 px-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => setExpandedCourseId(null)}
                      className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md font-bold px-8"
                    >
                      <CheckCircle2 className="size-4 mr-2" />
                      Mark Course Done
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {courses.length > 0 && expandedCourseId === null && (
          <div className="flex justify-center pt-6">
            <button 
              onClick={handleAddCourse}
              className="flex items-center gap-2 px-8 py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all font-semibold"
            >
              <Plus className="size-5" />
              Add Another Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
