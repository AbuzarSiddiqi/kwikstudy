export default function CourseLoading() {
  return (
    <div className="wrap py-12" aria-busy="true" aria-label="Loading course">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="skel mb-4 h-3 w-48" />
          <div className="skel mb-3 h-9 w-80 max-w-full" />
          <div className="skel mb-6 h-4 w-full max-w-xl" />
          <div className="flex gap-3">
            <div className="skel h-6 w-24 rounded-full" />
            <div className="skel h-6 w-20 rounded-full" />
            <div className="skel h-6 w-28 rounded-full" />
          </div>
        </div>
        <div className="skel aspect-[16/9] rounded-[10px]" />
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_21rem]">
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skel h-16 w-full rounded-[10px]" />)}
        </div>
        <div className="skel h-80 rounded-[10px]" />
      </div>
    </div>
  );
}
