import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { categorySchema } from '@/lib/validations';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const list = await db.select().from(categories).orderBy(asc(categories.name));
    return NextResponse.json(list);
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.slug && body.name) {
      body.slug = slugify(body.name);
    }

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid category input' }, { status: 400 });
    }

    const { name, slug } = parsed.data;

    // Check slug uniqueness
    const existing = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 409 });
    }

    const created = await db
      .insert(categories)
      .values({ name, slug })
      .returning();

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
