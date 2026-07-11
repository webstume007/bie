import UnifiedSessionForm from '../new/unified-session-form';
import { fetchFullSessionAction } from '@/features/academic/actions';

export const revalidate = 0;

export default async function SessionEditorPage({ searchParams }: { searchParams: { edit?: string; clone?: string } }) {
  const editId = searchParams.edit;
  const cloneId = searchParams.clone;
  const sessionId = editId || cloneId;
  
  let initialData = null;
  
  if (sessionId) {
    const res = await fetchFullSessionAction(sessionId);
    if (res.success && res.data) {
      initialData = res.data;
    }
  }

  return (
    <div className="py-6">
      <UnifiedSessionForm 
        initialData={initialData} 
        mode={editId ? 'edit' : cloneId ? 'clone' : 'create'} 
        editingId={editId}
      />
    </div>
  );
}
