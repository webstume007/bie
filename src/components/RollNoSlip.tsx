'use client';

import { format } from 'date-fns';

type RollNoSlipProps = {
  application: any;
};

export function RollNoSlip({ application }: RollNoSlipProps) {
  const isPrivate = application.is_private;
  const student = isPrivate ? application.students : application.institute_students;
  const instituteName = isPrivate ? 'Private Candidate' : application.institutes?.name;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white text-black p-8 border-2 border-neutral-800 shadow-lg font-urdu print:shadow-none print:border-none">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-neutral-800 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <img src="/logo.webp" alt="Board Logo" className="w-20 h-20 object-contain" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Board of Islamic Education</h1>
            <p className="text-lg font-medium mt-1">Roll Number Slip</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-600">Session</p>
          <p className="text-lg font-bold">{application.sessions?.name} {application.sessions?.year}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        
        {/* Photo Placeholder */}
        <div className="w-32 h-40 border-2 border-neutral-300 flex items-center justify-center bg-neutral-50 shrink-0">
          {student?.profile_image_url || student?.profile_picture_url ? (
            <img 
              src={student.profile_image_url || student.profile_picture_url} 
              alt="Student" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-neutral-400 text-center px-2">Photo<br/>Placeholder</span>
          )}
        </div>

        {/* Details Grid */}
        <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Roll Number</p>
            <p className="text-xl font-bold font-mono tracking-widest">{application.assigned_roll_no}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Tracking ID</p>
            <p className="text-base font-medium font-mono">{application.tracking_id}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500 mb-1">Student Name</p>
            <p className="text-lg font-bold">{student?.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Father's Name</p>
            <p className="text-lg font-bold">{student?.father_name}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500 mb-1">Degree Program</p>
            <p className="text-base font-bold">{application.degrees?.name}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Candidate Type</p>
            <p className="text-base font-bold">{instituteName}</p>
          </div>

          <div className="col-span-2 mt-2">
            <p className="text-sm text-neutral-500 mb-1">Examination Center</p>
            <p className="text-base font-bold uppercase">{application.exam_centers?.name || 'Center Pending'}</p>
            <p className="text-sm text-neutral-600">{application.exam_centers?.location}</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 border-t-2 border-neutral-800 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Important Instructions</h3>
        <ul className="text-sm space-y-2 list-disc list-inside text-neutral-700">
          <li>Please bring this slip along with your original CNIC/B-Form to the examination center.</li>
          <li>Electronic devices including mobile phones are strictly prohibited in the examination hall.</li>
          <li>Candidates must arrive at least 30 minutes before the paper starts.</li>
          <li>This is a computer-generated slip and requires no physical signature.</li>
        </ul>
      </div>

      {/* Print Trigger */}
      <div className="mt-8 text-center print:hidden">
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          Print Slip
        </button>
      </div>
    </div>
  );
}
