import { useState, useEffect } from 'react';
import { RefreshCw, Trash2, Database, TrendingUp } from 'lucide-react';
import { getCacheStats, clearAllCache, clearCacheByType } from '../../services/cacheApi';

/**
 * Cache Manager Component
 * Admin component for monitoring and managing Redis cache
 */
const CacheManager = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getCacheStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch cache stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClearAll = async () => {
    if (!confirm('Clear all cache? This will affect performance temporarily.')) return;
    
    try {
      setActionLoading(true);
      await clearAllCache();
      alert('All cache cleared successfully!');
      fetchStats();
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('Failed to clear cache');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearType = async (type) => {
    try {
      setActionLoading(true);
      await clearCacheByType(type);
      alert(`${type} cache cleared successfully!`);
      fetchStats();
    } catch (error) {
      console.error(`Failed to clear ${type} cache:`, error);
      alert(`Failed to clear ${type} cache`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const isConnected = stats?.connected;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cache Management</h2>
          <p className="text-gray-600 mt-1">Monitor and manage Redis cache</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={actionLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Connection Status */}
      <div className={`p-4 rounded-lg ${isConnected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-center gap-3">
          <Database className={`w-6 h-6 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
          <div>
            <p className={`font-semibold ${isConnected ? 'text-green-900' : 'text-red-900'}`}>
              {isConnected ? '✓ Connected to Redis' : '✗ Redis Disconnected'}
            </p>
            {!isConnected && stats?.error && (
              <p className="text-sm text-red-700 mt-1">{stats.error}</p>
            )}
          </div>
        </div>
      </div>

      {isConnected && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Memory Used</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.used_memory}</p>
                </div>
                <Database className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Keys</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_keys?.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hit Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.hit_rate}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.hits?.toLocaleString()} hits / {stats.misses?.toLocaleString()} misses
                  </p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-4">Cache Actions</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['dashboard', 'jadwal', 'kelas', 'materi', 'tugas', 'nilai', 'absensi'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleClearType(type)}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear {type}
                </button>
              ))}
              
              <button
                onClick={handleClearAll}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 col-span-2 md:col-span-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Cache is automatically refreshed based on TTL. 
              Manual clearing should only be needed when data is updated or for testing.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CacheManager;
