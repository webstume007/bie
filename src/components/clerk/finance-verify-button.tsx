'use client';

import { useTransition } from 'react';
import { verifyPaymentAction } from '@/features/finance/actions';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

export function FinanceVerifyButton({ challanId, applicationId }: { challanId: string, applicationId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    if (!confirm('Are you sure you want to verify this payment? This action cannot be undone.')) return;
    
    startTransition(async () => {
      await verifyPaymentAction(challanId, applicationId);
    });
  };

  return (
    <Button 
      onClick={handleVerify}
      disabled={isPending}
      className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
      size="sm"
    >
      {isPending ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <CheckCircle2 className="size-4 mr-1.5" />}
      Verify Payment
    </Button>
  );
}
