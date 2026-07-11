import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define the shape of a 1LINK webhook payload (simplified)
interface OneLinkPayload {
  authId: string;
  authPass: string;
  psid: string;
  amount: number;
  paymentDate: string;
  bankCode: string;
}

export async function POST(req: Request) {
  try {
    const payload: OneLinkPayload = await req.json();

    // 1. Basic Auth / Signature Validation
    // In production, validate these against environment variables provided by 1LINK
    const validAuthId = process.env.ONELINK_AUTH_ID;
    const validAuthPass = process.env.ONELINK_AUTH_PASS;

    if (!validAuthId || !validAuthPass) {
      console.error('1LINK configuration missing');
      return NextResponse.json({ responseCode: '99', message: 'System Error' }, { status: 500 });
    }

    if (payload.authId !== validAuthId || payload.authPass !== validAuthPass) {
      return NextResponse.json({ responseCode: '03', message: 'Invalid Merchant' }, { status: 401 });
    }

    if (!payload.psid || !payload.amount) {
      return NextResponse.json({ responseCode: '14', message: 'Invalid Account Number' }, { status: 400 });
    }

    // 2. Initialize Supabase Admin Client
    // We need service role to update the database securely bypassing RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ responseCode: '99', message: 'Database Configuration Error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 3. Find the Challan
    const { data: challan, error: fetchError } = await supabaseAdmin
      .from('challans')
      .select('id, amount, status')
      .eq('psid', payload.psid)
      .single();

    if (fetchError || !challan) {
      return NextResponse.json({ responseCode: '14', message: 'Invalid Account Number (PSID not found)' }, { status: 404 });
    }

    // 4. Validate Amount
    if (Number(challan.amount) !== Number(payload.amount)) {
      return NextResponse.json({ responseCode: '13', message: 'Invalid Amount' }, { status: 400 });
    }

    // 5. Check if already paid
    if (challan.status === 'PAID') {
      return NextResponse.json({ responseCode: '00', message: 'Already Paid' }, { status: 200 });
    }

    // 6. Update Challan Status
    const { error: updateError } = await supabaseAdmin
      .from('challans')
      .update({ status: 'PAID' })
      .eq('id', challan.id);

    if (updateError) {
      return NextResponse.json({ responseCode: '96', message: 'System Error (Update failed)' }, { status: 500 });
    }

    // 7. Success Response (1LINK format)
    return NextResponse.json({ responseCode: '00', message: 'Approved' }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ responseCode: '96', message: 'System Error' }, { status: 500 });
  }
}
