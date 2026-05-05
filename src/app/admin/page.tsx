import { redirect } from 'next/navigation'
import AdminPanel from '@/components/admin/AdminPanel'

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function AdminPage({ searchParams }: PageProps) {
  const { token } = await searchParams
  if (token !== 'ds-admin-2025') redirect('/')
  return <AdminPanel token="ds-admin-2025" />
}
