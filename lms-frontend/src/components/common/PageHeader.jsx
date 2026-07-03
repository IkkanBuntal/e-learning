/**
 * PageHeader Component — Consistent page header for all roles
 *
 * Props:
 *  title    — judul halaman (required)
 *  subtitle — deskripsi singkat (optional)
 *  actions  — slot JSX untuk tombol / action di kanan (optional)
 */
const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
