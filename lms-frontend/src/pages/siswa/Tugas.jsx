import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Upload, ClipboardList } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import EmptyState from '../../components/common/EmptyState';
import tugasService from '../../services/tugasService';

const Tugas = () => {
  const [tugas, setTugas] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTugas, setSelectedTugas] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // active, submitted, late

  // Form state for submission
  const [formData, setFormData] = useState({
    file: null,
    catatan: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Load tugas
  useEffect(() => {
    loadTugas();
    loadMySubmissions();
  }, [searchQuery]);

  const loadTugas = async () => {
    try {
      setLoading(true);
      const params = { status: 'active' };
      if (searchQuery) params.search = searchQuery;

      const response = await tugasService.getAllTugas(params);
      setTugas(response.data);
    } catch (error) {
      console.error('Error loading tugas:', error);
      alert('Gagal memuat data tugas');
    } finally {
      setLoading(false);
    }
  };

  const loadMySubmissions = async () => {
    try {
      const response = await tugasService.getMySubmissions();
      setMySubmissions(response.data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  // Check if already submitted
  const isSubmitted = (tugasId) => {
    return mySubmissions.some(s => s.tugas_id === tugasId);
  };

  // Get submission for tugas
  const getSubmission = (tugasId) => {
    return mySubmissions.find(s => s.tugas_id === tugasId);
  };

  // Handle open submit modal
  const handleOpenSubmitModal = (tugasData) => {
    if (isSubmitted(tugasData.id)) {
      alert('Anda sudah mengumpulkan tugas ini');
      return;
    }
    setSelectedTugas(tugasData);
    setFormData({ file: null, catatan: '' });
    setFormErrors({});
    setShowSubmitModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowSubmitModal(false);
    setSelectedTugas(null);
    setFormData({ file: null, catatan: '' });
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
    if (!formData.file) errors.file = 'File harus diupload';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const data = new FormData();
      data.append('file', formData.file);
      data.append('catatan', formData.catatan);

      await tugasService.submitTugas(selectedTugas.id, data);
      alert('Tugas berhasil dikumpulkan');

      handleCloseModal();
      loadMySubmissions();
    } catch (error) {
      console.error('Error submitting tugas:', error);
      alert(error.message || 'Gagal mengumpulkan tugas');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if deadline passed
  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  // Get time remaining
  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return 'Sudah ditutup';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} hari lagi`;
    if (hours > 0) return `${hours} jam lagi`;
    return 'Kurang dari 1 jam';
  };

  // Get deadline badge
  const getDeadlineBadge = (deadline, submitted = false) => {
    if (submitted) {
      return <Badge variant="success" size="sm">Sudah dikumpulkan</Badge>;
    }
    
    if (isDeadlinePassed(deadline)) {
      return <Badge variant="danger" size="sm">Ditutup</Badge>;
    }
    
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 1) {
      return <Badge variant="danger" size="sm">Deadline hari ini!</Badge>;
    }
    if (daysLeft <= 3) {
      return <Badge variant="warning" size="sm">{daysLeft} hari lagi</Badge>;
    }
    
    return <Badge variant="success" size="sm">Aktif</Badge>;
  };

  // Filter tugas by tab
  const filteredTugas = tugas.filter(item => {
    const submitted = isSubmitted(item.id);
    const deadlinePassed = isDeadlinePassed(item.deadline);

    if (activeTab === 'active') {
      return !submitted && !deadlinePassed;
    }
    if (activeTab === 'submitted') {
      return submitted;
    }
    if (activeTab === 'late') {
      return deadlinePassed && !submitted;
    }
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Tugas Saya"
        subtitle="Lihat dan kumpulkan tugas yang diberikan"
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchPlaceholder="Cari tugas..."
      />

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'submitted'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sudah Dikumpulkan
          </button>
          <button
            onClick={() => setActiveTab('late')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'late'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Terlambat
          </button>
        </div>
      </div>

      {/* Tugas List */}
      {loading && filteredTugas.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      ) : filteredTugas.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada tugas</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'active' && 'Tidak ada tugas aktif saat ini.'}
              {activeTab === 'submitted' && 'Belum ada tugas yang dikumpulkan.'}
              {activeTab === 'late' && 'Tidak ada tugas yang terlambat.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTugas.map((item) => {
            const submitted = isSubmitted(item.id);
            const submission = getSubmission(item.id);

            return (
              <Card key={item.id} hover>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Content */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {item.judul}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" size="sm">
                            {item.mata_pelajaran.nama}
                          </Badge>
                          {getDeadlineBadge(item.deadline, submitted)}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.deskripsi}
                    </p>

                    {/* Info */}
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {formatDate(item.deadline)}</span>
                        <span className="text-red-500 ml-2">
                          ({getTimeRemaining(item.deadline)})
                        </span>
                      </div>

                      {/* Submission info */}
                      {submitted && submission && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Dikumpulkan: {formatDate(submission.submitted_at)}</span>
                        </div>
                      )}

                      {/* Grading info */}
                      {submitted && submission?.nilai && (
                        <div className="flex items-center gap-1 text-gray-900">
                          <span className="font-semibold">Nilai: {submission.nilai}/{item.max_score}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex md:flex-col gap-2">
                    {!submitted && !isDeadlinePassed(item.deadline) && (
                      <Button
                        variant="secondary"
                        icon={Upload}
                        onClick={() => handleOpenSubmitModal(item)}
                        className="w-full"
                      >
                        Kumpulkan
                      </Button>
                    )}
                    {submitted && (
                      <Button
                        variant="secondary"
                        icon={CheckCircle}
                        disabled
                        className="w-full"
                      >
                        Sudah Dikumpulkan
                      </Button>
                    )}
                    {!submitted && isDeadlinePassed(item.deadline) && (
                      <Button
                        variant="secondary"
                        icon={AlertCircle}
                        disabled
                        className="w-full"
                      >
                        Terlambat
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={handleCloseModal}
        title="Kumpulkan Tugas"
        size="lg"
      >
        {selectedTugas && (
          <form onSubmit={handleSubmit}>
            {/* Tugas Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">
                {selectedTugas.judul}
              </h3>
              <p className="text-sm text-gray-600">
                Deadline: {formatDate(selectedTugas.deadline)}
              </p>
            </div>

            <div className="space-y-4">
              {/* File Upload */}
              <FileUpload
                label="File Tugas"
                name="file"
                accept=".pdf,.doc,.docx,.zip,.rar"
                maxSize={10}
                required
                onChange={handleFileChange}
                helperText="Format: PDF, DOC, DOCX, ZIP, RAR. Maksimal 10MB"
                error={formErrors.file}
              />

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tambahkan catatan untuk guru..."
                />
              </div>
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
                icon={Upload}
              >
                {loading ? 'Mengumpulkan...' : 'Kumpulkan Tugas'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Tugas;
