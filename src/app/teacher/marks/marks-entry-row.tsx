'use client';

import { useState } from 'react';
import { saveMarksAction } from '@/features/academic/actions';
import { Button } from '@/components/ui/button';

export function MarksEntryRow({ application }: { application: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [marks, setMarks] = useState<Record<number, string>>(
    application.exam_application_subjects?.reduce((acc: any, sub: any) => {
      acc[sub.subject_id] = sub.marks_obtained?.toString() || '';
      return acc;
    }, {}) || {}
  );
  
  const handleSave = async () => {
    setIsSubmitting(true);
    
    const marksPayload = Object.keys(marks).map(subId => ({
      subjectId: parseInt(subId),
      marksObtained: parseInt(marks[parseInt(subId)]) || 0
    }));

    const res = await saveMarksAction({
      applicationId: application.id,
      marks: marksPayload
    });

    if (res.success) {
      alert('Marks saved successfully!');
    } else {
      alert(res.error || 'Failed to save marks');
    }
    
    setIsSubmitting(false);
  };

  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
      <td className="px-6 py-4 font-mono font-bold text-neutral-900 dark:text-white">
        {application.assigned_roll_no || 'N/A'}
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-neutral-900 dark:text-white">{application.institute_students?.full_name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-neutral-900 dark:text-white">{application.courses?.name}</div>
      </td>
      <td className="px-6 py-4 space-y-2">
        {application.exam_application_subjects?.map((sub: any) => (
          <div key={sub.id} className="flex items-center gap-2">
            <span className="text-xs w-24 truncate" title={sub.subjects?.name}>{sub.subjects?.name}:</span>
            <input 
              type="number" 
              className="w-16 px-2 py-1 text-xs border rounded dark:bg-neutral-900" 
              placeholder="0" 
              value={marks[sub.subject_id] || ''}
              onChange={e => setMarks({...marks, [sub.subject_id]: e.target.value})}
            />
            <span className="text-xs text-neutral-500">/ {sub.subjects?.total_marks}</span>
          </div>
        ))}
      </td>
      <td className="px-6 py-4 text-right">
        <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </td>
    </tr>
  );
}
