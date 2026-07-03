import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import absensiService from '../../services/absensiService';

const Absensi = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [absensiList, setAbsensiList] = useState([]);
  const [filterMapel, setFilterMapel] = useState('');
  const [filterBulan, setFilterBulan] = useState(() => {
    // Default to current month
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  // Load data
  useEffect(() => {
    loadData();
  }, [filterBulan]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load summary
      const summaryRes = await absensiService.getAbsensiSummary({ bulan: filterBulan });
      setSummary(summaryRes.data);
      
      // Load absensi list
      const params = { bulan: filterBulan };
      if (filterMapel) {
        params.mata_pelajaran_id = filterMapel;
      }
      const listRes = await absensiService.getMyAbsensi(params);
      setAbsensiList(listRes.data);
    } catch (error) {
      console.error('Error loading absensi:', error);
      alert('Gagal memuat data absensi');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'hadir':
        return <Badge variant="success">Hadir</Badge>;
      case 'sakit':
        return <Badge variant="warning">Sakit</Badge>;
      case 'izin':
        return <Badge variant="info">Izin</Badge>;
      case 'alpha':
        return <Badge variant="danger">Alpha</Badge>;
      default:
        return null;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'hadir':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'sakit':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'izin':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'alpha':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader
        title="Absensi Saya"
        subtitle="Lihat rekap kehadiran Anda"
      />

      {/* Summary Cards */}
      {loading && !summary ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary" />
        </div>
      ) : summary ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {/* Total */}
            <Card className="bg-gray-50 border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
                <p className="text-xs text-gray-500 mt-1">Pertemuan</p>
              </div>
            </Card>

            {/* Hadir */}
            <Card className="bg-gray-50 border-gray-200">
              <div className="text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-gray-600 text-sm mb-1">Hadir</p>
                <p className="text-3xl font-bold text-gray-900">{summary.hadir}</p>
                <p className="text-xs text-gray-500 mt-1">{summary.persentase_hadir}%</p>
              </div>
            </Card>

            {/* Sakit */}
            <Card className="bg-gray-50 border-gray-200">
              <div className="text-center">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-gray-600 text-sm mb-1">Sakit</p>
                <p className="text-3xl font-bold text-gray-900">{summary.sakit}</p>
              </div>
            </Card>

            {/* Izin */}
            <Card className="bg-gray-50 border-gray-200">
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-gray-600 text-sm mb-1">Izin</p>
                <p className="text-3xl font-bold text-gray-900">{summary.izin}</p>
              </div>
            </Card>

            {/* Alpha */}
            <Card className="bg-gray-50 border-gray-200">
              <div className="text-center">
                <XCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
                <p className="text-gray-600 text-sm mb-1">Alpha</p>
                <p className="text-3xl font-bold text-gray-900">{summary.alpha}</p>
              </div>
            </Card>
          </div>

          {/* Attendance Indicator */}
          {summary.persentase_hadir < 80 && (
            <Card className="mb-6 bg-red-50 border-red-200">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-900 mb-1">
                    Peringatan Kehadiran
                  </h4>
                  <p className="text-sm text-red-800">
                    Persentase kehadiran Anda {summary.persentase_hadir}%. Pastikan kehadiran minimal 80% untuk dapat mengikuti ujian.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Filter */}
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filter Bulan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Bulan
                </label>
                <input
                  type="month"
                  value={filterBulan}
                  onChange={(e) => setFilterBulan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Filter Mata Pelajaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Mata Pelajaran
                </label>
                <select
                  value={filterMapel}
                  onChange={(e) => {
                    setFilterMapel(e.target.value);
                    loadData();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Semua Mata Pelajaran</option>
                  <option value="1">Pemrograman Web</option>
                  <option value="2">Basis Data</option>
                  <option value="3">Algoritma</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Absensi List */}
          {absensiList.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data absensi</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Data absensi untuk periode yang dipilih belum tersedia.
                </p>
              </div>
            </Card>
          ) : (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Riwayat Absensi ({absensiList.length})
              </h3>

              <div className="space-y-3">
                {absensiList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getStatusIcon(item.status)}
                      </div>

                      {/* Info */}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.mata_pelajaran.nama}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.tanggal)}
                        </p>
                        {item.keterangan && (
                          <p className="text-xs text-gray-600 mt-1 italic">
                            {item.keterangan}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Legend */}
          <Card className="mt-6 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Keterangan Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Hadir</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">Sakit</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">Izin</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600">Alpha (Tanpa Keterangan)</span>
              </div>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default Absensi;
