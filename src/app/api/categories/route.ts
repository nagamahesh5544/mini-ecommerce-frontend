import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://dummyjson.com/products/categories', {
      next: { revalidate: 86400 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
