/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Format date to readable string
 */
export function formatDateReadable(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Get status color based on attendance percentage
 */
export function getStatusColor(percentage, target = 75) {
    if (percentage < target - 10) return 'danger';
    if (percentage < target) return 'warning';
    if (percentage < 85) return 'success';
    return 'primary';
}

/**
 * Get status label
 */
export function getStatusLabel(status) {
    const labels = {
        critical: 'Critical',
        warning: 'Warning',
        good: 'Good',
        excellent: 'Excellent',
    };
    return labels[status] || status;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(attended, total) {
    if (total === 0) return 0;
    return Math.round((attended / total) * 100 * 100) / 100;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
