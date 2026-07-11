import UnifiedSessionForm from '../new/unified-session-form';
import { fetchFullSessionAction } from '@/features/academic/actions';

export const revalidate = 0;

export default async function SessionEditorPage({ searchParams }: { searchParams: Promise<{ edit?: string; clone?: string }> }) {
  const params = await searchParams;
  const editId = params.edit;
  const cloneId = params.clone;
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
