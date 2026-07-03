import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, XCircle, Clock, Eye, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import tugasService from '../../services/tugasService';

const TugasSubmissions = () => {
  const { tugasId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [tugas, setTugas] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showNilaiModal, setShowNilaiModal] = useState(false);
  
  // Filter
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Form nilai
  const [nilai, setNilai] = useState('');
  const [feedback, setFeedback] = useState('');

  // Load data
  useEffect(() => {
    loadTugasDetail();
    loadSubmissions();
  }, [tugasId]);

  const loadTugasDetail = async () => {
    try {
      const response = await tugasService.getTugasById(tugasId);
      setTugas(response.data);
    } catch (error) {
      console.error('Error loading tugas:', error);
      alert('Gagal memuat detail tugas');
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await tugasService.getSubmissions(tugasId);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error loading submissions:', error);
      alert('Gagal memuat data pengumpulan');
    } finally {
      setLoading(false);
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'submitted') return sub.status === 'submitted';
    if (filterStatus === 'graded') return sub.status === 'graded';
    if (filterStatus === 'late') return sub.is_late;
    if (filterStatus === 'not_submitted') return sub.status === 'not_submitted';
    return true;
  });

  // Open nilai modal
  const handleOpenNilaiModal = (submission) => {
    setSelectedSubmission(submission);
    setNilai(submission.nilai || '');
    setFeedback(submission.feedback || '');
    setShowNilaiModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowNilaiModal(false);
    setSelectedSubmission(null);
    setNilai('');
    setFeedback('');
  };

  // Submit nilai
  const handleSubmitNilai = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const data = {
        nilai: parseInt(nilai),
        feedback: feedback,
      };

      await tugasService.gradeSubmission(selectedSubmission.id, data);
      alert('Nilai berhasil disimpan');
      
      handleCloseModal();
      loadSubmissions();
    } catch (error) {
      console.error('Error saving nilai:', error);
      alert(error.message || 'Gagal menyimpan nilai');
    } finally {
      setLoading(false);
    }
  };

  // Download file
  const handleDownload = async (submissionId, fileName) => {
    try {
      await tugasService.downloadSubmission(submissionId);
      alert(`Download: ${fileName}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Gagal mendownload file');
    }
  };

  // Get status badge
  const getStatusBadge = (submission) => {
    if (submission.status === 'graded') {
      return <Badge variant="success">Sudah Dinilai</Badge>;
    }
    if (submission.status === 'submitted') {
      if (submission.is_late) {
        return <Badge variant="warning">Terlambat</Badge>;
      }
      return <Badge variant="info">Belum Dinilai</Badge>;
    }
    return <Badge variant="danger">Belum Submit</Badge>;
  };

  // Get nilai color
  const getNilaiColor = (nilai) => {
    if (!nilai) return '';
    if (nilai >= 85) return 'text-green-600 font-semibold';
    if (nilai >= 70) return 'text-blue-600 font-semibold';
    if (nilai >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate statistics
  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length,
    graded: submissions.filter(s => s.status === 'graded').length,
    late: submissions.filter(s => s.is_late).length,
    notSubmitted: submissions.filter(s => s.status === 'not_submitted').length,
  };

  if (!tugas) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/guru/tugas')}
          className="mb-4"
        >
          Kembali
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{tugas.judul}</h1>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span>{tugas.mata_pelajaran?.nama || 'Mata Pelajaran'}</span>
          <span>•</span>
          <span>{tugas.kelas?.nama || 'Kelas'}</span>
          <span>•</span>
          <span>Deadline: {formatDate(tugas.deadline)}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-600 font-medium">Total Siswa</p>
            <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-600 font-medium">Terkumpul</p>
            <p className="text-3xl font-bold text-green-700">{stats.submitted}</p>
          </div>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <div className="text-center">
            <p className="text-sm text-purple-600 font-medium">Dinilai</p>
            <p className="text-3xl font-bold text-purple-700">{stats.graded}</p>
          </div>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <p className="text-sm text-yellow-600 font-medium">Terlambat</p>
            <p className="text-3xl font-bold text-yellow-700">{stats.late}</p>
          </div>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <div className="text-center">
            <p className="text-sm text-red-600 font-medium">Belum Submit</p>
            <p className="text-3xl font-bold text-red-700">{stats.notSubmitted}</p>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Semua', count: stats.total },
            { value: 'submitted', label: 'Sudah Submit', count: stats.submitted },
            { value: 'graded', label: 'Sudah Dinilai', count: stats.graded },
            { value: 'late', label: 'Terlambat', count: stats.late },
            { value: 'not_submitted', label: 'Belum Submit', count: stats.notSubmitted },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </Card>

      {/* Submissions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Submit</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission, index) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{submission.siswa_nis}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {submission.siswa_nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(submission.submitted_at)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(submission)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {submission.nilai ? (
                        <span className={`text-lg ${getNilaiColor(submission.nilai)}`}>
                          {submission.nilai}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {submission.status !== 'not_submitted' && (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              icon={Download}
                              onClick={() => handleDownload(submission.id, submission.file_name)}
                            >
                              Download
                            </Button>
                            <Button
                              size="sm"
                              icon={submission.status === 'graded' ? Eye : CheckCircle}
                              onClick={() => handleOpenNilaiModal(submission)}
                            >
                              {submission.status === 'graded' ? 'Lihat Nilai' : 'Beri Nilai'}
                            </Button>
                          </>
                        )}
                        {submission.status === 'not_submitted' && (
                          <span className="text-xs text-gray-400">Belum ada file</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Nilai */}
      <Modal
        isOpen={showNilaiModal}
        onClose={handleCloseModal}
        title={selectedSubmission?.status === 'graded' ? 'Detail Nilai' : 'Beri Nilai'}
        size="lg"
      >
        {selectedSubmission && (
          <form onSubmit={handleSubmitNilai}>
            <div className="space-y-4">
              {/* Siswa Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Nama Siswa</p>
                <p className="text-lg font-semibold text-gray-900">{selectedSubmission.siswa_nama}</p>
                <p className="text-sm text-gray-600 mt-1">NIS: {selectedSubmission.siswa_nis}</p>
                {selectedSubmission.submitted_at && (
                  <p className="text-sm text-gray-600 mt-1">
                    Waktu Submit: {formatDate(selectedSubmission.submitted_at)}
                  </p>
                )}
                {selectedSubmission.is_late && (
                  <Badge variant="warning" size="sm" className="mt-2">Terlambat</Badge>
                )}
              </div>

              {/* File Info */}
              {selectedSubmission.file_name && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">File Submission</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{selectedSubmission.file_name}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      icon={Download}
                      onClick={() => handleDownload(selectedSubmission.id, selectedSubmission.file_name)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {/* Nilai Input */}
              <Input
                type="number"
                label={`Nilai (0-${tugas.max_score})`}
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
                min={0}
                max={tugas.max_score}
                required
                disabled={selectedSubmission.status === 'graded' && selectedSubmission.nilai}
              />

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (Opsional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Berikan feedback untuk siswa..."
                  disabled={selectedSubmission.status === 'graded' && selectedSubmission.feedback}
                />
              </div>

              {/* Existing feedback */}
              {selectedSubmission.status === 'graded' && selectedSubmission.feedback && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Feedback yang Diberikan:</p>
                  <p className="text-sm text-blue-800">{selectedSubmission.feedback}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
              >
                {selectedSubmission.status === 'graded' ? 'Tutup' : 'Batal'}
              </Button>
              {selectedSubmission.status !== 'graded' && (
                <Button
                  type="submit"
                  icon={Save}
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Nilai'}
                </Button>
              )}
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default TugasSubmissions;
