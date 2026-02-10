import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch the product to get its category
    const productRes = await fetch(`https://dummyjson.com/products/${params.id}`, {
      next: { revalidate: 3600 },
    });
    const product = await productRes.json();
    
    // Fetch products in same category
    const relatedRes = await fetch(
      `https://dummyjson.com/products/category/${product.category}?limit=8`,
      { next: { revalidate: 3600 } }
    );
    const relatedData = await relatedRes.json();
    
    // Filter out the current product
    const related = relatedData.products.filter((p: { id: number }) => p.id !== parseInt(params.id));
    
    return NextResponse.json({ products: related.slice(0, 6) });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch related products' }, { status: 500 });
  }
}
