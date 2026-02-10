export default function Card({
    children,
    title,
    subtitle,
    className = '',
    hover = false,
    glass = false,
}) {
    const baseClasses = 'rounded-xl shadow-lg p-6 transition-all duration-300';
    const hoverClasses = hover ? 'card-hover' : '';
    const glassClasses = glass ? 'glass' : 'bg-white dark:bg-gray-800';

    const classes = [baseClasses, hoverClasses, glassClasses, className].join(' ');

    return (
        <div className={classes}>
            {(title || subtitle) && (
                <div className="mb-4">
                    {title && <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
}
