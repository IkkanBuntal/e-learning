import { Search } from 'lucide-react';

/**
 * SearchFilterBar Component — Consistent search + filter + action bar
 *
 * Props:
 *  searchValue       — nilai search input
 *  onSearchChange    — handler input search
 *  searchPlaceholder — placeholder teks search
 *  filters           — array of { value, onChange, options: [{value, label}], placeholder }
 *  actions           — slot JSX untuk tombol di kanan (optional)
 */
const SearchFilterBar = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Cari...',
  filters = [],
  actions,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </div>

        {/* Filter Selects */}
        {filters.map((filter, i) => (
          <select
            key={i}
            value={filter.value}
            onChange={filter.onChange}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          >
            {filter.placeholder && (
              <option value="">{filter.placeholder}</option>
            )}
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {/* Action Slot */}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;
