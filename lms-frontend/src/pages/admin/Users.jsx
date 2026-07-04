import { useState, useEffect, useCallback } from 'react';
import { Plus, Users as UsersIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import UserForm from '../../components/forms/UserForm';
import ActionButtons from '../../components/common/ActionButtons';
import PageHeader from '../../components/common/PageHeader';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import EmptyState from '../../components/common/EmptyState';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0
  });

  const { success, error: showError } = useToast();
  
  /**
   * Fetch users
   */
  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoadingData(true);
      const params = {
        page: page,
        _t: Date.now() // Cache buster
      };
      
      // Only add role filter if not 'all'
      if (filterRole && filterRole !== 'all') {
        params.role = filterRole;
      }
      
      // Only add search if not empty
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      const result = await userService.getAll(params);
      
      console.log('🔄 Fetched users:', result);
      
      if (result.data) {
        // Handle paginated response (result.data.data) or direct array (result.data)
        const isLaravelPaginated = result.data.data && result.data.current_page;
        
        if (isLaravelPaginated) {
          // Laravel pagination response
          const usersArray = result.data.data;
          
          console.log('👥 Users array (paginated):', usersArray);
          console.log('📄 Pagination info:', {
            current_page: result.data.current_page,
            last_page: result.data.last_page,
            total: result.data.total
          });
          
          setUsers(usersArray.map(u => ({
            id: u.id,
            name: u.nama,
            email: u.email,
            role: u.role?.nama,
            nis: u.nis || null,
            nip: u.nip || null,
            kelas: u.kelas?.nama || null,
            kelas_id: u.kelas_id || null,
            status: u.aktif ? 'active' : 'inactive',
          })));
          
          // Update pagination state
          setPagination({
            current_page: result.data.current_page,
            last_page: result.data.last_page,
            per_page: result.data.per_page,
            total: result.data.total,
            from: result.data.from,
            to: result.data.to
          });
        } else {
          // Direct array (no pagination)
          const usersArray = Array.isArray(result.data) ? result.data : [];
          
          console.log('👥 Users array (not paginated):', usersArray);
          
          setUsers(usersArray.map(u => ({
            id: u.id,
            name: u.nama,
            email: u.email,
            role: u.role?.nama,
            nis: u.nis || null,
            nip: u.nip || null,
            kelas: u.kelas?.nama || null,
            kelas_id: u.kelas_id || null,
            status: u.aktif ? 'active' : 'inactive',
          })));
          
          // No pagination
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: usersArray.length,
            total: usersArray.length,
            from: 1,
            to: usersArray.length
          });
        }
        
        console.log('✅ Users state updated');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Gagal memuat data user');
    } finally {
      setLoadingData(false);
    }
  }, [filterRole, searchQuery, showError]);

  /**
   * Handle form submit
   */
  const handleFormSubmit = async (data) => {
    console.log('📝 Form submitted with data:', data);
    console.log('📝 Selected user:', selectedUser);
    
    const currentPage = pagination.current_page; // Simpan halaman saat ini
    
    try {
      setLoading(true);
      
      if (selectedUser) {
        // Update user
        console.log('🔄 Updating user ID:', selectedUser.id);
        const result = await userService.update(selectedUser.id, data);
        console.log('✅ Update result:', result);
        success('User berhasil diupdate!');
      } else {
        // Create user
        console.log('➕ Creating new user');
        const result = await userService.create(data);
        console.log('✅ Create result:', result);
        success('User berhasil dibuat!');
      }
      
      setIsModalOpen(false);
      setSelectedUser(null);
      
      // Refresh data - tetap di halaman saat ini
      await fetchUsers(currentPage);
      
    } catch (error) {
      console.error('❌ Form submit error:', error);
      showError(error.response?.data?.message || 'Gagal menyimpan user');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle add user
   */
  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  /**
   * Handle edit user
   */
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  /**
   * Handle delete user
   */
  const handleDelete = async (user) => {
    if (!confirm(`Yakin ingin menghapus user "${user.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await userService.delete(user.id);
      success('User berhasil dihapus!');
      
      // Stay on current page after delete
      fetchUsers(pagination.current_page);
    } catch (error) {
      console.error('Delete error:', error);
      showError(error.response?.data?.message || 'Gagal menghapus user');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get role badge variant
   */
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':  return 'purple';
      case 'guru':   return 'secondary';
      case 'siswa':  return 'success';
      default:       return 'default';
    }
  };

  /**
   * Filter users - NO CLIENT-SIDE FILTERING
   * Karena data sudah di-paginate di backend, 
   * filter harus dilakukan di backend via fetchUsers()
   */
  const filteredUsers = users; // No client-side filtering

  // Fetch users on mount and filter change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <PageHeader
        title="Kelola User"
        subtitle="Manage users, roles, dan permissions"
        actions={
          <Button variant="primary" onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Tambah User
          </Button>
        }
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchPlaceholder="Cari nama atau email..."
        filters={[
          {
            value: filterRole,
            onChange: (e) => setFilterRole(e.target.value),
            placeholder: 'Semua Role',
            options: [
              { value: 'admin',  label: 'Admin' },
              { value: 'guru',   label: 'Guru' },
              { value: 'siswa',  label: 'Siswa' },
            ],
          },
        ]}
      />

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loadingData ? (
          <div className="p-12 flex items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <EmptyState
                        icon={UsersIcon}
                        title="Tidak ada user"
                        description={searchQuery || filterRole !== 'all' ? 'Coba ubah filter pencarian' : 'Klik tombol "Tambah User" untuk menambah user baru'}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(pagination.current_page - 1) * pagination.per_page + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-primary-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.role === 'guru' && (
                          <div>
                            {user.nip && <div>NIP: {user.nip}</div>}
                            <span className="text-gray-500">Guru Pengajar</span>
                          </div>
                        )}
                        {user.role === 'siswa' && (
                          <div>
                            {user.nis && <div>NIS: {user.nis}</div>}
                            {user.kelas && (
                              <div className="text-xs text-gray-500">
                                {user.kelas}
                              </div>
                            )}
                          </div>
                        )}
                        {user.role === 'admin' && (
                          <span className="text-gray-500">Administrator</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                          {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ActionButtons
                          onEdit={() => handleEdit(user)}
                          onDelete={() => handleDelete(user)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {pagination.from || 0} - {pagination.to || 0} dari {pagination.total} user
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.current_page === 1}
                onClick={() => fetchUsers(pagination.current_page - 1)}
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={page === pagination.current_page ? "primary" : "outline"}
                    size="sm"
                    onClick={() => fetchUsers(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => fetchUsers(pagination.current_page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Tambah User'}
        size="lg"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default Users;
