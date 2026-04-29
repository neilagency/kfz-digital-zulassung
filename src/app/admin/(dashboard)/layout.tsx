import AdminSidebar from '@/components/admin/AdminSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-panel flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />
      <main className="flex-1 min-h-screen overflow-x-hidden admin-scrollbar">
        <div className="p-5 pb-28 sm:p-6 md:p-8 lg:p-10 xl:p-12 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
