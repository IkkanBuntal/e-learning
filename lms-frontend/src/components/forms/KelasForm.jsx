import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { getAllJurusan } from '../../services/masterDataService';
import { getAllUsers } from '../../services/userService';

/**
 * KelasForm Component
 * Form for creating and editing kelas
 * 
 * @param {Object} kelas - Kelas data for edit mode (null for create)
 * @param {function} onSubmit - Submit callback
 * @param {function} onCancel - Cancel callback
 * @param {boolean} loading - Loading state
 */
const KelasForm = ({ kelas = null, onSubmit, onCancel, loading = false }) => {
  const isEditMode = !!kelas;

  // Form state
  const [formData, setFormData] = useState({
    nama: '',
    jurusan_id: '',
    tingkat: '10',
    wali_kelas_id: '',
    kapasitas: 32,
    tahun_ajaran: '',
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [jurusanList, setJurusanList] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load jurusan and guru data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const [jurusanRes, guruRes] = await Promise.all([
          getAllJurusan(),
          getAllUsers({ role: 'guru' }),
        ]);
        
        setJurusanList(jurusanRes.data || []);
        setGuruList(guruRes.data || []);
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Load kelas data in edit mode
  useEffect(() => {
    if (kelas) {
      setFormData({
        nama: kelas.nama || '',
        jurusan_id: kelas.jurusan_id || '',
        tingkat: kelas.tingkat || '10',
        wali_kelas_id: kelas.wali_kelas_id || '',
        kapasitas: kelas.kapasitas || 32,
        tahun_ajaran: kelas.tahun_ajaran || '',
        is_active: kelas.is_active !== undefined ? kelas.is_active : true,
      });
    } else {
      // Set default tahun ajaran for create mode
      const currentYear = new Date().getFullYear();
      setFormData((prev) => ({
        ...prev,
        tahun_ajaran: `${currentYear}/${currentYear + 1}`,
      }));
    }
  }, [kelas]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    // Nama validation
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama kelas harus diisi';
    } else if (!/^(X|XI|XII)\s[A-Z]+\s\d+$/.test(formData.nama)) {
      newErrors.nama = 'Format: X RPL 1, XI TKJ 2, XII MM 1';
    }

    // Jurusan validation
    if (!formData.jurusan_id) {
      newErrors.jurusan_id = 'Jurusan harus dipilih';
    }

    // Tingkat validation
    if (!formData.tingkat) {
      newErrors.tingkat = 'Tingkat harus dipilih';
    }

    // Wali Kelas validation
    if (!formData.wali_kelas_id) {
      newErrors.wali_kelas_id = 'Wali kelas harus dipilih';
    }

    // Kapasitas validation
    if (!formData.kapasitas || formData.kapasitas < 1) {
      newErrors.kapasitas = 'Kapasitas minimal 1';
    } else if (formData.kapasitas > 50) {
      newErrors.kapasitas = 'Kapasitas maksimal 50';
    }

    // Tahun Ajaran validation
    if (!formData.tahun_ajaran.trim()) {
      newErrors.tahun_ajaran = 'Tahun ajaran harus diisi';
    } else if (!/^\d{4}\/\d{4}$/.test(formData.tahun_ajaran)) {
      newErrors.tahun_ajaran = 'Format: 2024/2025';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nama Kelas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Kelas <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
            errors.nama ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Contoh: X RPL 1, XI TKJ 2"
          disabled={loading}
        />
        {errors.nama && (
          <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Format: X/XI/XII [KODE JURUSAN] [NOMOR]
        </p>
      </div>

      {/* Jurusan & Tingkat - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Jurusan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jurusan <span className="text-red-500">*</span>
          </label>
          <select
            name="jurusan_id"
            value={formData.jurusan_id}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.jurusan_id ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Pilih Jurusan</option>
            {jurusanList.map((jurusan) => (
              <option key={jurusan.id} value={jurusan.id}>
                {jurusan.kode} - {jurusan.nama}
              </option>
            ))}
          </select>
          {errors.jurusan_id && (
            <p className="mt-1 text-sm text-red-600">{errors.jurusan_id}</p>
          )}
        </div>

        {/* Tingkat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tingkat <span className="text-red-500">*</span>
          </label>
          <select
            name="tingkat"
            value={formData.tingkat}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.tingkat ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="10">10 (Kelas X)</option>
            <option value="11">11 (Kelas XI)</option>
            <option value="12">12 (Kelas XII)</option>
          </select>
          {errors.tingkat && (
            <p className="mt-1 text-sm text-red-600">{errors.tingkat}</p>
          )}
        </div>
      </div>

      {/* Wali Kelas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Wali Kelas <span className="text-red-500">*</span>
        </label>
        <select
          name="wali_kelas_id"
          value={formData.wali_kelas_id}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
            errors.wali_kelas_id ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        >
          <option value="">Pilih Wali Kelas</option>
          {guruList.map((guru) => (
            <option key={guru.id} value={guru.id}>
              {guru.nama}
            </option>
          ))}
        </select>
        {errors.wali_kelas_id && (
          <p className="mt-1 text-sm text-red-600">{errors.wali_kelas_id}</p>
        )}
      </div>

      {/* Kapasitas & Tahun Ajaran - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kapasitas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kapasitas Maksimal <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="kapasitas"
            value={formData.kapasitas}
            onChange={handleChange}
            min="1"
            max="50"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.kapasitas ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.kapasitas && (
            <p className="mt-1 text-sm text-red-600">{errors.kapasitas}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Maksimal 50 siswa</p>
        </div>

        {/* Tahun Ajaran */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tahun Ajaran <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tahun_ajaran"
            value={formData.tahun_ajaran}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.tahun_ajaran ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="2024/2025"
            disabled={loading}
          />
          {errors.tahun_ajaran && (
            <p className="mt-1 text-sm text-red-600">{errors.tahun_ajaran}</p>
          )}
        </div>
      </div>

      {/* Status Aktif */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          disabled={loading}
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Status Aktif
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEditMode ? 'Update' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
};

export default KelasForm;
