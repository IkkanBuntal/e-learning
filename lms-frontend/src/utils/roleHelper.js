export const ROLES = {
  ADMIN: 'admin',
  GURU: 'guru',
  SISWA: 'siswa',
};

export const isAdmin = (user) => {
  return user?.role?.name === ROLES.ADMIN;
};

export const isGuru = (user) => {
  return user?.role?.name === ROLES.GURU;
};

export const isSiswa = (user) => {
  return user?.role?.name === ROLES.SISWA;
};

export const getRoleName = (role) => {
  const roleNames = {
    admin: 'Administrator',
    guru: 'Guru',
    siswa: 'Siswa',
  };
  return roleNames[role] || role;
};

export const getRoleColor = (role) => {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    guru: 'bg-blue-100 text-blue-800',
    siswa: 'bg-green-100 text-green-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};
