import { FileSearch } from 'lucide-react';

/**
 * EmptyState Component — Consistent empty/no-data state
 *
 * Props:
 *  icon        — Lucide icon component (default: FileSearch)
 *  title       — judul empty state
 *  description — teks deskripsi (optional)
 *  action      — slot JSX untuk tombol aksi (optional)
 */
const EmptyState = ({
  icon: Icon = FileSearch,
  title = 'Tidak ada data',
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
