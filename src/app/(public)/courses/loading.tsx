export default function CoursesLoading() {
  return (
    <div className="wrap py-12" aria-busy="true" aria-label="Loading courses">
      <div className="skel mb-3 h-8 w-64" />
      <div className="skel mb-8 h-4 w-96 max-w-full" />
      <div className="mb-8 flex gap-2">
        {[80, 110, 96, 88].map((w, i) => <div key={i} className="skel h-8 rounded-full" style={{ width: w }} />)}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skel aspect-[16/9] rounded-none" />
            <div className="space-y-3 p-5">
              <div className="skel h-3 w-24" />
              <div className="skel h-5 w-3/4" />
              <div className="skel h-3 w-full" />
              <div className="skel h-3 w-2/3" />
              <div className="skel h-6 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
