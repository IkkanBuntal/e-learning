import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { getAllMataPelajaran, getAllKelas } from '../../services/masterDataService';
import { getAllUsers } from '../../services/userService';

/**
 * JadwalForm Component
 * Form for creating/editing jadwal pelajaran
 * 
 * Features:
 * - Time conflict detection
 * - Guru filtering by mata pelajaran
 * - Time range validation
 * - Two-column layout
 */
const JadwalForm = ({ mode = 'create', initialData = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    mata_pelajaran_id: '',
    guru_id: '',
    kelas_id: '',
    ruangan: '',
    semester: '',
  });

  const [errors, setErrors] = useState({});
  const [conflict, setConflict] = useState(null);
  const [mataPelajaranList, setMataPelajaranList] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const semesterOptions = ['Ganjil', 'Genap'];

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const [mataPelajaranRes, guruRes, kelasRes] = await Promise.all([
          getAllMataPelajaran(),
          getAllUsers({ role: 'guru', all: 'true' }),
          getAllKelas({ all: 'true' }),
        ]);
        
        // Handle potential paginated responses
        const mapelData = mataPelajaranRes.data?.data || mataPelajaranRes.data;
        setMataPelajaranList(Array.isArray(mapelData) ? mapelData : []);
        
        const guruData = guruRes.data?.data || guruRes.data;
        setGuruList(Array.isArray(guruData) ? guruData : []);
        
        const kelasData = kelasRes.data?.data || kelasRes.data;
        setKelasList(Array.isArray(kelasData) ? kelasData : []);
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Initialize form with data when editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  // Filter guru by selected mata pelajaran (if needed based on teaching assignments)
  const filteredGuru = guruList;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset guru when mata pelajaran changes
    if (name === 'mata_pelajaran_id') {
      setFormData(prev => ({
        ...prev,
        guru_id: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.hari) {
      newErrors.hari = 'Hari harus dipilih';
    }

    if (!formData.jam_mulai) {
      newErrors.jam_mulai = 'Jam mulai harus diisi';
    }

    if (!formData.jam_selesai) {
      newErrors.jam_selesai = 'Jam selesai harus diisi';
    }

    // Validate time range
    if (formData.jam_mulai && formData.jam_selesai) {
      if (formData.jam_selesai <= formData.jam_mulai) {
        newErrors.jam_selesai = 'Jam selesai harus lebih besar dari jam mulai';
      }
    }

    if (!formData.mata_pelajaran_id) {
      newErrors.mata_pelajaran_id = 'Mata pelajaran harus dipilih';
    }

    if (!formData.guru_id) {
      newErrors.guru_id = 'Guru harus dipilih';
    }

    if (!formData.kelas_id) {
      newErrors.kelas_id = 'Kelas harus dipilih';
    }

    if (!formData.semester) {
      newErrors.semester = 'Semester harus dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Don't submit if there's a conflict
    if (conflict) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Conflict Warning */}
      {conflict && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Peringatan Konflik Jadwal
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{conflict.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          {/* Hari */}
          <div>
            <label htmlFor="hari" className="block text-sm font-medium text-gray-700 mb-1">
              Hari <span className="text-red-500">*</span>
            </label>
            <select
              id="hari"
              name="hari"
              value={formData.hari}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.hari ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Hari</option>
              {hariOptions.map(hari => (
                <option key={hari} value={hari}>{hari}</option>
              ))}
            </select>
            {errors.hari && (
              <p className="mt-1 text-sm text-red-500">{errors.hari}</p>
            )}
          </div>

          {/* Jam Mulai */}
          <div>
            <label htmlFor="jam_mulai" className="block text-sm font-medium text-gray-700 mb-1">
              Jam Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="jam_mulai"
              name="jam_mulai"
              value={formData.jam_mulai}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.jam_mulai ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.jam_mulai && (
              <p className="mt-1 text-sm text-red-500">{errors.jam_mulai}</p>
            )}
          </div>

          {/* Jam Selesai */}
          <div>
            <label htmlFor="jam_selesai" className="block text-sm font-medium text-gray-700 mb-1">
              Jam Selesai <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="jam_selesai"
              name="jam_selesai"
              value={formData.jam_selesai}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.jam_selesai ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.jam_selesai && (
              <p className="mt-1 text-sm text-red-500">{errors.jam_selesai}</p>
            )}
          </div>

          {/* Mata Pelajaran */}
          <div>
            <label htmlFor="mata_pelajaran_id" className="block text-sm font-medium text-gray-700 mb-1">
              Mata Pelajaran <span className="text-red-500">*</span>
            </label>
            <select
              id="mata_pelajaran_id"
              name="mata_pelajaran_id"
              value={formData.mata_pelajaran_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.mata_pelajaran_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Mata Pelajaran</option>
              {mataPelajaranList.map(mapel => (
                <option key={mapel.id} value={mapel.id}>
                  {mapel.kode} - {mapel.nama}
                </option>
              ))}
            </select>
            {errors.mata_pelajaran_id && (
              <p className="mt-1 text-sm text-red-500">{errors.mata_pelajaran_id}</p>
            )}
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          {/* Guru */}
          <div>
            <label htmlFor="guru_id" className="block text-sm font-medium text-gray-700 mb-1">
              Guru <span className="text-red-500">*</span>
            </label>
            <select
              id="guru_id"
              name="guru_id"
              value={formData.guru_id}
              onChange={handleChange}
              disabled={!formData.mata_pelajaran_id}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.guru_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">
                {formData.mata_pelajaran_id ? 'Pilih Guru' : 'Pilih Mata Pelajaran Dulu'}
              </option>
              {filteredGuru.map(guru => (
                <option key={guru.id} value={guru.id}>{guru.nama}</option>
              ))}
            </select>
            {errors.guru_id && (
              <p className="mt-1 text-sm text-red-500">{errors.guru_id}</p>
            )}
          </div>

          {/* Kelas */}
          <div>
            <label htmlFor="kelas_id" className="block text-sm font-medium text-gray-700 mb-1">
              Kelas <span className="text-red-500">*</span>
            </label>
            <select
              id="kelas_id"
              name="kelas_id"
              value={formData.kelas_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.kelas_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Kelas</option>
              {kelasList.map(kelas => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.nama}
                </option>
              ))}
            </select>
            {errors.kelas_id && (
              <p className="mt-1 text-sm text-red-500">{errors.kelas_id}</p>
            )}
          </div>

          {/* Ruangan */}
          <div>
            <label htmlFor="ruangan" className="block text-sm font-medium text-gray-700 mb-1">
              Ruangan
            </label>
            <input
              type="text"
              id="ruangan"
              name="ruangan"
              value={formData.ruangan}
              onChange={handleChange}
              placeholder="Contoh: R.101, Lab.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Semester */}
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.semester ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Semester</option>
              {semesterOptions.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
            {errors.semester && (
              <p className="mt-1 text-sm text-red-500">{errors.semester}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!!conflict}
        >
          {mode === 'create' ? 'Simpan' : 'Update'}
        </Button>
      </div>
    </form>
  );
};

export default JadwalForm;
