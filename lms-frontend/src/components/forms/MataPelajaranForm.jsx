import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { getAllJurusan } from '../../services/masterDataService';

/**
 * MataPelajaranForm Component
 * Form for creating and editing mata pelajaran
 * 
 * @param {Object} mataPelajaran - Mata pelajaran data for edit mode (null for create)
 * @param {function} onSubmit - Submit callback
 * @param {function} onCancel - Cancel callback
 * @param {boolean} loading - Loading state
 */
const MataPelajaranForm = ({ mataPelajaran = null, onSubmit, onCancel, loading = false }) => {
  const isEditMode = !!mataPelajaran;

  // Form state
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    kategori: 'umum',
    jurusan_ids: [],
    sks: 2,
    tingkat: [],
    deskripsi: '',
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [jurusanList, setJurusanList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const kategoriOptions = [
    { value: 'umum', label: 'Umum' },
    { value: 'produktif', label: 'Produktif' },
    { value: 'muatan_lokal', label: 'Muatan Lokal' },
  ];

  const tingkatOptions = [
    { value: '10', label: 'Kelas X' },
    { value: '11', label: 'Kelas XI' },
    { value: '12', label: 'Kelas XII' },
  ];

  // Load jurusan data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const response = await getAllJurusan();
        setJurusanList(response.data || []);
      } catch (error) {
        console.error('Error loading jurusan:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Load mata pelajaran data in edit mode
  useEffect(() => {
    if (mataPelajaran) {
      setFormData({
        kode: mataPelajaran.kode || '',
        nama: mataPelajaran.nama || '',
        kategori: mataPelajaran.kategori || 'umum',
        jurusan_ids: mataPelajaran.jurusan_ids || [],
        sks: mataPelajaran.sks || 2,
        tingkat: mataPelajaran.tingkat || [],
        deskripsi: mataPelajaran.deskripsi || '',
        is_active: mataPelajaran.is_active !== undefined ? mataPelajaran.is_active : true,
      });
    }
  }, [mataPelajaran]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // Auto uppercase for kode
    if (name === 'kode') {
      newValue = newValue.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };



  /**
   * Handle tingkat checkbox change
   */
  const handleTingkatChange = (tingkat) => {
    setFormData((prev) => {
      const tingkatList = prev.tingkat.includes(tingkat)
        ? prev.tingkat.filter((t) => t !== tingkat)
        : [...prev.tingkat, tingkat];
      return { ...prev, tingkat: tingkatList };
    });

    if (errors.tingkat) {
      setErrors((prev) => ({ ...prev, tingkat: '' }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    // Kode validation
    if (!formData.kode.trim()) {
      newErrors.kode = 'Kode mata pelajaran harus diisi';
    } else if (formData.kode.length < 2 || formData.kode.length > 10) {
      newErrors.kode = 'Kode mata pelajaran harus 2-10 karakter';
    }

    // Nama validation
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama mata pelajaran harus diisi';
    } else if (formData.nama.length < 3) {
      newErrors.nama = 'Nama mata pelajaran minimal 3 karakter';
    }

    // Kategori validation
    if (!formData.kategori) {
      newErrors.kategori = 'Kategori harus dipilih';
    }

    // Jurusan validation (only for produktif)
    if (formData.kategori === 'produktif' && formData.jurusan_ids.length === 0) {
      newErrors.jurusan_ids = 'Pilih jurusan untuk mata pelajaran produktif';
    }

    // SKS validation
    if (!formData.sks || formData.sks < 1) {
      newErrors.sks = 'SKS minimal 1';
    } else if (formData.sks > 10) {
      newErrors.sks = 'SKS maksimal 10';
    }

    // Tingkat validation
    if (formData.tingkat.length === 0) {
      newErrors.tingkat = 'Pilih minimal 1 tingkat';
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
      {/* Kode & Nama - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kode Mata Pelajaran <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="kode"
            value={formData.kode}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase ${
              errors.kode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="MTK, IPA, PWEB"
            maxLength={10}
            disabled={loading}
          />
          {errors.kode && (
            <p className="mt-1 text-sm text-red-600">{errors.kode}</p>
          )}
        </div>

        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Mata Pelajaran <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.nama ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Matematika, Pemrograman Web"
            disabled={loading}
          />
          {errors.nama && (
            <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
          )}
        </div>
      </div>

      {/* Kategori & SKS - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.kategori ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            {kategoriOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.kategori && (
            <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>
          )}
        </div>

        {/* SKS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKS / Jam Pelajaran <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="sks"
            value={formData.sks}
            onChange={handleChange}
            min="1"
            max="10"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.sks ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.sks && (
            <p className="mt-1 text-sm text-red-600">{errors.sks}</p>
          )}
        </div>
      </div>

      {/* Jurusan - Only show for produktif */}
      {formData.kategori === 'produktif' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jurusan <span className="text-red-500">*</span>
          </label>
          <select
            name="jurusan_ids"
            value={formData.jurusan_ids.length > 0 ? formData.jurusan_ids[0] : ''}
            onChange={(e) => {
              const val = e.target.value;
              setFormData(prev => ({
                ...prev,
                jurusan_ids: val ? [parseInt(val)] : []
              }));
              if (errors.jurusan_ids) {
                setErrors(prev => ({ ...prev, jurusan_ids: '' }));
              }
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.jurusan_ids ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">-- Pilih Jurusan --</option>
            {jurusanList.map((jurusan) => (
              <option key={jurusan.id} value={jurusan.id}>
                {jurusan.kode} - {jurusan.nama}
              </option>
            ))}
          </select>
          {errors.jurusan_ids && (
            <p className="mt-1 text-sm text-red-600">{errors.jurusan_ids}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Untuk mata pelajaran umum, akan otomatis tersedia untuk semua jurusan
          </p>
        </div>
      )}

      {/* Tingkat */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tingkat <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {tingkatOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.tingkat.includes(option.value)}
                onChange={() => handleTingkatChange(option.value)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.tingkat && (
          <p className="mt-1 text-sm text-red-600">{errors.tingkat}</p>
        )}
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Deskripsi singkat tentang mata pelajaran ini..."
          disabled={loading}
        />
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

export default MataPelajaranForm;
