import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatCard Component — Statistics display card
 *
 * Props:
 *  title        — label teks di atas angka
 *  value        — angka / nilai utama
 *  icon         — Lucide icon component
 *  iconBgColor  — Tailwind bg class untuk icon wrapper  (default: bg-primary-100)
 *  iconColor    — Tailwind text class untuk icon        (default: text-primary-600)
 *  trend        — angka persentase (positif / negatif)
 *  trendLabel   — label di samping trend
 */
const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBgColor = 'bg-primary-100',
  iconColor   = 'text-primary-600',
  trend,
  trendLabel,
}) => {
  const isPositiveTrend = trend > 0;
  const isNegativeTrend = trend < 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1 truncate">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

          {/* Trend */}
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {isPositiveTrend && (
                <>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+{trend}%</span>
                </>
              )}
              {isNegativeTrend && (
                <>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">{trend}%</span>
                </>
              )}
              {!isPositiveTrend && !isNegativeTrend && (
                <span className="text-sm font-medium text-gray-400">—</span>
              )}
              {trendLabel && (
                <span className="text-xs text-gray-400 ml-1">{trendLabel}</span>
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className={`${iconBgColor} rounded-xl p-3 flex-shrink-0 ml-4`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
