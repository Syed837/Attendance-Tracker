# Skip-Class Calculator Algorithm

## Overview

The skip-class calculator is the core feature of the attendance tracker. It uses mathematical formulas to calculate exactly how many classes a student can skip while maintaining their target attendance percentage, or how many consecutive classes they must attend to reach the target.

## Variables

- **A** = Classes attended
- **T** = Total classes conducted
- **R** = Required attendance percentage (default: 75%)
- **S** = Maximum skippable classes
- **C** = Classes required to attend

## Current Attendance Percentage

The current attendance percentage is calculated as:

```
Current % = (A / T) × 100
```

**Example:**
- Attended: 18 classes
- Total: 20 classes
- Current % = (18 / 20) × 100 = 90%

## Maximum Skippable Classes

### Formula Derivation

To find the maximum number of classes (S) that can be skipped while maintaining R% attendance:

**Target condition:**
```
(A / (T + S)) ≥ R/100
```

This states that after skipping S classes, the attendance percentage should be at least R%.

**Solving for S:**
```
A / (T + S) ≥ R/100
A ≥ (R/100) × (T + S)
A ≥ (R×T)/100 + (R×S)/100
100A ≥ R×T + R×S
100A - R×T ≥ R×S
S ≤ (100A - R×T) / R
```

**Final formula:**
```
S = floor((100A - R×T) / R)
```

We use `floor()` to round down because we can only skip whole classes.

### Examples

**Example 1: Above Target**
- Attended (A): 18 classes
- Total (T): 20 classes
- Target (R): 75%
- S = floor((100×18 - 75×20) / 75)
- S = floor((1800 - 1500) / 75)
- S = floor(300 / 75)
- S = floor(4)
- **Result: Can skip 4 classes**

Let's verify: After skipping 4 classes:
- New total = 20 + 4 = 24
- Attended = 18 (unchanged)
- New % = (18 / 24) × 100 = 75% ✓

**Example 2: Exactly at Target**
- Attended (A): 15 classes
- Total (T): 20 classes  
- Target (R): 75%
- Current % = (15 / 20) × 100 = 75%
- S = floor((100×15 - 75×20) / 75)
- S = floor((1500 - 1500) / 75)
- S = floor(0 / 75)
- S = 0
- **Result: Cannot skip any classes**

**Example 3: High Attendance**
- Attended (A): 28 classes
- Total (T): 30 classes
- Target (R): 75%
- Current % = (28 / 30) × 100 = 93.33%
- S = floor((100×28 - 75×30) / 75)
- S = floor((2800 - 2250) / 75)
- S = floor(550 / 75)
- S = floor(7.33)
- S = 7
- **Result: Can skip 7 classes**

## Classes Required to Reach Target

### Formula Derivation

To find the minimum number of consecutive classes (C) that must be attended to reach R% attendance:

**Target condition:**
```
((A + C) / (T + C)) = R/100
```

After attending C consecutive classes, we want the attendance to be exactly R%.

**Solving for C:**
```
(A + C) / (T + C) = R/100
A + C = (R/100) × (T + C)
A + C = (R×T)/100 + (R×C)/100
100(A + C) = R×T + R×C
100A + 100C = R×T + R×C
100C - R×C = R×T - 100A
C(100 - R) = R×T - 100A
C = (R×T - 100A) / (100 - R)
```

**Final formula:**
```
C = ceil((R×T - 100A) / (100 - R))
```

We use `ceil()` to round up because partial classes don't count.

### Examples

**Example 1: Below Target**
- Attended (A): 12 classes
- Total (T): 20 classes
- Target (R): 75%
- Current % = (12 / 20) × 100 = 60%
- C = ceil((75×20 - 100×12) / (100 - 75))
- C = ceil((1500 - 1200) / 25)
- C = ceil(300 / 25)
- C = ceil(12)
- C = 12
- **Result: Must attend 12 consecutive classes**

Let's verify: After attending 12 consecutive classes:
- New total = 20 + 12 = 32
- New attended = 12 + 12 = 24
- New % = (24 / 32) × 100 = 75% ✓

**Example 2: Very Low Attendance**
- Attended (A): 8 classes
- Total (T): 20 classes
- Target (R): 75%
- Current % = (8 / 20) × 100 = 40%
- C = ceil((75×20 - 100×8) / (100 - 75))
- C = ceil((1500 - 800) / 25)
- C = ceil(700 / 25)
- C = ceil(28)
- C = 28
- **Result: Must attend 28 consecutive classes**

## Edge Cases

### Case 1: Zero Classes Conducted
```
If T = 0:
  Return S = 0 (cannot skip what doesn't exist)
  Return C = 0 (no classes to catch up)
```

### Case 2: Negative or Invalid Attendance
```
If A < 0 or T < 0 or A > T:
  Return S = 0
  Return C = 0
```

### Case 3: Invalid Target Percentage
```
If R ≤ 0 or R > 100:
  Return S = 0
  Return C = 0
```

### Case 4: Target is 100%
```
If R = 100:
  Denominator in C formula becomes 0
  Special handling: Must attend all remaining classes
  C = T - A
```

### Case 5: Already Below Target
```
If Current % < R:
  S = 0 (cannot skip any)
  Calculate C using formula
```

### Case 6: Already Above Target
```
If Current % ≥ R:
  Calculate S using formula
  C = 0 (no need to catch up)
```

## Implementation

### TypeScript/JavaScript

```javascript
class SkipCalculator {
  static calculateSkippable(attended, total, targetPercentage = 75) {
    // Edge cases
    if (total === 0) return 0;
    if (attended < 0 || total < 0) return 0;
    if (targetPercentage <= 0 || targetPercentage > 100) return 0;
    if (attended > total) attended = total;

    const currentPercentage = (attended / total) * 100;
    
    // If already below target, cannot skip
    if (currentPercentage < targetPercentage) {
      return 0;
    }

    // S = floor((100A - R×T) / R)
    const skippable = Math.floor(
      (100 * attended - targetPercentage * total) / targetPercentage
    );

    return Math.max(0, skippable);
  }

  static calculateRequired(attended, total, targetPercentage = 75) {
    // Edge cases
    if (total === 0) return 0;
    if (attended < 0 || total < 0) return 0;
    if (targetPercentage <= 0 || targetPercentage > 100) return 0;
    if (attended > total) attended = total;

    const currentPercentage = (attended / total) * 100;
    
    // If already at or above target, no classes required
    if (currentPercentage >= targetPercentage) {
      return 0;
    }

    // Handle edge case where target is 100%
    if (targetPercentage === 100) {
      return total - attended;
    }

    // C = ceil((R×T - 100A) / (100 - R))
    const numerator = targetPercentage * total - 100 * attended;
    const denominator = 100 - targetPercentage;
    const required = Math.ceil(numerator / denominator);

    return Math.max(0, required);
  }
}
```

## Testing

### Test Cases for Skippable Classes

| Attended | Total | Target | Expected | Current % | Explanation |
|----------|-------|--------|----------|-----------|-------------|
| 18 | 20 | 75 | 4 | 90% | Can skip 4 classes |
| 15 | 20 | 75 | 0 | 75% | Exactly at target |
| 14 | 20 | 75 | 0 | 70% | Below target |
| 0 | 0 | 75 | 0 | N/A | No classes yet |
| 20 | 20 | 75 | 6 | 100% | Perfect attendance |
| 28 | 30 | 80 | 4 | 93.33% | Higher target |

### Test Cases for Required Classes

| Attended | Total | Target | Expected | Current % | Explanation |
|----------|-------|--------|----------|-----------|-------------|
| 12 | 20 | 75 | 12 | 60% | Need 12 classes |
| 15 | 20 | 75 | 0 | 75% | Exactly at target |
| 8 | 20 | 75 | 28 | 40% | Very low attendance |
| 0 | 10 | 75 | 30 | 0% | No attendance yet |
| 18 | 20 | 75 | 0 | 90% | Above target |
| 10 | 20 | 80 | 30 | 50% | Higher target |

## Conclusion

The skip-class calculator uses simple yet powerful mathematical formulas to give students precise control over their attendance. The algorithm handles all edge cases gracefully and provides accurate results that students can rely on for planning their class attendance.

The key insight is that we're solving algebraic inequalities to find the boundary conditions where attendance percentage equals or exceeds the target while accounting for future classes that will be either skipped or attended.
