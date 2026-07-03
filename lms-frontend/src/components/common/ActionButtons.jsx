import { Edit, Trash2 } from 'lucide-react';

/**
 * ActionButtons Component
 * Consistent icon-only action buttons for Edit and Delete
 * Clean, minimal design without colorful backgrounds
 * 
 * @param {function} onEdit - Edit handler
 * @param {function} onDelete - Delete handler
 * @param {boolean} showEdit - Show edit button (default: true)
 * @param {boolean} showDelete - Show delete button (default: true)
 */
const ActionButtons = ({ 
  onEdit, 
  onDelete, 
  showEdit = true, 
  showDelete = true 
}) => {
  return (
    <div className="flex items-center gap-2">
      {showEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
      )}
      {showDelete && (
        <button
          onClick={onDelete}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
