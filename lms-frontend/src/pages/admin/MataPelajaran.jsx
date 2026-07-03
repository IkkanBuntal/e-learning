import { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ActionButtons from '../../components/common/ActionButtons';
import MataPelajaranForm from '../../components/forms/MataPelajaranForm';
import PageHeader from '../../components/common/PageHeader';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import EmptyState from '../../components/common/EmptyState';
import masterDataService from '../../services/masterDataService';

const MataPelajaran = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('all');
  const [filterJurusan, setFilterJurusan] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMapel, setSelectedMapel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [mapelList, setMapelList] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [mapelRes, jurusanRes] = await Promise.all([
          masterDataService.getAllMataPelajaran(),
          masterDataService.getAllJurusan(),
        ]);

        setMapelList((mapelRes.data || []).map(m => ({
          id: m.id,
          kode: m.kode,
          nama: m.nama,
          kategori: m.kategori || 'umum',
          jurusan: m.jurusan?.kode || 'Semua',
          jurusan_ids: m.jurusan_id ? [m.jurusan_id] : [],
          sks: m.sks || 4,
          tingkat: ['10', '11', '12'],
          is_active: m.is_active !== false,
        })));
        
        setJurusanList((jurusanRes.data || []).map(j => ({ id: j.id, kode: j.kode })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Handle form submit
   */
  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);

      if (selectedMapel) {
        await masterDataService.updateMataPelajaran(selectedMapel.id, data);
        alert('Mata pelajaran updated successfully!');
      } else {
        await masterDataService.createMataPelajaran(data);
        alert('Mata pelajaran created successfully!');
      }

      // Reload data
      const mapelRes = await masterDataService.getAllMataPelajaran();
      setMapelList((mapelRes.data || []).map(m => ({
        id: m.id,
        kode: m.kode,
        nama: m.nama,
        kategori: m.kategori || 'umum',
        jurusan: m.jurusan?.kode || 'Semua',
        jurusan_ids: m.jurusan_id ? [m.jurusan_id] : [],
        sks: m.sks || 4,
        tingkat: ['10', '11', '12'],
        is_active: m.is_active !== false,
      })));

      setIsModalOpen(false);
      setSelectedMapel(null);
    } catch (error) {
      console.error('Form submit error:', error);
      alert('Failed to save mata pelajaran');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle add
   */
  const handleAdd = () => {
    setSelectedMapel(null);
    setIsModalOpen(true);
  };

  /**
   * Handle edit
   */
  const handleEdit = (mapel) => {
    setSelectedMapel(mapel);
    setIsModalOpen(true);
  };

  /**
   * Handle delete
   */
  const handleDelete = async (mapel) => {
    if (!confirm(`Yakin ingin menghapus mata pelajaran "${mapel.nama}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await masterDataService.deleteMataPelajaran(mapel.id);
      alert('Mata pelajaran deleted successfully!');
      
      // Reload data
      const mapelRes = await masterDataService.getAllMataPelajaran();
      setMapelList((mapelRes.data || []).map(m => ({
        id: m.id,
        kode: m.kode,
        nama: m.nama,
        kategori: m.kategori || 'umum',
        jurusan: m.jurusan?.kode || 'Semua',
        jurusan_ids: m.jurusan_id ? [m.jurusan_id] : [],
        sks: m.sks || 4,
        tingkat: ['10', '11', '12'],
        is_active: m.is_active !== false,
      })));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete mata pelajaran');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get kategori badge variant
   */
  const getKategoriVariant = (kategori) => {
    const map = { umum: 'secondary', produktif: 'success', muatan_lokal: 'purple' };
    return map[kategori] || 'default';
  };

  /**
   * Get kategori label
   */
  const getKategoriLabel = (kategori) => {
    const labels = {
      umum: 'Umum',
      produktif: 'Produktif',
      muatan_lokal: 'Muatan Lokal',
    };
    return labels[kategori] || kategori;
  };

  /**
   * Filter mata pelajaran
   */
  const filteredMapel = mapelList.filter((mapel) => {
    const matchesSearch =
      mapel.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapel.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori =
      filterKategori === 'all' || mapel.kategori === filterKategori;
    const matchesJurusan =
      filterJurusan === 'all' ||
      mapel.jurusan_ids.includes(parseInt(filterJurusan)) ||
      mapel.jurusan_ids.length === 0; // Semua jurusan
    return matchesSearch && matchesKategori && matchesJurusan;
  });

  return (
    <div>
      <PageHeader
        title="Data Mata Pelajaran"
        subtitle="Kelola data mata pelajaran yang diajarkan"
        actions={
          <Button variant="primary" onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Tambah Mapel
          </Button>
        }
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchPlaceholder="Cari kode atau nama mata pelajaran..."
        filters={[
          {
            value: filterKategori,
            onChange: (e) => setFilterKategori(e.target.value),
            placeholder: 'Semua Kategori',
            options: [
              { value: 'umum',         label: 'Umum' },
              { value: 'produktif',    label: 'Produktif' },
              { value: 'muatan_lokal', label: 'Muatan Lokal' },
            ],
          },
          {
            value: filterJurusan,
            onChange: (e) => setFilterJurusan(e.target.value),
            placeholder: 'Semua Jurusan',
            options: jurusanList.map(j => ({ value: j.id, label: j.kode })),
          },
        ]}
      />

      {/* Mata Pelajaran Table */}
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
                  Nama Mata Pelajaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurusan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKS
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
              {filteredMapel.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <EmptyState
                      icon={BookOpen}
                      title="Tidak ada mata pelajaran"
                      description={searchQuery || filterKategori !== 'all' || filterJurusan !== 'all' ? 'Coba ubah filter pencarian' : 'Klik tombol "Tambah Mapel" untuk menambah mata pelajaran baru'}
                    />
                  </td>
                </tr>
              ) : (
                filteredMapel.map((mapel, index) => (
                  <tr key={mapel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-sm font-semibold bg-primary-100 text-primary-700 rounded-lg">
                        {mapel.kode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {mapel.nama}
                      </p>
                      <p className="text-xs text-gray-500">
                        Tingkat: {mapel.tingkat.map(t => t === '10' ? 'X' : t === '11' ? 'XI' : 'XII').join(', ')}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getKategoriVariant(mapel.kategori)}>
                        {getKategoriLabel(mapel.kategori)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {mapel.jurusan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mapel.sks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success">Aktif</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ActionButtons
                        onEdit={() => handleEdit(mapel)}
                        onDelete={() => handleDelete(mapel)}
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
        {filteredMapel.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredMapel.length} dari {mapelList.length} mata pelajaran
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mata Pelajaran Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
        size="lg"
      >
        <MataPelajaranForm
          mataPelajaran={selectedMapel}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default MataPelajaran;
