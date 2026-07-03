import { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import FileUpload from '../../components/common/FileUpload';
import Badge from '../../components/common/Badge';
import ActionButtons from '../../components/common/ActionButtons';
import PageHeader from '../../components/common/PageHeader';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import EmptyState from '../../components/common/EmptyState';
import materiService from '../../services/materiService';
import masterDataService from '../../services/masterDataService';

const Materi = () => {
  const [materi, setMateri] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMateri, setEditingMateri] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMapel, setFilterMapel] = useState('');
  const [filterKelas, setFilterKelas] = useState('');

  // Allowed data from jadwal (authorization)
  const [allowedMapel, setAllowedMapel] = useState([]);
  const [allowedKelas, setAllowedKelas] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    mata_pelajaran_id: '',
    kelas_id: '',
    file: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [availableKelasForForm, setAvailableKelasForForm] = useState([]);

  // Update available kelas when mata pelajaran changes in form
  useEffect(() => {
    if (formData.mata_pelajaran_id) {
      loadKelasForMapel(formData.mata_pelajaran_id);
    } else {
      setAvailableKelasForForm([]);
    }
  }, [formData.mata_pelajaran_id]);

  const loadKelasForMapel = async (mataPelajaranId) => {
    try {
      const kelasResponse = await masterDataService.getAllKelas(mataPelajaranId);
      setAvailableKelasForForm(kelasResponse.data);
      
      // Reset kelas selection if current kelas not in available list
      if (formData.kelas_id) {
        const isKelasAvailable = kelasResponse.data.some(k => k.id === parseInt(formData.kelas_id));
        if (!isKelasAvailable) {
          setFormData(prev => ({ ...prev, kelas_id: '' }));
        }
      }
    } catch (error) {
      console.error('Error loading kelas for mapel:', error);
      setAvailableKelasForForm([]);
    }
  };

  // Load allowed mapel & kelas (from jadwal mengajar)
  useEffect(() => {
    loadAllowedData();
  }, []);

  // Load materi
  useEffect(() => {
    loadMateri();
  }, [filterMapel, filterKelas, searchQuery]);

  const loadAllowedData = async () => {
    try {
      // Load mata pelajaran yang diajar guru
      const mapelResponse = await masterDataService.getAllMataPelajaran();
      setAllowedMapel(mapelResponse.data);
      
      // Load semua kelas (akan difilter otomatis per mapel saat dipilih)
      // Untuk initial load, kita load semua kelas yang mungkin
      const kelasResponse = await masterDataService.getAllKelas();
      setAllowedKelas(kelasResponse.data);
    } catch (error) {
      console.error('Error loading allowed data:', error);
      alert(error.message || 'Gagal memuat data mata pelajaran dan kelas');
    }
  };

  const loadMateri = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterMapel) params.mata_pelajaran_id = filterMapel;
      if (filterKelas) params.kelas_id = filterKelas;

      const response = await materiService.getAllMateri(params);
      setMateri(response.data);
    } catch (error) {
      console.error('Error loading materi:', error);
      alert('Gagal memuat data materi');
    } finally {
      setLoading(false);
    }
  };

  // Handle open modal
  const handleOpenModal = (materiData = null) => {
    if (materiData) {
      setEditingMateri(materiData);
      setFormData({
        judul: materiData.judul,
        deskripsi: materiData.deskripsi,
        mata_pelajaran_id: materiData.mata_pelajaran.id,
        kelas_id: materiData.kelas.id,
        file: null,
      });
    } else {
      setEditingMateri(null);
      setFormData({
        judul: '',
        deskripsi: '',
        mata_pelajaran_id: '',
        kelas_id: '',
        file: null,
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMateri(null);
    setFormData({
      judul: '',
      deskripsi: '',
      mata_pelajaran_id: '',
      kelas_id: '',
      file: null,
    });
    setFormErrors({});
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handle file change
  const handleFileChange = (file) => {
    setFormData(prev => ({ ...prev, file }));
    setFormErrors(prev => ({ ...prev, file: '' }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.judul.trim()) errors.judul = 'Judul harus diisi';
    if (!formData.deskripsi.trim()) errors.deskripsi = 'Deskripsi harus diisi';
    if (!formData.mata_pelajaran_id) errors.mata_pelajaran_id = 'Mata pelajaran harus dipilih';
    if (!formData.kelas_id) errors.kelas_id = 'Kelas harus dipilih';
    if (!editingMateri && !formData.file) errors.file = 'File harus diupload';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Create FormData
      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('deskripsi', formData.deskripsi);
      data.append('mata_pelajaran_id', formData.mata_pelajaran_id);
      data.append('kelas_id', formData.kelas_id);
      if (formData.file) {
        data.append('file', formData.file);
      }

      if (editingMateri) {
        await materiService.updateMateri(editingMateri.id, data);
        alert('Materi berhasil diupdate');
      } else {
        await materiService.createMateri(data);
        alert('Materi berhasil ditambahkan');
      }

      handleCloseModal();
      loadMateri();
    } catch (error) {
      console.error('Error saving materi:', error);
      alert(error.message || 'Gagal menyimpan materi');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus materi ini?')) return;

    try {
      setLoading(true);
      await materiService.deleteMateri(id);
      alert('Materi berhasil dihapus');
      loadMateri();
    } catch (error) {
      console.error('Error deleting materi:', error);
      alert('Gagal menghapus materi');
    } finally {
      setLoading(false);
    }
  };

  // Handle download
  const handleDownload = async (id, fileName) => {
    try {
      await materiService.downloadMateri(id);
      // In production, this will trigger actual file download
      alert(`Download: ${fileName}`);
    } catch (error) {
      console.error('Error downloading materi:', error);
      alert('Gagal mendownload file');
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div>
      <PageHeader
        title="Materi Pembelajaran"
        subtitle="Kelola materi pembelajaran untuk siswa"
        actions={
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            Upload Materi
          </Button>
        }
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchPlaceholder="Cari materi..."
        filters={[
          {
            value: filterMapel,
            onChange: (e) => setFilterMapel(e.target.value),
            placeholder: 'Semua Mata Pelajaran',
            options: allowedMapel.map(m => ({ value: m.id, label: m.nama })),
          },
          {
            value: filterKelas,
            onChange: (e) => setFilterKelas(e.target.value),
            placeholder: 'Semua Kelas',
            options: allowedKelas.map(k => ({ value: k.id, label: k.nama })),
          },
        ]}
      />



      {/* Materi Grid */}
      {loading && materi.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary" />
        </div>
      ) : materi.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada materi</h3>
            <p className="mt-1 text-sm text-gray-500">Mulai dengan upload materi pertama Anda.</p>
            <div className="mt-6">
              <Button icon={Plus} onClick={() => handleOpenModal()}>
                Upload Materi
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materi.map((item) => (
            <Card key={item.id} hover>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {item.judul}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" size="sm">
                        {item.mata_pelajaran.nama}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {item.kelas.nama}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                  {item.deskripsi}
                </p>

                {/* File Info */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.file_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(item.file_size)}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-500">
                    {formatDate(item.created_at)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(item.id, item.file_name)}
                    >
                      Download
                    </Button>
                    <ActionButtons
                      onEdit={() => handleOpenModal(item)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingMateri ? 'Edit Materi' : 'Upload Materi Baru'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Judul */}
            <Input
              label="Judul Materi"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              required
              error={formErrors.judul}
              placeholder="Contoh: Pengenalan HTML dan CSS"
            />

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Jelaskan isi materi..."
                required
              />
              {formErrors.deskripsi && (
                <p className="mt-1 text-sm text-red-600">{formErrors.deskripsi}</p>
              )}
            </div>

            {/* Mata Pelajaran */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <select
                name="mata_pelajaran_id"
                value={formData.mata_pelajaran_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Pilih Mata Pelajaran</option>
                {allowedMapel.map((mapel) => (
                  <option key={mapel.id} value={mapel.id}>
                    {mapel.nama} ({mapel.kode})
                  </option>
                ))}
              </select>
              {formErrors.mata_pelajaran_id && (
                <p className="mt-1 text-sm text-red-600">{formErrors.mata_pelajaran_id}</p>
              )}
            </div>

            {/* Kelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kelas <span className="text-red-500">*</span>
              </label>
              <select
                name="kelas_id"
                value={formData.kelas_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={!formData.mata_pelajaran_id}
              >
                <option value="">
                  {formData.mata_pelajaran_id ? 'Pilih Kelas' : 'Pilih Mata Pelajaran dulu'}
                </option>
                {availableKelasForForm.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.nama}
                  </option>
                ))}
              </select>
              {formErrors.kelas_id && (
                <p className="mt-1 text-sm text-red-600">{formErrors.kelas_id}</p>
              )}
            </div>

            {/* File Upload */}
            <FileUpload
              label="File Materi"
              name="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              maxSize={10}
              required={!editingMateri}
              onChange={handleFileChange}
              helperText="Format: PDF, DOC, DOCX, PPT, PPTX. Maksimal 10MB"
              error={formErrors.file}
            />

            {editingMateri && (
              <p className="text-sm text-gray-500">
                *Kosongkan jika tidak ingin mengubah file
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : editingMateri ? 'Update' : 'Upload'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Materi;
