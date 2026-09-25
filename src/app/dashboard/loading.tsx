export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl" aria-busy="true" aria-label="Loading dashboard">
      <div className="skel mb-2 h-8 w-72" />
      <div className="skel mb-8 h-4 w-96 max-w-full" />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="skel h-48 rounded-[10px]" />
          <div className="skel h-40 rounded-[10px]" />
        </div>
        <div className="space-y-6">
          <div className="skel h-36 rounded-[10px]" />
          <div className="skel h-44 rounded-[10px]" />
        </div>
      </div>
    </div>
  );
}
