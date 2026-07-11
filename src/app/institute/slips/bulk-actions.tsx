'use client';

import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useState } from 'react';

export default function BulkSlipActions({ count }: { count: number }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadZip = () => {
    setDownloading(true);
    // Placeholder for ZIP generation logic
    setTimeout(() => {
      alert('ZIP generation service is currently being provisioned. Please try again later.');
      setDownloading(false);
    }, 1500);
  };

  return (
    <div className="flex gap-4 justify-end">
      <Button 
        variant="outline" 
        onClick={handleDownloadZip}
        disabled={downloading}
      >
        <Download className="size-4 mr-2" />
        {downloading ? 'Generating ZIP...' : `Download ZIP (${count})`}
      </Button>
      <Button 
        onClick={() => window.print()}
        className="bg-indigo-600 text-neutral-950 hover:bg-indigo-700 font-bold"
      >
        <Printer className="size-4 mr-2" />
        Print All ({count})
      </Button>
    </div>
  );
}
