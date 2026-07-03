export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '-';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return d.toLocaleDateString('id-ID');
  }
};

export const formatTime = (time) => {
  if (!time) return '-';
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (date) => {
  if (!date) return '-';
  
  const now = new Date();
  const target = new Date(date);
  const diffMs = target - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Sudah lewat';
  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Besok';
  if (diffDays <= 7) return `${diffDays} hari lagi`;
  return formatDate(date);
};
