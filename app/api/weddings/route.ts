import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: weddings, error } = await supabase
    .from('weddings')
    .select(`
      *,
      photos:photos(count),
      guest_sessions:guest_sessions(count)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = weddings?.map((w: any) => ({
    ...w,
    photos_count: w.photos?.[0]?.count || 0,
    guests_count: w.guest_sessions?.[0]?.count || 0,
  })) || [];

  return NextResponse.json({ data: formatted });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, date, venue, greeting_text, tasks, max_photos_per_guest } = body;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9а-я]+/gi, '-')
    .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

  const { data: wedding, error } = await supabase
    .from('weddings')
    .insert({
      owner_id: user.id,
      title,
      date,
      venue,
      greeting_text,
      tasks: tasks || [],
      max_photos_per_guest: max_photos_per_guest || 15,
      slug,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: wedding }, { status: 201 });
}
