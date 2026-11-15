import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  const secretPath = process.env.ADMIN_SECRET_PATH || 'craftora-hq-7f3k9x';

  return <ProductForm mode="create" secretPath={secretPath} />;
}
