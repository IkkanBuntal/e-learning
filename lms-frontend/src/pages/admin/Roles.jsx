import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import { 
  Plus,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import roleService from '../../services/roleService';

const AVAILABLE_PERMISSIONS = [
  { category: 'Users',     items: ['users.create', 'users.read', 'users.update', 'users.delete'] },
  { category: 'Materi',    items: ['materi.create', 'materi.read', 'materi.update', 'materi.delete'] },
  { category: 'Tugas',     items: ['tugas.create', 'tugas.read', 'tugas.update', 'tugas.delete', 'tugas.submit'] },
  { category: 'Nilai',     items: ['nilai.create', 'nilai.read', 'nilai.update', 'nilai.delete'] },
  { category: 'Absensi',   items: ['absensi.create', 'absensi.read', 'absensi.update', 'absensi.delete'] },
  { category: 'Laporan',   items: ['reports.view', 'reports.export'] },
  { category: 'Pengaturan',items: ['settings.manage'] },
];

const EMPTY_FORM = { name: '', displayName: '', description: '', permissions: [] };

const Roles = () => {
  const [roles, setRoles]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData]         = useState(EMPTY_FORM);
  const [error, setError]               = useState(null);

  // ── Fetch roles from API ────────────────────────────────────────────────
  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await roleService.getAll();
      setRoles(res.data ?? []);
    } catch (err) {
      setError('Gagal memuat data role. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleAdd = () => {
    setSelectedRole(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setFormData({
      name:        role.name,
      displayName: role.displayName,
      description: role.description,
      permissions: role.permissions ?? [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus role ini?')) return;
    try {
      await roleService.delete(id);
      await fetchRoles();
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Gagal menghapus role.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        nama:        formData.name,
        deskripsi:   formData.description,
        permissions: formData.permissions,
      };
      if (selectedRole) {
        await roleService.update(selectedRole.id, payload);
      } else {
        await roleService.create(payload);
      }
      setIsModalOpen(false);
      await fetchRoles();
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Gagal menyimpan role.');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role & Permission"
        subtitle="Kelola role pengguna dan hak akses sistem"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchRoles}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Button variant="primary" icon={Plus} onClick={handleAdd}>
              Tambah Role
            </Button>
          </div>
        }
      />

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm text-red-700">{error}</p>
          <Button size="sm" variant="secondary" onClick={fetchRoles}>Coba Lagi</Button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  role.name === 'admin' ? 'bg-red-100' :
                  role.name === 'guru' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  <Shield className={`w-6 h-6 ${
                    role.name === 'admin' ? 'text-red-600' :
                    role.name === 'guru' ? 'text-blue-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.displayName}</h3>
                  <Badge variant="secondary" size="sm">{role.name}</Badge>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {role.description}
            </p>
            
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Jumlah User</span>
              <Badge variant="primary">{role.userCount}</Badge>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
              <div className="flex flex-wrap gap-2">
                {(role.permissions ?? []).slice(0, 3).map((permission, index) => (
                  <Badge key={index} variant="info" size="sm">
                    {permission.split('.')[0]}
                  </Badge>
                ))}
                {(role.permissions ?? []).length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{(role.permissions ?? []).length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                icon={Edit}
                onClick={() => handleEdit(role)}
                className="flex-1"
              >
                Edit
              </Button>
              {role.name !== 'admin' && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  icon={Trash2}
                  onClick={() => handleDelete(role.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? 'Edit Role' : 'Tambah Role'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name (identifier)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="contoh: wali_kelas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={!!selectedRole} // nama tidak bisa diubah saat edit
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {selectedRole ? 'Nama role tidak dapat diubah.' : 'Lowercase, tanpa spasi.'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Deskripsi role..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-4">
              {AVAILABLE_PERMISSIONS.map((category, catIndex) => (
                <div key={catIndex}>
                  <p className="text-sm font-semibold text-gray-900 mb-2">{category.category}</p>
                  <div className="space-y-2 ml-4">
                    {category.items.map((permission, permIndex) => (
                      <label key={permIndex} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving
                ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</span>
                : selectedRole ? 'Update' : 'Simpan'
              }
            </Button>
          </div>
        </form>
      </Modal>

      {/* Permission Matrix */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-semibold text-gray-900 pb-3 px-4">Permission</th>
                {roles.map((role) => (
                  <th key={role.id} className="text-center text-sm font-semibold text-gray-900 pb-3 px-4">
                    {role.displayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {AVAILABLE_PERMISSIONS.map((category) => (
                category.items.map((permission, index) => (
                  <tr key={permission} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {index === 0 && (
                        <span className="font-semibold text-primary">{category.category} - </span>
                      )}
                      {permission}
                    </td>
                    {roles.map((role) => (
                      <td key={role.id} className="py-3 px-4 text-center">
                        {(role.permissions ?? []).includes(permission) ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Roles;
