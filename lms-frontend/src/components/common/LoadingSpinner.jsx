/**
 * LoadingSpinner Component — Consistent loading indicator
 *
 * Props:
 *  size    — 'sm' | 'md' | 'lg'
 *  text    — optional loading text below spinner
 *  fullPage — center in a full-height container
 */
const LoadingSpinner = ({ size = 'md', text, fullPage = false }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`animate-spin rounded-full border-gray-200 border-t-primary ${sizes[size] ?? sizes.md}`}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-64">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
