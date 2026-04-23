import '../globals.css';
import './admin-editor.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin',
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {children}
    </Providers>
  );
}
