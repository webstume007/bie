import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function InstituteProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, cnic, contact_number')
    .eq('id', user.id)
    .single();

  const { data: institute } = await supabase
    .from('institutes')
    .select('name, affiliation_no, address')
    .eq('head_user_id', user.id)
    .single();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Institute Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your institute's information.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Institutional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Institute Name</Label>
                <div className="h-10 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 dark:text-slate-400 flex items-center text-sm cursor-not-allowed">
                  {institute?.name}
                </div>
                <p className="text-xs text-slate-400">Contact admin to change this.</p>
              </div>
              <div className="space-y-2">
                <Label>Affiliation Number</Label>
                <div className="h-10 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 dark:text-slate-400 flex items-center text-sm cursor-not-allowed">
                  {institute?.affiliation_no || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Head / Principal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="h-10 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 dark:text-slate-400 flex items-center text-sm cursor-not-allowed">
                  {profile?.full_name}
                </div>
              </div>
              <div className="space-y-2">
                <Label>CNIC Number</Label>
                <div className="h-10 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 dark:text-slate-400 flex items-center text-sm cursor-not-allowed">
                  {profile?.cnic}
                </div>
              </div>
            </div>
          </div>

          {/* This would ideally be wrapped in a <form> mapped to a Server Action to update */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact_number">Primary Contact Number</Label>
                <Input id="contact_number" name="contact_number" defaultValue={profile?.contact_number || ''} className="h-10 max-w-md" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Postal Address</Label>
                <Input id="address" name="address" defaultValue={institute?.address || ''} className="h-10" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-neutral-950">
              Save Changes
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
