
import AuthButton from '@/components/AuthButton'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Header() {
  const cookieStore = await cookies()

  const canInitSupabaseClient = async () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      await createClient(cookieStore)
      return true
    } catch (e) {
      return false
    }
  }

  const isSupabaseConnected = await canInitSupabaseClient()

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <div />
        <div>
          {isSupabaseConnected && <AuthButton />}
        </div>
      </div>
    </nav>
  )
}
