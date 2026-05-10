export default function TestPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Test Section</h1>
      <div className="card">
        <p className="text-lg font-semibold">Coming Soon</p>
        <p className="text-sm text-slate-500">Data model is ready: Question/Test schemas and admin upload stub endpoint.</p>
      </div>
      <div className="card text-sm">
        Admin upload stub: `/api/admin/questions/upload` supports JSON/CSV scaffold.
      </div>
    </div>
  );
}
