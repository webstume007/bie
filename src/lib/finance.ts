export type FeeTier = 'NORMAL' | 'LATE' | 'DOUBLE' | 'TRIPLE' | 'CLOSED';

interface SessionDeadlines {
  normalFeeDeadline: string;
  lateFeeDeadline: string;
  doubleFeeDeadline: string;
}

export function determineFeeTier(deadlines: SessionDeadlines, currentDate: Date = new Date()): FeeTier {
  // Reset time part for accurate date comparison
  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);

  const normal = new Date(deadlines.normalFeeDeadline);
  normal.setHours(0, 0, 0, 0);
  
  const late = new Date(deadlines.lateFeeDeadline);
  late.setHours(0, 0, 0, 0);
  
  const double = new Date(deadlines.doubleFeeDeadline);
  double.setHours(0, 0, 0, 0);

  if (current <= normal) return 'NORMAL';
  if (current <= late) return 'LATE';
  if (current <= double) return 'DOUBLE';
  
  // Anything past double is either triple or closed depending on board policy.
  // For now we'll mark as closed/triple based on typical rules.
  return 'CLOSED';
}

export function calculateFeeAmount(tier: FeeTier, normalFee: number, lateFee: number, doubleFee: number): number {
  switch (tier) {
    case 'NORMAL':
      return normalFee;
    case 'LATE':
      return lateFee;
    case 'DOUBLE':
      return doubleFee;
    case 'TRIPLE':
      // Usually triple is derived from normal * 3
      return normalFee * 3;
    case 'CLOSED':
    default:
      return 0; // Handled as error upstream
  }
}

export function generatePSID(): string {
  // Simulates a 1LINK PSID (typically a 6 digit prefix followed by unique numbers)
  const prefix = '100155'; // Example Board Prefix
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}
