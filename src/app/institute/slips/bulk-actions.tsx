'use client';

import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useState } from 'react';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

export default function BulkSlipActions({ count }: { count: number }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      
      // We will select all slips on the page by a class.
      // Assuming each slip has a class 'roll-no-slip-container'
      const slipElements = document.querySelectorAll('.roll-no-slip-container');
      
      if (slipElements.length === 0) {
        alert('No slips found to generate.');
        setDownloading(false);
        return;
      }

      for (let i = 0; i < slipElements.length; i++) {
        const el = slipElements[i] as HTMLElement;
        const canvas = await html2canvas(el, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        
        // Find student name or roll no to name the file
        const rollNoEl = el.querySelector('.slip-roll-no');
        const rollNo = rollNoEl ? rollNoEl.textContent : `Slip_${i+1}`;
        
        const pdfBlob = pdf.output('blob');
        zip.file(`${rollNo}.pdf`, pdfBlob);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RollNoSlips.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error generating ZIP:', err);
      alert('Failed to generate ZIP.');
    }
    setDownloading(false);
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
