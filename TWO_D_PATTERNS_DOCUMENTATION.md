# 2D Lottery Special Patterns Documentation

This document explains all the special betting patterns available in the 2D lottery system, their calculations, and how they work.

## Basic Patterns (ပါတ်သီး၊ ထိပ်စီး၊ နောက်ပိတ်၊ ဘရိတ်)

### 1. ပါတ် (Pathee) - Contains Pattern
**Description**: Selects all numbers that contain a specific digit anywhere in the number.

**Calculation**: 
```dart
pathee = numList.where((element) => element.contains(shortNumList[index]));
```

**Example**: 
- If you select "5 ပါတ်", it will include: 05, 15, 25, 35, 45, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 65, 75, 85, 95
- Total: 19 numbers

### 2. ထိပ် (Htite See) - First Digit Pattern
**Description**: Selects all numbers that start with a specific digit.

**Calculation**:
```dart
htiteSee = numList.where((element) => element.startsWith(shortNumList[index]));
```

**Example**:
- If you select "3 ထိပ်", it will include: 30, 31, 32, 33, 34, 35, 36, 37, 38, 39
- Total: 10 numbers

### 3. ပိတ် (Nout Pate) - Last Digit Pattern
**Description**: Selects all numbers that end with a specific digit.

**Calculation**:
```dart
noutPate = numList.where((element) => element.endsWith(shortNumList[index]));
```

**Example**:
- If you select "7 ပိတ်", it will include: 07, 17, 27, 37, 47, 57, 67, 77, 87, 97
- Total: 10 numbers

### 4. ဘရိတ် (Brake) - Sum Pattern
**Description**: Selects numbers where the sum of both digits equals the selected number or selected number + 10.

**Calculation**:
```dart
if (index == 0) {
  brake = ["00"];
} else {
  brake = numList.where((element) {
    int a = int.parse(element.split("").first);
    int b = int.parse(element.split("").last);
    if (a + b == index || a + b == index + 10) {
      return true;
    } else {
      return false;
    }
  });
}
```

**Examples**:
- "0 ဘရိတ်": 00 (special case)
- "5 ဘရိတ်": 05, 14, 23, 32, 41, 50 (sum = 5) + 59, 68, 77, 86, 95 (sum = 15)
- "9 ဘရိတ်": 09, 18, 27, 36, 45, 54, 63, 72, 81, 90 (sum = 9) + 99 (sum = 19)

## Collection Patterns (စုစည်းမှု)

### Even/Odd First/Last Digit Patterns

#### 5. ရှေစုံ (She Soon) - First Digit Even
**Description**: Numbers where the first digit is even (0, 2, 4, 6, 8).

**Calculation**:
```dart
evenFirst = numList.where((element) => int.parse(element.split('').first).isEven);
```

**Example**: 00, 01, 02, ..., 09, 20, 21, ..., 89
**Total**: 50 numbers

#### 6. နောက်စုံ (Nauk Soon) - Last Digit Even
**Description**: Numbers where the last digit is even (0, 2, 4, 6, 8).

**Calculation**:
```dart
evenLast = numList.where((element) => int.parse(element.split('').last).isEven);
```

**Example**: 00, 02, 04, 06, 08, 10, 12, ..., 98
**Total**: 50 numbers

#### 7. ရှေမ (She Ma) - First Digit Odd
**Description**: Numbers where the first digit is odd (1, 3, 5, 7, 9).

**Calculation**:
```dart
oddFirst = numList.where((element) => int.parse(element.split('').first).isOdd);
```

**Example**: 10, 11, 12, ..., 19, 30, 31, ..., 99
**Total**: 50 numbers

#### 8. နောက်မ (Nauk Ma) - Last Digit Odd
**Description**: Numbers where the last digit is odd (1, 3, 5, 7, 9).

**Calculation**:
```dart
oddLast = numList.where((element) => int.parse(element.split('').last).isOdd);
```

**Example**: 01, 03, 05, 07, 09, 11, 13, ..., 99
**Total**: 50 numbers

### Special Combination Patterns

#### 9. အပူး (A Puu) - Double Numbers
**Description**: Numbers where both digits are the same.

**Calculation**:
```dart
aPuu = numList.where((element) =>
    int.parse(element.split('').first) == int.parse(element.split('').last));
```

**Example**: 00, 11, 22, 33, 44, 55, 66, 77, 88, 99
**Total**: 10 numbers

#### 10. စုံစုံ (Soon Soon) - Both Even
**Description**: Numbers where both digits are even.

**Calculation**:
```dart
evenEven = numList.where((element) =>
    int.parse(element.split('').first).isEven &&
    int.parse(element.split('').last).isEven);
```

**Example**: 00, 02, 04, 06, 08, 20, 22, 24, 26, 28, ..., 88
**Total**: 25 numbers

#### 11. မမ (Ma Ma) - Both Odd
**Description**: Numbers where both digits are odd.

**Calculation**:
```dart
oddOdd = numList.where((element) =>
    int.parse(element.split('').first).isOdd &&
    int.parse(element.split('').last).isOdd);
```

**Example**: 11, 13, 15, 17, 19, 31, 33, 35, 37, 39, ..., 99
**Total**: 25 numbers

#### 12. စုံမ (Soon Ma) - Even First, Odd Last
**Description**: Numbers where first digit is even and last digit is odd.

**Calculation**:
```dart
evenOdd = numList.where((element) =>
    int.parse(element.split('').first).isEven &&
    int.parse(element.split('').last).isOdd);
```

**Example**: 01, 03, 05, 07, 09, 21, 23, 25, 27, 29, ..., 89
**Total**: 25 numbers

#### 13. မစုံ (Ma Soon) - Odd First, Even Last
**Description**: Numbers where first digit is odd and last digit is even.

**Calculation**:
```dart
oddEven = numList.where((element) =>
    int.parse(element.split('').first).isOdd &&
    int.parse(element.split('').last).isEven);
```

**Example**: 10, 12, 14, 16, 18, 30, 32, 34, 36, 38, ..., 98
**Total**: 25 numbers

### Mathematical Relationship Patterns

#### 14. ပါ၀ါ (Power) - Plus 5 Pattern
**Description**: Numbers where first digit + 5 = last digit.

**Calculation**:
```dart
power = numList.where((element) {
  int a = int.parse(element.split('').first);
  int b = int.parse(element.split('').last);
  return a + 5 == b;
});
```

**Example**: 05, 16, 27, 38, 49
**Total**: 5 numbers

#### 15. ပါ၀ါ R (Power Reverse) - Minus 5 Pattern
**Description**: Numbers where last digit + 5 = first digit.

**Calculation**:
```dart
powerR = numList.where((element) {
  int a = int.parse(element.split('').first);
  int b = int.parse(element.split('').last);
  return b + 5 == a;
});
```

**Example**: 50, 61, 72, 83, 94
**Total**: 5 numbers

### Fixed Special Patterns

#### 16. နတ်ခတ် (Nat Khat) - Spirit Strike
**Description**: A fixed set of traditionally lucky numbers.

**Calculation**:
```dart
natKet = ['07', '18', '24', '35', '69'];
```

**Numbers**: 07, 18, 24, 35, 69
**Total**: 5 numbers

#### 17. နတ်ခတ် R (Nat Khat Reverse) - Spirit Strike Reverse
**Description**: The reverse of the traditional lucky numbers.

**Calculation**:
```dart
natKetR = ['70', '81', 42', '53', '96'];
```

**Numbers**: 70, 81, 42, 53, 96
**Total**: 5 numbers

## Additional Features

### Range Selection (အလွယ်ရွေးရန်)
The dropdown allows quick selection of number ranges:
- **00-19**: Numbers 00 to 19 (20 numbers)
- **20-39**: Numbers 20 to 39 (20 numbers)  
- **40-59**: Numbers 40 to 59 (20 numbers)
- **60-79**: Numbers 60 to 79 (20 numbers)
- **80-99**: Numbers 80 to 99 (20 numbers)

### Reverse Mode (R)
When the reverse checkbox is enabled:
- Selecting a number automatically adds both the number and its reverse
- Example: Selecting "12" adds both "12" and "21"
- Does not apply to double numbers (11, 22, etc.) as they are the same when reversed

## Implementation Notes

1. **Duplicate Prevention**: The system prevents adding duplicate numbers to the bet list using `firstWhereOrNull`.

2. **Validation**: All pattern selections require a valid amount to be entered first.

3. **State Management**: The `betDetailList` maintains all selected numbers with their corresponding amounts.

4. **UI Feedback**: Selected numbers are visually distinguished and can be removed individually.

This comprehensive pattern system allows players to make strategic bets based on mathematical relationships, traditional beliefs, and statistical preferences in the 2D lottery game.