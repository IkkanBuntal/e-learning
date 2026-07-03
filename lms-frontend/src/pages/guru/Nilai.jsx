import { useState, useEffect } from 'react';
import { Save, Users, Filter } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import Input from '../../components/common/Input';
import nilaiService from '../../services/nilaiService';
import masterDataService from '../../services/masterDataService';
import { useToast } from '../../context/ToastContext';

const Nilai = () => {
  const [loading, setLoading] = useState(false);
  const [siswaList, setSiswaList] = useState([]);
  const [nilaiData, setNilaiData] = useState({});
  
  // Filters
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Allowed data from jadwal (authorization)
  const [allowedMapel, setAllowedMapel] = useState([]);
  const [allowedKelas, setAllowedKelas] = useState([]);
  const [availableKelasForMapel, setAvailableKelasForMapel] = useState([]);

  const { success, error: showError } = useToast();

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

  // Load allowed mapel & kelas (from jadwal mengajar)
  useEffect(() => {
    loadAllowedData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (selectedKelas && selectedMapel && selectedJenis) {
      loadNilai();
    }
  }, [selectedKelas, selectedMapel, selectedJenis]);

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
      showError(error.message || 'Gagal memuat data mata pelajaran dan kelas');
    }
  };

  const loadNilai = async () => {
    try {
      setLoading(true);
      const response = await nilaiService.getNilaiByKelas(
        selectedKelas,
        selectedMapel,
        selectedJenis
      );
      
      setSiswaList(response.data);
      
      // Initialize nilai data
      const initialData = {};
      response.data.forEach(siswa => {
        initialData[siswa.siswa_id] = {
          nilai: siswa.nilai || '',
          keterangan: siswa.catatan || '',
        };
      });
      setNilaiData(initialData);
    } catch (error) {
      console.error('Error loading nilai:', error);
      showError('Gagal memuat data nilai');
    } finally {
      setLoading(false);
    }
  };

  // Handle nilai change
  const handleNilaiChange = (siswaId, field, value) => {
    setNilaiData(prev => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        [field]: value,
      }
    }));
  };

  // Handle save
  const handleSave = async () => {
    if (!selectedKelas || !selectedMapel || !selectedJenis) {
      showError('Pilih kelas, mata pelajaran, dan jenis nilai terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data
      const bulkNilai = siswaList
        .filter(siswa => nilaiData[siswa.siswa_id]?.nilai !== '' && nilaiData[siswa.siswa_id]?.nilai !== null)
        .map(siswa => ({
          siswa_id: siswa.siswa_id,
          kelas_id: selectedKelas,
          mata_pelajaran_id: selectedMapel,
          jenis: selectedJenis,
          nilai: parseInt(nilaiData[siswa.siswa_id].nilai),
          catatan: nilaiData[siswa.siswa_id]?.keterangan || keterangan || null,
        }));

      if (bulkNilai.length === 0) {
         showError('Tidak ada data nilai yang diisi');
         return;
      }

      const data = {
        nilai: bulkNilai
      };

      await nilaiService.bulkInputNilai(data);
      success('Nilai berhasil disimpan');
      
      // Reload data
      loadNilai();
    } catch (error) {
      console.error('Error saving nilai:', error);
      showError(error.message || 'Gagal menyimpan nilai');
    } finally {
      setLoading(false);
    }
  };

  // Get nilai color
  const getNilaiColor = (nilai) => {
    if (!nilai) return '';
    const n = parseInt(nilai);
    if (n >= 85) return 'text-green-600 font-semibold';
    if (n >= 70) return 'text-blue-600 font-semibold';
    if (n >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  return (
    <div>
      <PageHeader
        title="Input Nilai"
        subtitle="Input nilai siswa per kelas dan mata pelajaran"
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

            {/* Jenis Nilai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Nilai <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedJenis}
                onChange={(e) => setSelectedJenis(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Pilih Jenis</option>
                <option value="tugas">Tugas</option>
                <option value="uts">UTS</option>
                <option value="uas">UAS</option>
              </select>
            </div>
          </div>

          {/* Keterangan Global */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan (Opsional, akan digunakan jika keterangan per siswa kosong)
            </label>
            <Input
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: UTS Semester 2"
            />
          </div>
        </div>
      </Card>

      {/* Nilai Table */}
      {siswaList.length > 0 ? (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Siswa ({siswaList.length})
            </h3>
            <Button
              onClick={handleSave}
              disabled={loading}
              icon={Save}
            >
              {loading ? 'Menyimpan...' : 'Simpan Semua'}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-16">No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">NIS</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nama Siswa</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-32">Nilai (0-100)</th>
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
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={nilaiData[siswa.siswa_id]?.nilai || ''}
                        onChange={(e) => handleNilaiChange(siswa.siswa_id, 'nilai', e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${getNilaiColor(nilaiData[siswa.siswa_id]?.nilai)}`}
                        placeholder="0-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={nilaiData[siswa.siswa_id]?.keterangan || ''}
                        onChange={(e) => handleNilaiChange(siswa.siswa_id, 'keterangan', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="Keterangan khusus..."
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
              {loading ? 'Menyimpan...' : 'Simpan Semua Nilai'}
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Pilih Filter</h3>
            <p className="mt-1 text-sm text-gray-500">
              Pilih kelas, mata pelajaran, dan jenis nilai untuk mulai input nilai.
            </p>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">💡</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Petunjuk Input Nilai</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Pilih kelas, mata pelajaran, dan jenis nilai terlebih dahulu</li>
              <li>• Nilai harus antara 0-100</li>
              <li>• Keterangan per siswa bersifat opsional</li>
              <li>• Warna nilai: <span className="text-green-600 font-semibold">&gt;=85 (Sangat Baik)</span>, <span className="text-blue-600 font-semibold">70-84 (Baik)</span>, <span className="text-yellow-600 font-semibold">60-69 (Cukup)</span>, <span className="text-red-600 font-semibold">&lt;60 (Kurang)</span></li>
              <li>• Klik "Simpan Semua" untuk menyimpan seluruh nilai sekaligus</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Nilai;
