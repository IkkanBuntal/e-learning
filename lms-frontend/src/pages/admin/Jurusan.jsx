import { useState, useEffect, useCallback } from 'react';
import { Plus, GraduationCap } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ActionButtons from '../../components/common/ActionButtons';
import JurusanForm from '../../components/forms/JurusanForm';
import PageHeader from '../../components/common/PageHeader';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import EmptyState from '../../components/common/EmptyState';
import { getAllJurusan, createJurusan, updateJurusan, deleteJurusan } from '../../services/masterDataService';
import { useToast } from '../../context/ToastContext';

const Jurusan = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJurusan, setSelectedJurusan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jurusanList, setJurusanList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Force refresh trigger
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { success, error: showError } = useToast();

  const fetchJurusan = useCallback(async () => {
    try {
      setLoadingData(true);
      const result = await getAllJurusan();
      
      console.log('🔄 Fetched jurusan:', result);
      
      if (result.data) {
        setJurusanList(result.data);
        console.log('✅ Jurusan state updated');
      }
    } catch (error) {
      console.error('Error fetching jurusan:', error);
      showError('Gagal memuat data jurusan');
    } finally {
      setLoadingData(false);
    }
  }, [refreshTrigger, showError]);

  const handleFormSubmit = async (data) => {
    console.log('📝 Form submitted with data:', data);
    console.log('📝 Selected jurusan:', selectedJurusan);
    
    try {
      setLoading(true);

      if (selectedJurusan) {
        // Update jurusan
        console.log('🔄 Updating jurusan ID:', selectedJurusan.id);
        const result = await updateJurusan(selectedJurusan.id, data);
        console.log('✅ Update result:', result);
        success('Jurusan berhasil diupdate!');
      } else {
        // Create jurusan
        console.log('➕ Creating new jurusan');
        const result = await createJurusan(data);
        console.log('✅ Create result:', result);
        success('Jurusan berhasil dibuat!');
      }

      setIsModalOpen(false);
      setSelectedJurusan(null);
      
      // Reset search untuk memastikan jurusan baru terlihat
      setSearchQuery('');
      
      // Trigger refresh dengan increment counter
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error('❌ Form submit error:', error);
      showError(error.response?.data?.message || 'Gagal menyimpan jurusan');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedJurusan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (jurusan) => {
    setSelectedJurusan(jurusan);
    setIsModalOpen(true);
  };

  const handleDelete = async (jurusan) => {
    if (!confirm(`Yakin ingin menghapus jurusan "${jurusan.nama}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteJurusan(jurusan.id);
      success('Jurusan berhasil dihapus!');
      
      // Trigger refresh dengan increment counter
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Delete error:', error);
      showError(error.response?.data?.message || 'Gagal menghapus jurusan');
    } finally {
      setLoading(false);
    }
  };

  const filteredJurusan = jurusanList.filter((jurusan) => {
    const matchesSearch =
      jurusan.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jurusan.nama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredJurusan.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJurusan = filteredJurusan.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchJurusan();
  }, [fetchJurusan]);

  return (
    <div>
      <PageHeader
        title="Data Jurusan"
        subtitle="Kelola data jurusan yang tersedia di sekolah"
        actions={
          <Button variant="primary" onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Tambah Jurusan
          </Button>
        }
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchPlaceholder="Cari kode atau nama jurusan..."
        filters={[]}
      />

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
                    Kode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Jurusan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentJurusan.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <EmptyState
                        icon={GraduationCap}
                        title="Tidak ada jurusan"
                        description={searchQuery ? 'Coba ubah filter pencarian' : 'Klik tombol "Tambah Jurusan" untuk menambah jurusan baru'}
                      />
                    </td>
                  </tr>
                ) : (
                  currentJurusan.map((jurusan, index) => (
                    <tr key={jurusan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-sm font-semibold bg-primary-100 text-primary-700 rounded-lg">
                          {jurusan.kode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {jurusan.nama}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-md truncate">
                          {jurusan.deskripsi || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ActionButtons
                          onEdit={() => handleEdit(jurusan)}
                          onDelete={() => handleDelete(jurusan)}
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
        {filteredJurusan.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredJurusan.length)} dari {filteredJurusan.length} jurusan
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedJurusan ? 'Edit Jurusan' : 'Tambah Jurusan'}
        size="md"
      >
        <JurusanForm
          jurusan={selectedJurusan}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default Jurusan;
