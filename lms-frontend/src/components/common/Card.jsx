/**
 * Card Component — standardized container card
 *
 * Props:
 *  - title / subtitle  — optional header section
 *  - hover             — enable hover shadow effect
 *  - noPadding         — remove default p-6 from body
 *  - className         — extra classes on the outer wrapper
 */
export default function Card({ children, className = '', title, subtitle, hover = false, noPadding = false }) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden
        ${hover ? 'transition-shadow duration-200 hover:shadow-md cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100">
          {title    && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
}
