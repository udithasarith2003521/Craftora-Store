import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  const secretPath = process.env.ADMIN_SECRET_PATH || 'craftora-hq-7f3k9x';
  redirect(`/${secretPath}/dashboard`);
}
