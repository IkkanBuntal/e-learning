import { useState, useEffect } from 'react';
import { Save, UserCheck, Calendar, Filter } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import absensiService from '../../services/absensiService';
import masterDataService from '../../services/masterDataService';

const Absensi = () => {
  const [loading, setLoading] = useState(false);
  const [siswaList, setSiswaList] = useState([]);
  const [absensiData, setAbsensiData] = useState({});
  
  // Filters
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState(() => {
    // Default to today
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Allowed data from jadwal (authorization)
  const [allowedMapel, setAllowedMapel] = useState([]);
  const [allowedKelas, setAllowedKelas] = useState([]);
  const [availableKelasForMapel, setAvailableKelasForMapel] = useState([]);

  // Update available kelas when mata pelajaran changes
  useEffect(() => {
    if (selectedMapel) {
      loadKelasForMapel(selectedMapel);
    } else {
      setAvailableKelasForMapel([]);
      setSelectedKelas('');
    }
  }, [selectedMapel]);

  const loadKelasForMapel = async (mataPelajaranId) => {
    try {
      const kelasResponse = await masterDataService.getAllKelas(mataPelajaranId);
      setAvailableKelasForMapel(kelasResponse.data);
      
      // Reset kelas selection if current kelas not in available list
      if (selectedKelas) {
        const isKelasAvailable = kelasResponse.data.some(k => k.id === parseInt(selectedKelas));
        if (!isKelasAvailable) {
          setSelectedKelas('');
        }
      }
    } catch (error) {
      console.error('Error loading kelas for mapel:', error);
      setAvailableKelasForMapel([]);
    }
  };

  // Summary
  const [summary, setSummary] = useState({
    hadir: 0,
    sakit: 0,
    izin: 0,
    alpha: 0,
  });

  // Load allowed mapel & kelas (from jadwal mengajar)
  useEffect(() => {
    loadAllowedData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (selectedKelas && selectedMapel && selectedTanggal) {
      loadAbsensi();
    }
  }, [selectedKelas, selectedMapel, selectedTanggal]);

  const loadAllowedData = async () => {
    try {
      // Load mata pelajaran yang diajar guru
      const mapelResponse = await masterDataService.getAllMataPelajaran();
      setAllowedMapel(mapelResponse.data);
      
      // Load semua kelas (akan difilter otomatis per mapel saat dipilih)
      const kelasResponse = await masterDataService.getAllKelas();
      setAllowedKelas(kelasResponse.data);
    } catch (error) {
      console.error('Error loading allowed data:', error);
      alert(error.message || 'Gagal memuat data mata pelajaran dan kelas');
    }
  };

  // Calculate summary when absensiData changes
  useEffect(() => {
    const newSummary = {
      hadir: 0,
      sakit: 0,
      izin: 0,
      alpha: 0,
    };

    Object.values(absensiData).forEach(item => {
      if (item.status) {
        newSummary[item.status]++;
      }
    });

    setSummary(newSummary);
  }, [absensiData]);

  const loadAbsensi = async () => {
    try {
      setLoading(true);
      const response = await absensiService.getAbsensiByKelas(
        selectedKelas,
        selectedMapel,
        selectedTanggal
      );
      
      setSiswaList(response.data);
      
      // Initialize absensi data
      const initialData = {};
      response.data.forEach(siswa => {
        initialData[siswa.siswa_id] = {
          status: siswa.status || 'hadir',
          keterangan: siswa.catatan || '',
        };
      });
      setAbsensiData(initialData);
    } catch (error) {
      console.error('Error loading absensi:', error);
      alert('Gagal memuat data absensi');
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = (siswaId, status) => {
    setAbsensiData(prev => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        status: status,
      }
    }));
  };

  // Handle keterangan change
  const handleKeteranganChange = (siswaId, keterangan) => {
    setAbsensiData(prev => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        keterangan: keterangan,
      }
    }));
  };

  // Handle save
  const handleSave = async () => {
    if (!selectedKelas || !selectedMapel || !selectedTanggal) {
      alert('Pilih kelas, mata pelajaran, dan tanggal terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data
      const bulkAbsensi = siswaList.map(siswa => {
        let statusInput = absensiData[siswa.siswa_id]?.status || 'hadir';
        if (statusInput === 'alpha') statusInput = 'alpa'; // mapping frontend to backend enum
        const statusEnum = statusInput.charAt(0).toUpperCase() + statusInput.slice(1);
        
        return {
          siswa_id: siswa.siswa_id,
          kelas_id: selectedKelas,
          mata_pelajaran_id: selectedMapel,
          tanggal: selectedTanggal,
          status: statusEnum,
          catatan: absensiData[siswa.siswa_id]?.keterangan || null,
        };
      });

      const data = {
        absensi: bulkAbsensi,
      };

      await absensiService.bulkInputAbsensi(data);
      alert('Absensi berhasil disimpan');
      
      // Reload data
      loadAbsensi();
    } catch (error) {
      console.error('Error saving absensi:', error);
      alert(error.message || 'Gagal menyimpan absensi');
    } finally {
      setLoading(false);
    }
  };

  // Quick set all status
  const setAllStatus = (status) => {
    const newData = {};
    siswaList.forEach(siswa => {
      newData[siswa.siswa_id] = {
        status: status,
        keterangan: absensiData[siswa.siswa_id]?.keterangan || '',
      };
    });
    setAbsensiData(newData);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'hadir':
        return <Badge variant="success" size="sm">H</Badge>;
      case 'sakit':
        return <Badge variant="warning" size="sm">S</Badge>;
      case 'izin':
        return <Badge variant="info" size="sm">I</Badge>;
      case 'alpha':
        return <Badge variant="danger" size="sm">A</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader
        title="Input Absensi"
        subtitle="Input absensi siswa per kelas dan mata pelajaran"
      />

      {/* Filter Card */}
      <Card className="mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mata Pelajaran */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedMapel}
                onChange={(e) => setSelectedMapel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Pilih Mata Pelajaran</option>
                {allowedMapel.map((mapel) => (
                  <option key={mapel.id} value={mapel.id}>
                    {mapel.nama} ({mapel.kode})
                  </option>
                ))}
              </select>
            </div>

            {/* Kelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kelas <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={!selectedMapel}
              >
                <option value="">
                  {selectedMapel ? 'Pilih Kelas' : 'Pilih Mata Pelajaran dulu'}
                </option>
                {availableKelasForMapel.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={selectedTanggal}
                onChange={(e) => setSelectedTanggal(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Card */}
      {siswaList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-50 border-green-200">
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium">Hadir</p>
              <p className="text-3xl font-bold text-green-700">{summary.hadir}</p>
            </div>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="text-center">
              <p className="text-sm text-yellow-600 font-medium">Sakit</p>
              <p className="text-3xl font-bold text-yellow-700">{summary.sakit}</p>
            </div>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium">Izin</p>
              <p className="text-3xl font-bold text-blue-700">{summary.izin}</p>
            </div>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <div className="text-center">
              <p className="text-sm text-red-600 font-medium">Alpha</p>
              <p className="text-3xl font-bold text-red-700">{summary.alpha}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Absensi Table */}
      {siswaList.length > 0 ? (
        <Card>
          <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Siswa ({siswaList.length})
            </h3>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setAllStatus('hadir')}
              >
                Semua Hadir
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setAllStatus('sakit')}
              >
                Semua Sakit
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setAllStatus('izin')}
              >
                Semua Izin
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setAllStatus('alpha')}
              >
                Semua Alpha
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-16">No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">NIS</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nama Siswa</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {siswaList.map((siswa, index) => (
                  <tr key={siswa.siswa_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{siswa.siswa_nis}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {siswa.siswa_nama}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {['hadir', 'sakit', 'izin', 'alpha'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(siswa.siswa_id, status)}
                            className={`
                              w-10 h-10 rounded-lg font-semibold text-sm transition-all
                              ${absensiData[siswa.siswa_id]?.status === status
                                ? 'bg-gray-700 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }
                            `}
                          >
                            {status === 'hadir' ? 'H' : status === 'sakit' ? 'S' : status === 'izin' ? 'I' : 'A'}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={absensiData[siswa.siswa_id]?.keterangan || ''}
                        onChange={(e) => handleKeteranganChange(siswa.siswa_id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="Keterangan..."
                        disabled={absensiData[siswa.siswa_id]?.status === 'hadir'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              icon={Save}
              size="lg"
              variant="secondary"
            >
              {loading ? 'Menyimpan...' : 'Simpan Absensi'}
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Pilih Filter</h3>
            <p className="mt-1 text-sm text-gray-500">
              Pilih kelas, mata pelajaran, dan tanggal untuk mulai input absensi.
            </p>
          </div>
        </Card>
      )}

      {/* Legend */}
      <Card className="mt-6 bg-gray-50">
        <div className="flex items-center gap-6 flex-wrap">
          <h4 className="text-sm font-semibold text-gray-900">Keterangan:</h4>
          <div className="flex items-center gap-2">
            <Badge variant="success">H</Badge>
            <span className="text-sm text-gray-600">Hadir</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">S</Badge>
            <span className="text-sm text-gray-600">Sakit</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info">I</Badge>
            <span className="text-sm text-gray-600">Izin</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="danger">A</Badge>
            <span className="text-sm text-gray-600">Alpha</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Absensi;
