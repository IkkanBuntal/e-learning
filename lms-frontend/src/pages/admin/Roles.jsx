import { useState } from 'react';
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
  XCircle
} from 'lucide-react';

const Roles = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full access ke semua fitur sistem',
      userCount: 5,
      permissions: ['users.create', 'users.read', 'users.update', 'users.delete', 'settings.manage', 'reports.view']
    },
    {
      id: 2,
      name: 'guru',
      displayName: 'Guru',
      description: 'Akses untuk mengelola materi, tugas, dan nilai',
      userCount: 45,
      permissions: ['materi.create', 'materi.read', 'tugas.create', 'tugas.read', 'nilai.update', 'absensi.update']
    },
    {
      id: 3,
      name: 'siswa',
      displayName: 'Siswa',
      description: 'Akses untuk melihat materi dan mengerjakan tugas',
      userCount: 1189,
      permissions: ['materi.read', 'tugas.read', 'tugas.submit', 'nilai.read', 'absensi.read']
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    permissions: []
  });

  // Available permissions
  const availablePermissions = [
    { category: 'Users', items: ['users.create', 'users.read', 'users.update', 'users.delete'] },
    { category: 'Materi', items: ['materi.create', 'materi.read', 'materi.update', 'materi.delete'] },
    { category: 'Tugas', items: ['tugas.create', 'tugas.read', 'tugas.update', 'tugas.delete', 'tugas.submit'] },
    { category: 'Nilai', items: ['nilai.create', 'nilai.read', 'nilai.update', 'nilai.delete'] },
    { category: 'Absensi', items: ['absensi.create', 'absensi.read', 'absensi.update', 'absensi.delete'] },
    { category: 'Laporan', items: ['reports.view', 'reports.export'] },
    { category: 'Pengaturan', items: ['settings.manage'] },
  ];

  const handleAdd = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      displayName: '',
      description: '',
      permissions: []
    });
    setIsModalOpen(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      permissions: role.permissions
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus role ini?')) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedRole) {
      // Update existing role
      setRoles(roles.map(r => 
        r.id === selectedRole.id 
          ? { ...r, ...formData }
          : r
      ));
    } else {
      // Add new role
      const newRole = {
        id: roles.length + 1,
        ...formData,
        userCount: 0
      };
      setRoles([...roles, newRole]);
    }
    
    setIsModalOpen(false);
  };

  const togglePermission = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role & Permission"
        subtitle="Kelola role pengguna dan hak akses sistem"
        actions={
          <Button variant="primary" icon={Plus} onClick={handleAdd}>
            Tambah Role
          </Button>
        }
      />

      {/* Roles Grid */}
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
                {role.permissions.slice(0, 3).map((permission, index) => (
                  <Badge key={index} variant="info" size="sm">
                    {permission.split('.')[0]}
                  </Badge>
                ))}
                {role.permissions.length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{role.permissions.length - 3} more
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
              placeholder="contoh: admin, guru, siswa"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Lowercase, tanpa spasi</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="contoh: Administrator"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Deskripsi role..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-4">
              {availablePermissions.map((category, catIndex) => (
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
            <Button type="submit" variant="primary">
              {selectedRole ? 'Update' : 'Simpan'}
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
              {availablePermissions.map((category) => (
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
                        {role.permissions.includes(permission) ? (
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
