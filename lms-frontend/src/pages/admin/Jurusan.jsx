import { useState, useEffect } from 'react';
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

const Jurusan = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJurusan, setSelectedJurusan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jurusanList, setJurusanList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchJurusan = async () => {
    try {
      setLoadingData(true);
      const result = await getAllJurusan();
      if (result.data) {
        setJurusanList(result.data);
      }
    } catch (error) {
      console.error('Error fetching jurusan:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);

      if (selectedJurusan) {
        await updateJurusan(selectedJurusan.id, data);
        alert('Jurusan updated successfully!');
      } else {
        await createJurusan(data);
        alert('Jurusan created successfully!');
      }

      setIsModalOpen(false);
      setSelectedJurusan(null);
      fetchJurusan();
    } catch (error) {
      console.error('Form submit error:', error);
      alert('Failed to save jurusan');
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
      alert('Jurusan deleted successfully!');
      fetchJurusan();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete jurusan');
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

  useEffect(() => {
    fetchJurusan();
  }, []);

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
                {filteredJurusan.length === 0 ? (
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
                  filteredJurusan.map((jurusan, index) => (
                    <tr key={jurusan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
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
