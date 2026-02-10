/**
 * Calculate overall attendance statistics
 */
export function calculateOverallStats(subjects) {
    const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
    const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
    const overallPercentage = totalClasses > 0
        ? parseFloat(((totalAttended / totalClasses) * 100).toFixed(2))
        : 0;

    return {
        attended: totalAttended,
        total: totalClasses,
        percentage: overallPercentage,
    };
}

/**
 * Calculate bunk availability using 75% rule
 * Find max S such that: attended / (total + S) >= 0.75
 */
export function calculateBunkAvailability(attended, total) {
    const TARGET_PERCENTAGE = 0.75;

    // If already below 75%, cannot bunk
    if (attended / total < TARGET_PERCENTAGE) {
        // Calculate how many classes must be attended to reach 75%
        let mustAttend = 0;
        let currentAttended = attended;
        let currentTotal = total;

        while (currentAttended / currentTotal < TARGET_PERCENTAGE) {
            currentTotal++;
            currentAttended++;
            mustAttend++;
        }

        return {
            skippable: 0,
            mustAttend,
            status: 'Danger',
        };
    }

    // Calculate how many can be skipped
    let skippable = 0;
    while (attended / (total + skippable + 1) >= TARGET_PERCENTAGE) {
        skippable++;
    }

    return {
        skippable,
        mustAttend: 0,
        status: 'Safe',
    };
}

/**
 * Calculate per-subject status
 */
export function calculateSubjectStatus(subject) {
    const percentage = subject.total > 0
        ? parseFloat(((subject.attended / subject.total) * 100).toFixed(2))
        : 0;

    const { skippable, mustAttend, status } = calculateBunkAvailability(
        subject.attended,
        subject.total
    );

    return {
        ...subject,
        percentage,
        skippable,
        mustAttend,
        status,
    };
}
