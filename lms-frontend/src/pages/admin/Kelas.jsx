import { useState, useEffect } from 'react';
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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [kelasRes, jurusanRes, siswaRes] = await Promise.all([
          masterDataService.getAllKelas(),
          masterDataService.getAllJurusan(),
          userService.getAll({ role: 'siswa' }),
        ]);

        const allSiswa = Array.isArray(siswaRes.data) ? siswaRes.data : (siswaRes.data?.data || []);
        
        setKelasList((kelasRes.data || []).map(k => ({
          id: k.id,
          nama: k.nama,
          jurusan: k.jurusan || { id: 0, kode: '-' },
          tingkat: k.tingkat ? k.tingkat.toString() : '10',
          wali_kelas: k.wali_kelas || null,
          jumlah_siswa: allSiswa.filter(s => s.kelas_id === k.id).length,
          kapasitas: k.kapasitas || 32,
          tahun_ajaran: k.tahun_ajaran || '2025/2026',
          is_active: k.is_active !== false,
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

      if (selectedKelas) {
        await masterDataService.updateKelas(selectedKelas.id, data);
        alert('Kelas updated successfully!');
      } else {
        await masterDataService.createKelas(data);
        alert('Kelas created successfully!');
      }

      // Reload data
      const [kelasRes, siswaRes] = await Promise.all([
        masterDataService.getAllKelas(),
        userService.getAll({ role: 'siswa' }),
      ]);

      const allSiswa = siswaRes.data || [];
      
      setKelasList((kelasRes.data || []).map(k => ({
        id: k.id,
        nama: k.nama,
        jurusan: k.jurusan || { id: 0, kode: '-' },
        tingkat: k.tingkat ? k.tingkat.toString() : '10',
        wali_kelas: k.wali_kelas || null,
        jumlah_siswa: allSiswa.filter(s => s.kelas_id === k.id).length,
        kapasitas: k.kapasitas || 32,
        tahun_ajaran: k.tahun_ajaran || '2025/2026',
        is_active: k.is_active !== false,
      })));

      setIsModalOpen(false);
      setSelectedKelas(null);
    } catch (error) {
      console.error('Form submit error:', error);
      alert('Failed to save kelas');
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
      wali_kelas_id: kelas.wali_kelas ? kelas.wali_kelas.id : null,
    });
    setIsModalOpen(true);
  };

  /**
   * Handle delete kelas
   */
  const handleDelete = async (kelas) => {
    if (!confirm(`Yakin ingin menghapus kelas "${kelas.nama}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await masterDataService.deleteKelas(kelas.id);
      alert('Kelas deleted successfully!');
      
      // Reload data
      const [kelasRes, siswaRes] = await Promise.all([
        masterDataService.getAllKelas(),
        userService.getAll({ role: 'siswa' }),
      ]);

      const allSiswa = siswaRes.data || [];
      
      setKelasList((kelasRes.data || []).map(k => ({
        id: k.id,
        nama: k.nama,
        jurusan: k.jurusan || { id: 0, kode: '-' },
        tingkat: k.tingkat ? k.tingkat.toString() : '10',
        wali_kelas: k.wali_kelas || null,
        jumlah_siswa: allSiswa.filter(s => s.kelas_id === k.id).length,
        kapasitas: k.kapasitas || 32,
        tahun_ajaran: k.tahun_ajaran || '2025/2026',
        is_active: k.is_active !== false,
      })));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete kelas');
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
   * Filter kelas
   */
  const filteredKelas = kelasList.filter((kelas) => {
    const matchesSearch = kelas.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesJurusan =
      filterJurusan === 'all' || kelas.jurusan.id === parseInt(filterJurusan);
    const matchesTingkat =
      filterTingkat === 'all' || kelas.tingkat === filterTingkat;
    return matchesSearch && matchesJurusan && matchesTingkat;
  });

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
              { value: '10', label: 'Kelas X' },
              { value: '11', label: 'Kelas XI' },
              { value: '12', label: 'Kelas XII' },
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
                      {index + 1}
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
                      {kelas.tingkat === '10' && 'X'}
                      {kelas.tingkat === '11' && 'XI'}
                      {kelas.tingkat === '12' && 'XII'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {kelas.wali_kelas ? kelas.wali_kelas.name : '-'}
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
        {filteredKelas.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredKelas.length} dari {kelasList.length} kelas
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
