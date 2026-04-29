import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  const { data: { session } } = await supabase.auth.getSession()

  const isProtected = req.nextUrl.pathname.startsWith('/dashboard') ||
                      req.nextUrl.pathname.startsWith('/admin')

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session?.user?.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
