import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

/**
 * UserForm Component
 * Form for creating and editing users
 * Shows conditional fields based on selected role
 * 
 * @param {Object} user - User data for edit mode (null for create)
 * @param {function} onSubmit - Submit callback
 * @param {function} onCancel - Cancel callback
 * @param {boolean} loading - Loading state
 */
const UserForm = ({ user = null, onSubmit, onCancel, loading = false }) => {
  const isEditMode = !!user;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'siswa',
    // Guru fields
    nip: '',
    phone: '',
    // Siswa fields
    nis: '',
    kelas_id: '',
    parent_phone: '',
    gender: '',
    birth_date: '',
    // Common
    address: '',
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  // Load user data in edit mode
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't populate password in edit mode
        role: user.role || 'siswa',
        nip: user.nip || '',
        phone: user.phone || '',
        nis: user.nis || '',
        kelas_id: user.kelas_id || '',
        parent_phone: user.parent_phone || '',
        gender: user.gender || '',
        birth_date: user.birth_date || '',
        address: user.address || '',
        is_active: user.is_active !== undefined ? user.is_active : true,
      });
    }
  }, [user]);

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

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Password required only in create mode
    if (!isEditMode && !formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    if (!formData.role) {
      newErrors.role = 'Role harus dipilih';
    }

    // Role-specific validation
    if (formData.role === 'guru') {
      if (!formData.nip.trim()) {
        newErrors.nip = 'NIP harus diisi';
      } else if (!/^\d{18}$/.test(formData.nip)) {
        newErrors.nip = 'NIP harus 18 digit angka';
      }
    }

    if (formData.role === 'siswa') {
      if (!formData.nis.trim()) {
        newErrors.nis = 'NIS harus diisi';
      } else if (!/^\d{10}$/.test(formData.nis)) {
        newErrors.nis = 'NIS harus 10 digit angka';
      }

      if (!formData.kelas_id) {
        newErrors.kelas_id = 'Kelas harus dipilih';
      }
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

    // Prepare data based on role
    const submitData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      address: formData.address,
      is_active: formData.is_active,
    };

    // Add password only if provided
    if (formData.password) {
      submitData.password = formData.password;
    }

    // Add role-specific fields
    if (formData.role === 'guru') {
      submitData.nip = formData.nip;
      submitData.phone = formData.phone;
    }

    if (formData.role === 'siswa') {
      submitData.nis = formData.nis;
      submitData.kelas_id = formData.kelas_id;
      submitData.parent_phone = formData.parent_phone;
      submitData.gender = formData.gender;
      submitData.birth_date = formData.birth_date;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Informasi Dasar
        </h4>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama lengkap"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="nama@sekolah.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {!isEditMode && <span className="text-red-500">*</span>}
              {isEditMode && (
                <span className="text-gray-500 text-xs ml-1">
                  (Kosongkan jika tidak ingin mengubah)
                </span>
              )}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Minimal 8 karakter"
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            )}
          </div>
        </div>
      </div>

      {/* Guru-specific fields */}
      {formData.role === 'guru' && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Informasi Guru
          </h4>
          <div className="space-y-4">
            {/* NIP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.nip ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="18 digit angka"
                maxLength={18}
                disabled={loading}
              />
              {errors.nip && (
                <p className="mt-1 text-sm text-red-600">{errors.nip}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="08xxxxxxxxxx"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Siswa-specific fields */}
      {formData.role === 'siswa' && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Informasi Siswa
          </h4>
          <div className="space-y-4">
            {/* NIS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIS <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nis"
                value={formData.nis}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.nis ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10 digit angka"
                maxLength={10}
                disabled={loading}
              />
              {errors.nis && (
                <p className="mt-1 text-sm text-red-600">{errors.nis}</p>
              )}
            </div>

            {/* Kelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kelas <span className="text-red-500">*</span>
              </label>
              <select
                name="kelas_id"
                value={formData.kelas_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.kelas_id ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Pilih Kelas</option>
                <option value="1">X RPL 1</option>
                <option value="2">X RPL 2</option>
                <option value="3">XI RPL 1</option>
                <option value="4">XI RPL 2</option>
                <option value="5">XII RPL 1</option>
                <option value="6">XII RPL 2</option>
              </select>
              {errors.kelas_id && (
                <p className="mt-1 text-sm text-red-600">{errors.kelas_id}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={loading}
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={loading}
              />
            </div>

            {/* Parent Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon Orang Tua
              </label>
              <input
                type="tel"
                name="parent_phone"
                value={formData.parent_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="08xxxxxxxxxx"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alamat
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Alamat lengkap"
          disabled={loading}
        />
      </div>

      {/* Status */}
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

export default UserForm;
