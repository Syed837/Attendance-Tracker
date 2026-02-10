import Card from '../ui/Card';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'primary' }) {
    const colorClasses = {
        primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20',
        success: 'bg-success-50 text-success-600 dark:bg-success-900/20',
        warning: 'bg-warning-50 text-warning-600 dark:bg-warning-900/20',
        danger: 'bg-danger-50 text-danger-600 dark:bg-danger-900/20',
    };

    return (
        <Card hover className="flex items-start gap-4">
            {Icon && (
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            )}
            <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                {subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>
        </Card>
    );
}
