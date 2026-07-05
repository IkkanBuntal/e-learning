import { useState, useEffect, useCallback } from 'react';
import { Plus, Users, BookOpen } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ActionButtons from '../../components/common/ActionButtons';
import KelasForm from '../../components/forms/KelasForm';
import PageHeader from '../../components/common/PageHeader';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import EmptyState from '../../components/common/EmptyState';
import masterDataService from '../../services/masterDataService';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';

const Kelas = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('all');
  const [filterTingkat, setFilterTingkat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);
  
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

  // Fetch data
  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoadingData(true);
      
      // Prepare params for API call
      const params = {
        page: page,
        _t: Date.now() // Cache buster
      };
      
      // Only add filters if not 'all'
      if (filterJurusan && filterJurusan !== 'all') {
        params.jurusan_id = filterJurusan;
      }
      
      if (filterTingkat && filterTingkat !== 'all') {
        params.tingkat = filterTingkat;
      }
      
      // Only add search if not empty
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      const [kelasRes, jurusanRes, siswaRes] = await Promise.all([
        masterDataService.getAllKelas(params),
        masterDataService.getAllJurusan(),
        userService.getAll({ role: 'siswa' }),
      ]);

      // Handle pagination response from Laravel
      const isLaravelPaginated = kelasRes.data.data && kelasRes.data.current_page;
      const kelasData = isLaravelPaginated ? kelasRes.data.data : (Array.isArray(kelasRes.data) ? kelasRes.data : []);
      const allSiswa = Array.isArray(siswaRes.data) ? siswaRes.data : (siswaRes.data?.data || []);
      
      console.log('📊 Raw kelas data from API:', kelasData);
      
      const updatedKelasList = kelasData.map(k => ({
        id: k.id,
        nama: k.nama,
        jurusan: k.jurusan || { id: 0, kode: '-' },
        tingkat: k.tingkat ? k.tingkat.toString() : '10',
        wali_kelas: k.wali_kelas || null,
        wali_kelas_id: k.wali_kelas_id || null,
        jumlah_siswa: allSiswa.filter(s => s.kelas_id === k.id).length,
        kapasitas: k.kapasitas || 32,
        tahun_ajaran: k.tahun_ajaran || '2025/2026',
        is_active: k.is_active !== false,
      }));
      
      console.log('📊 Mapped kelas list:', updatedKelasList);
      
      setKelasList(updatedKelasList);
      setJurusanList((jurusanRes.data || []).map(j => ({ id: j.id, kode: j.kode })));
      
      // Update pagination state
      if (isLaravelPaginated) {
        setPagination({
          current_page: kelasRes.data.current_page,
          last_page: kelasRes.data.last_page,
          per_page: kelasRes.data.per_page,
          total: kelasRes.data.total,
          from: kelasRes.data.from,
          to: kelasRes.data.to
        });
      } else {
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: updatedKelasList.length,
          total: updatedKelasList.length,
          from: 1,
          to: updatedKelasList.length
        });
      }
      
      console.log('✅ Kelas data updated, total:', updatedKelasList.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Gagal memuat data kelas');
    } finally {
      setLoadingData(false);
    }
  }, [filterJurusan, filterTingkat, searchQuery, showError]);

  useEffect(() => {
    fetchData(1); // Always reset to page 1 when filters change
  }, [filterJurusan, filterTingkat, searchQuery]);

  /**
   * Handle form submit
   */
  const handleFormSubmit = async (data) => {
    console.log('📝 Form submitted with data:', data);
    
    const currentPage = pagination.current_page; // Simpan halaman saat ini
    
    try {
      setLoading(true);

      if (selectedKelas) {
        console.log('🔄 Updating kelas ID:', selectedKelas.id);
        await masterDataService.updateKelas(selectedKelas.id, data);
        success('Kelas berhasil diupdate!');
      } else {
        console.log('➕ Creating new kelas');
        await masterDataService.createKelas(data);
        success('Kelas berhasil dibuat!');
      }

      setIsModalOpen(false);
      setSelectedKelas(null);
      
      // Fetch data baru - tetap di halaman saat ini
      console.log('🔄 Refreshing data after update...');
      await fetchData(currentPage);
      console.log('✅ Data refreshed');
      
    } catch (error) {
      console.error('❌ Form submit error:', error);
      showError(error.response?.data?.message || 'Gagal menyimpan kelas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle add kelas
   */
  const handleAdd = () => {
    setSelectedKelas(null);
    setIsModalOpen(true);
  };

  /**
   * Handle edit kelas
   */
  const handleEdit = (kelas) => {
    setSelectedKelas({
      ...kelas,
      jurusan_id: kelas.jurusan.id,
      wali_kelas_id: kelas.wali_kelas_id || null,
    });
    setIsModalOpen(true);
  };

  /**
   * Handle delete kelas
   */
  const handleDelete = async (kelas) => {
    console.log('🗑️ Delete clicked for kelas:', kelas);
    console.log('🆔 Kelas ID:', kelas.id);
    console.log('🆔 ID type:', typeof kelas.id);
    
    if (!kelas.id) {
      console.error('❌ ERROR: Kelas ID is missing or undefined!');
      showError('ID kelas tidak valid');
      return;
    }
    
    if (!window.confirm(`Yakin ingin menghapus kelas "${kelas.nama}"?`)) {
      console.log('❌ Delete cancelled by user');
      return;
    }

    console.log('✅ Delete confirmed, deleting ID:', kelas.id);

    try {
      setLoading(true);
      await masterDataService.deleteKelas(kelas.id);
      console.log('✅ Delete successful from API');
      
      success('Kelas berhasil dihapus!');
      
      // Fetch data baru setelah delete - tetap di halaman saat ini
      console.log('🔄 Refreshing data after delete...');
      await fetchData(pagination.current_page);
      
    } catch (error) {
      console.error('❌ Delete error:', error);
      console.error('Error response:', error.response);
      showError(error.response?.data?.message || 'Gagal menghapus kelas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get jurusan badge variant
   */
  const getJurusanVariant = (kode) => {
    const map = { RPL: 'secondary', TKJ: 'success', MM: 'purple' };
    return map[kode] || 'default';
  };

  /**
   * Filter kelas - NO CLIENT-SIDE FILTERING
   * Karena data sudah di-paginate di backend, 
   * filter harus dilakukan di backend via fetchData()
   */
  const filteredKelas = kelasList; // No client-side filtering

  return (
    <div>
      <PageHeader
        title="Data Kelas"
        subtitle="Kelola data kelas dan wali kelas"
        actions={
          <Button variant="primary" onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Tambah Kelas
          </Button>
        }
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchPlaceholder="Cari nama kelas..."
        filters={[
          {
            value: filterJurusan,
            onChange: (e) => setFilterJurusan(e.target.value),
            placeholder: 'Semua Jurusan',
            options: jurusanList.map(j => ({ value: j.id, label: j.kode })),
          },
          {
            value: filterTingkat,
            onChange: (e) => setFilterTingkat(e.target.value),
            placeholder: 'Semua Tingkat',
            options: [
              { value: 'X', label: 'Kelas X' },
              { value: 'XI', label: 'Kelas XI' },
              { value: 'XII', label: 'Kelas XII' },
            ],
          },
        ]}
      />


      {/* Kelas Table */}
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
                  Nama Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurusan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tingkat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wali Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Siswa
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
              {filteredKelas.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <EmptyState
                      icon={BookOpen}
                      title="Tidak ada kelas"
                      description={searchQuery || filterJurusan !== 'all' || filterTingkat !== 'all' ? 'Coba ubah filter pencarian' : 'Klik tombol "Tambah Kelas" untuk menambah kelas baru'}
                    />
                  </td>
                </tr>
              ) : (
                filteredKelas.map((kelas, index) => (
                  <tr key={kelas.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(pagination.current_page - 1) * pagination.per_page + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        {kelas.nama}
                      </p>
                      <p className="text-xs text-gray-500">
                        {kelas.tahun_ajaran}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getJurusanVariant(kelas.jurusan.kode)}>
                        {kelas.jurusan.kode}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {kelas.tingkat === 'X' && 'X'}
                      {kelas.tingkat === 'XI' && 'XI'}
                      {kelas.tingkat === 'XII' && 'XII'}
                      {kelas.tingkat === '10' && 'X'}
                      {kelas.tingkat === '11' && 'XI'}
                      {kelas.tingkat === '12' && 'XII'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {kelas.wali_kelas || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {kelas.jumlah_siswa}/{kelas.kapasitas}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success">Aktif</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ActionButtons
                        onEdit={() => handleEdit(kelas)}
                        onDelete={() => handleDelete(kelas)}
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
              Menampilkan {pagination.from || 0} - {pagination.to || 0} dari {pagination.total} kelas
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.current_page === 1}
                onClick={() => fetchData(pagination.current_page - 1)}
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
                    onClick={() => fetchData(page)}
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
                onClick={() => fetchData(pagination.current_page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Kelas Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedKelas ? 'Edit Kelas' : 'Tambah Kelas'}
        size="lg"
      >
        <KelasForm
          kelas={selectedKelas}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default Kelas;
