import { createClient } from '@/lib/supabase/server'
import { getProfileByUserId } from '@/lib/queries/profiles'
import ProfileForm from '@/components/dashboard/ProfileForm'

export const metadata = {
  title: 'My Profile — DOGSTUD Dashboard',
}

export default async function DashboardProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const profile = await getProfileByUserId(user.id).catch(() => null)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          This information is shown on your public breeder profile.
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {profile ? (
          <ProfileForm profile={profile} />
        ) : (
          <p className="text-sm text-gray-500">
            Profile not found. Please sign out and sign back in.
          </p>
        )}
      </div>
    </div>
  )
}
