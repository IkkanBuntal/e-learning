import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, Trophy, TrendingDown } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import nilaiService from '../../services/nilaiService';

const Nilai = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [nilaiByMapel, setNilaiByMapel] = useState([]);
  const [filterMapel, setFilterMapel] = useState('');
  const [filterJenis, setFilterJenis] = useState('');

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load summary
      const summaryRes = await nilaiService.getNilaiSummary();
      setSummary(summaryRes.data);
      
      // Load nilai by mapel
      const mapelRes = await nilaiService.getNilaiByMapel();
      setNilaiByMapel(mapelRes.data);
    } catch (error) {
      console.error('Error loading nilai:', error);
      alert('Gagal memuat data nilai');
    } finally {
      setLoading(false);
    }
  };

  // Get nilai badge
  const getNilaiBadge = (nilai) => {
    if (nilai >= 85) return <Badge variant="success">A</Badge>;
    if (nilai >= 70) return <Badge variant="info">B</Badge>;
    if (nilai >= 60) return <Badge variant="warning">C</Badge>;
    return <Badge variant="danger">D</Badge>;
  };

  // Get jenis label
  const getJenisLabel = (jenis) => {
    switch (jenis) {
      case 'tugas': return 'Tugas';
      case 'uts': return 'UTS';
      case 'uas': return 'UAS';
      default: return jenis;
    }
  };

  // Filter nilai by mapel
  const filteredData = nilaiByMapel.filter(item => {
    if (filterMapel && !item.mata_pelajaran.toLowerCase().includes(filterMapel.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Nilai Saya"
        subtitle="Lihat semua nilai dan prestasi belajar Anda"
      />

      {/* Summary Cards */}
      {loading && !summary ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary" />
        </div>
      ) : summary ? (
  
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Rata-rata"
            value={summary.rata_rata}
            icon={BarChart3}
            iconBgColor="bg-primary-100"
            iconColor="text-primary-600"
          />
          <StatCard
            title="Nilai Tertinggi"
            value={summary.tertinggi}
            icon={TrendingUp}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Nilai Terendah"
            value={summary.terendah}
            icon={TrendingDown}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
          <StatCard
            title="Total Nilai"
            value={summary.total_nilai}
            icon={Trophy}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

          {/* Filter */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={filterMapel}
                  onChange={(e) => setFilterMapel(e.target.value)}
                  placeholder="Cari mata pelajaran..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </Card>

          {/* Nilai by Mata Pelajaran */}
          {filteredData.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Trophy className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada nilai</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Nilai Anda akan tampil di sini setelah guru menginput.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredData.map((item, index) => (
                <Card key={index}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.mata_pelajaran}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Rata-rata: <span className="font-semibold text-gray-900">{item.rata_rata}</span>
                      </p>
                    </div>
                    {getNilaiBadge(item.rata_rata)}
                  </div>

                  {/* Nilai List */}
                  <div className="space-y-3">
                    {item.nilai.map((nilai, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-700 font-semibold text-sm">
                              {nilai.jenis === 'tugas' ? 'T' : nilai.jenis === 'uts' ? 'U' : 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getJenisLabel(nilai.jenis)}
                            </p>
                            {nilai.keterangan && (
                              <p className="text-xs text-gray-500">{nilai.keterangan}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-900">
                            {nilai.nilai}
                          </span>
                          {getNilaiBadge(nilai.nilai)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Grade Information */}
          <Card className="mt-6 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Keterangan Nilai</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="success">A</Badge>
                <span className="text-sm text-gray-600">85-100 (Sangat Baik)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info">B</Badge>
                <span className="text-sm text-gray-600">70-84 (Baik)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="warning">C</Badge>
                <span className="text-sm text-gray-600">60-69 (Cukup)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="danger">D</Badge>
                <span className="text-sm text-gray-600">&lt;60 (Kurang)</span>
              </div>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default Nilai;
