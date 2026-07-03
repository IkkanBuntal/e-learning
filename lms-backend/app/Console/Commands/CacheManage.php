<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\CacheService;

class CacheManage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:manage 
                            {action : Action to perform (clear, stats, clear-pattern)}
                            {pattern? : Pattern to match for clear-pattern action}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage Redis cache (clear, stats, clear-pattern)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');
        
        switch ($action) {
            case 'clear':
                return $this->clearAllCache();
                
            case 'stats':
                return $this->showStats();
                
            case 'clear-pattern':
                $pattern = $this->argument('pattern');
                if (!$pattern) {
                    $this->error('Pattern argument is required for clear-pattern action');
                    return 1;
                }
                return $this->clearByPattern($pattern);
                
            default:
                $this->error('Invalid action. Use: clear, stats, or clear-pattern');
                return 1;
        }
    }
    
    /**
     * Clear all cache
     */
    private function clearAllCache()
    {
        $this->info('Clearing all cache...');
        
        if (CacheService::clearAll()) {
            $this->info('✓ All cache cleared successfully!');
            return 0;
        }
        
        $this->error('✗ Failed to clear cache');
        return 1;
    }
    
    /**
     * Show cache statistics
     */
    private function showStats()
    {
        $this->info('Fetching Redis statistics...');
        $stats = CacheService::getStats();
        
        if (!$stats['connected']) {
            $this->error('✗ Redis connection failed');
            $this->error('Error: ' . ($stats['error'] ?? 'Unknown error'));
            return 1;
        }
        
        $this->info('');
        $this->info('=== Redis Cache Statistics ===');
        $this->info('');
        $this->table(
            ['Metric', 'Value'],
            [
                ['Status', '✓ Connected'],
                ['Memory Used', $stats['used_memory']],
                ['Total Keys', number_format($stats['total_keys'])],
                ['Cache Hits', number_format($stats['hits'])],
                ['Cache Misses', number_format($stats['misses'])],
                ['Hit Rate', $stats['hit_rate']],
            ]
        );
        
        return 0;
    }
    
    /**
     * Clear cache by pattern
     */
    private function clearByPattern($pattern)
    {
        $this->info("Clearing cache with pattern: {$pattern}");
        
        try {
            CacheService::clearByPattern($pattern);
            $this->info("✓ Cache cleared for pattern: {$pattern}");
            return 0;
        } catch (\Exception $e) {
            $this->error("✗ Failed to clear cache: " . $e->getMessage());
            return 1;
        }
    }
}
