'use client';

import { useTransition, useState, useActionState, useEffect } from 'react';
import { generateChallanAction, uploadReceiptAction } from '@/features/finance/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Receipt, Upload, Download, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ChallanSection({ application, challan }: { application: any, challan: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleGenerate = () => {
    startTransition(async () => {
      await generateChallanAction(application.id);
      router.refresh();
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!challan) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
          <Receipt className="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No Challan Generated</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
          Generate your fee challan to see the total amount due based on current board deadlines.
        </p>
        <Button 
          onClick={handleGenerate} 
          disabled={isPending || application.status !== 'SUBMITTED'}
          className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Receipt className="size-4 mr-2" />}
          Generate Fee Challan
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Challan Details */}
      <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Receipt className="size-4" />
            Bank Challan
          </h4>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            challan.status === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
            challan.status === 'VERIFICATION_PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
            'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
          }`}>
            {challan.status.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">PSID (1LINK)</div>
            <div className="text-xl font-mono font-medium text-neutral-900 dark:text-white tracking-widest">{challan.psid}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Amount Due</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">Rs. {challan.amount.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="w-full border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <Download className="size-4 mr-2" />
            Download PDF
          </Button>
        </div>
        
        {/* Print-only section (Hidden on screen, visible on print) */}
        <div className="hidden print:block fixed inset-0 bg-white p-8 z-50 text-black">
          <h1 className="text-3xl font-bold text-center mb-8">Board of Islamic Education - Fee Challan</h1>
          
          <div className="flex flex-col gap-8">
            {['Bank Copy', 'Board Copy', 'Student Copy'].map((copyType) => (
              <div key={copyType} className="border-2 border-black p-6 rounded-lg">
                <div className="flex justify-between border-b-2 border-black pb-4 mb-4">
                  <h2 className="text-xl font-bold">{copyType}</h2>
                  <div className="text-right">
                    <p className="font-bold">PSID: {challan.psid}</p>
                    <p>Date: {new Date(challan.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <p className="text-sm text-gray-600">Tracking ID</p>
                    <p className="font-semibold">{application.tracking_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Session</p>
                    <p className="font-semibold">{application.sessions.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Program</p>
                    <p className="font-semibold">{application.degrees.name}</p>
                  </div>
                </div>
                
                <div className="border-t-2 border-black pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Total Payable Amount:</span>
                  <span className="text-2xl font-bold">Rs. {challan.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="flex-1 p-6 bg-neutral-50 dark:bg-neutral-900/50">
        <UploadReceiptForm challan={challan} applicationId={application.id} />
      </div>
    </div>
  );
}

function UploadReceiptForm({ challan, applicationId }: { challan: any, applicationId: string }) {
  const [state, formAction, isPending] = useActionState(uploadReceiptAction, { error: '', success: false } as any);

  if (challan.status === 'PAID') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <CheckCircle className="size-12 text-green-500 mb-3" />
        <h4 className="text-lg font-medium text-neutral-900 dark:text-white">Payment Verified</h4>
        <p className="text-sm text-neutral-500 mt-1">Your fee payment has been confirmed by the board.</p>
      </div>
    );
  }

  if (challan.status === 'VERIFICATION_PENDING') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <Clock className="size-12 text-amber-500 mb-3" />
        <h4 className="text-lg font-medium text-neutral-900 dark:text-white">Verification in Progress</h4>
        <p className="text-sm text-neutral-500 mt-1">Your receipt is being reviewed by the finance department. Please check back later.</p>
        {challan.receipt_url && (
          <a href={challan.receipt_url} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 underline">
            View Uploaded Receipt
          </a>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <h4 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
        <Upload className="size-4" />
        Submit Paid Receipt
      </h4>
      
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        If you paid manually at a bank branch, please upload a clear photo of the stamped bank receipt.
      </p>

      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-medium">
          {state.error}
        </div>
      )}

      <input type="hidden" name="challanId" value={challan.id} />
      <input type="hidden" name="applicationId" value={applicationId} />

      <div className="space-y-2">
        <Label htmlFor="receipt">Receipt Image (Max 500KB)</Label>
        <Input 
          id="receipt" 
          name="receipt" 
          type="file" 
          accept="image/jpeg, image/png, image/webp" 
          required 
          className="cursor-pointer file:text-zinc-900 dark:file:text-zinc-100"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Upload className="size-4 mr-2" />}
        Upload for Verification
      </Button>
    </form>
  );
}
