import { NextRequest, NextResponse } from 'next/server';
import { PROMO_CODES, validatePromoCode } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();
    
    if (!code) {
      return NextResponse.json({ valid: false, message: 'Promo code is required' }, { status: 400 });
    }

    const result = validatePromoCode(code, subtotal || 0);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to validate promo code' }, { status: 500 });
  }
}

export async function GET() {
  // Return hint codes (in real app you wouldn't expose these)
  return NextResponse.json({ 
    hint: 'Try: SAVE10, FLAT20, WELCOME15, SUMMER30, NEWUSER50',
    codes: PROMO_CODES.map(p => p.code)
  });
}
