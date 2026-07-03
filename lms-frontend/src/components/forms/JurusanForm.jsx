import { useState, useEffect } from 'react';
import Button from '../common/Button';

/**
 * JurusanForm Component
 * Form for creating and editing jurusan
 * 
 * @param {Object} jurusan - Jurusan data for edit mode (null for create)
 * @param {function} onSubmit - Submit callback
 * @param {function} onCancel - Cancel callback
 * @param {boolean} loading - Loading state
 */
const JurusanForm = ({ jurusan = null, onSubmit, onCancel, loading = false }) => {
  const isEditMode = !!jurusan;

  // Form state
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    deskripsi: '',
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  // Load jurusan data in edit mode
  useEffect(() => {
    if (jurusan) {
      setFormData({
        kode: jurusan.kode || '',
        nama: jurusan.nama || '',
        deskripsi: jurusan.deskripsi || '',
        is_active: jurusan.is_active !== undefined ? jurusan.is_active : true,
      });
    }
  }, [jurusan]);

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
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    // Kode validation
    if (!formData.kode.trim()) {
      newErrors.kode = 'Kode jurusan harus diisi';
    } else if (formData.kode.length < 2 || formData.kode.length > 4) {
      newErrors.kode = 'Kode jurusan harus 2-4 karakter';
    } else if (!/^[A-Z]+$/.test(formData.kode)) {
      newErrors.kode = 'Kode jurusan harus huruf kapital tanpa spasi';
    }

    // Nama validation
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama jurusan harus diisi';
    } else if (formData.nama.length < 3) {
      newErrors.nama = 'Nama jurusan minimal 3 karakter';
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
      {/* Kode Jurusan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kode Jurusan <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="kode"
          value={formData.kode}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase ${
            errors.kode ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Contoh: RPL, TKJ, MM"
          maxLength={4}
          disabled={loading}
        />
        {errors.kode && (
          <p className="mt-1 text-sm text-red-600">{errors.kode}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          2-4 karakter huruf kapital (contoh: RPL, TKJ)
        </p>
      </div>

      {/* Nama Jurusan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Jurusan <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
            errors.nama ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Contoh: Rekayasa Perangkat Lunak"
          disabled={loading}
        />
        {errors.nama && (
          <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
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
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Deskripsi singkat tentang jurusan ini..."
          disabled={loading}
        />
        <p className="mt-1 text-xs text-gray-500">
          Opsional - Jelaskan tentang jurusan ini
        </p>
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

export default JurusanForm;
