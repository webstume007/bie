'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, Trash2, Lock, Unlock, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateSessionStatusAction, lockSessionAction, deleteSessionAction } from '@/features/academic/actions';

export default function SessionListActions({ session, userEmail }: { session: any, userEmail: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [password, setPassword] = useState('');
  const [lockError, setLockError] = useState<string | null>(null);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdatingStatus(true);
    await updateSessionStatusAction(session.id.toString(), e.target.value);
    setIsUpdatingStatus(false);
  };

  const handleLock = async () => {
    setLockError(null);
    setIsLocking(true);
    const res = await lockSessionAction(session.id.toString(), userEmail, password);
    setIsLocking(false);
    
    if (res.error) {
      setLockError(res.error);
    } else {
      setShowLockModal(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    setIsDeleting(true);
    await deleteSessionAction(session.id.toString());
  };

  return (
    <div className="flex items-center justify-end gap-3">
      {isUpdatingStatus ? (
        <Loader2 className="size-4 animate-spin text-slate-400" />
      ) : (
        <select 
          value={session.status}
          onChange={handleStatusChange}
          disabled={session.is_locked}
          className="text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1"
        >
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      )}

      {session.is_locked ? (
        <span className="inline-flex items-center text-xs font-medium text-slate-500 gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          <Lock className="size-3" /> Locked
        </span>
      ) : (
        <>
          <Link href={`/backstage/sessions/editor?clone=${session.id}`} className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium text-sm flex items-center gap-1">
            <Plus className="size-4" /> Clone
          </Link>

          <Link href={`/backstage/sessions/editor?edit=${session.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-1">
            <Settings className="size-4" /> Manage
          </Link>
          
          <button onClick={() => setShowLockModal(true)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 font-medium text-sm flex items-center gap-1">
            <Lock className="size-4" /> Lock
          </button>

          <button onClick={handleDelete} disabled={isDeleting} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm flex items-center gap-1">
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Delete
          </button>
        </>
      )}

      {showLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lock Session</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Locking this session will permanently prevent modifications or deletion. Enter your admin password to confirm.
            </p>
            
            {lockError && <p className="text-sm text-red-500 mb-3 bg-red-50 p-2 rounded">{lockError}</p>}
            
            <input 
              type="password" 
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            />
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowLockModal(false)}>Cancel</Button>
              <Button onClick={handleLock} disabled={isLocking || !password} className="bg-orange-600 hover:bg-orange-700 text-white">
                {isLocking ? <Loader2 className="size-4 animate-spin mr-2" /> : <Lock className="size-4 mr-2" />}
                Confirm Lock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
