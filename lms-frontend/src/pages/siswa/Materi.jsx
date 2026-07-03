import { useState, useEffect } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import EmptyState from '../../components/common/EmptyState';
import materiService from '../../services/materiService';

const Materi = () => {
  const [materi, setMateri] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMapel, setFilterMapel] = useState('');

  // Load materi
  useEffect(() => {
    loadMateri();
  }, [filterMapel, searchQuery]);

  const loadMateri = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterMapel) params.mata_pelajaran_id = filterMapel;

      const response = await materiService.getAllMateri(params);
      setMateri(response.data);
    } catch (error) {
      console.error('Error loading materi:', error);
      alert('Gagal memuat data materi');
    } finally {
      setLoading(false);
    }
  };

  // Handle download
  const handleDownload = async (id, fileName) => {
    try {
      await materiService.downloadMateri(id);
      alert(`Download: ${fileName}`);
    } catch (error) {
      console.error('Error downloading materi:', error);
      alert('Gagal mendownload file');
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div>
      <PageHeader
        title="Materi Pembelajaran"
        subtitle="Akses semua materi pembelajaran yang tersedia"
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchPlaceholder="Cari materi..."
        filters={[
          {
            value: filterMapel,
            onChange: (e) => setFilterMapel(e.target.value),
            placeholder: 'Semua Mata Pelajaran',
            options: [
              { value: '1', label: 'Pemrograman Web' },
              { value: '2', label: 'Basis Data' },
              { value: '3', label: 'Algoritma' },
            ],
          },
        ]}
      />

      {/* Materi Grid */}
      {loading && materi.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      ) : materi.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada materi</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Tidak ada materi yang cocok dengan pencarian Anda.' : 'Belum ada materi yang tersedia.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materi.map((item) => (
            <Card key={item.id} hover>
              <div className="flex flex-col h-full">
                {/* Icon & Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {item.judul}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" size="sm">
                        {item.mata_pelajaran.nama}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                  {item.deskripsi}
                </p>

                {/* File Info */}
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate">{item.file_name}</span>
                    <span className="text-gray-400 ml-2">{formatFileSize(item.file_size)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Download}
                    onClick={() => handleDownload(item.id, item.file_name)}
                  >
                    Download
                  </Button>
                </div>

                {/* Guru Name */}
                <div className="mt-2 text-xs text-gray-500">
                  Oleh: {item.guru.nama}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Materi;
