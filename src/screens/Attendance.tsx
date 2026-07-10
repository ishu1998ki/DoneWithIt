import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import IonIcon from '@react-native-vector-icons/ionicons';

// ---- Types --------------------------------------------------------------

type DayStatus = 'full-day' | 'leave' | 'holiday';

type DayCell = {
  date: Date;
  day: number;
  inCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  status?: DayStatus;
};

type SummaryRow = {
  label: string;
  value: string;
  unit?: string;
};

type SummarySection = {
  id: string;
  heading: string;
  dotColor: string;
  rows: SummaryRow[];
};

// ---- Mock data (swap for your API) -----------------------------------

const OFFICE_NAME = 'Colombo office';

// Demo "today" so the sample data lines up with the screenshot.
// Replace with `new Date()` once real attendance data is wired in.
const DEMO_TODAY = new Date(2026, 4, 20); // May 20, 2026

const DAY_STATUS: Record<string, DayStatus> = {
  '2026-05-07': 'holiday',
  '2026-05-21': 'holiday',
  '2026-05-22': 'holiday',
  '2026-05-29': 'holiday',
};

const SUMMARY_SECTIONS: SummarySection[] = [
  {
    id: 'days',
    heading: 'DAYS',
    dotColor: '#3B5BA9',
    rows: [
      { label: 'Working Days', value: '17' },
      { label: 'Total Worked Days', value: '16' },
    ],
  },
  {
    id: 'payable',
    heading: 'PAYABLE',
    dotColor: '#1F9D6B',
    rows: [
      { label: 'Payable Hours', value: '64', unit: 'H' },
      { label: 'Payable Days', value: '8' },
    ],
  },
  {
    id: 'off-days',
    heading: 'OFF DAYS',
    dotColor: '#D97706',
    rows: [
      { label: 'Worked Hours (Off Days)', value: '34', unit: 'H' },
      { label: 'Worked Days (Off Days)', value: '5' },
    ],
  },
];

// ---- Helpers --------------------------------------------------------

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthMatrix(year: number, month: number, today: Date): DayCell[][] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  const weeks: DayCell[][] = [];
  const cursor = new Date(gridStart);

  for (let w = 0; w < 6; w++) {
    const week: DayCell[] = [];
    for (let d = 0; d < 7; d++) {
      const dateKey = toDateKey(cursor);
      week.push({
        date: new Date(cursor),
        day: cursor.getDate(),
        inCurrentMonth: cursor.getMonth() === month,
        isWeekend: cursor.getDay() === 0 || cursor.getDay() === 6,
        isToday: isSameDay(cursor, today),
        status: DAY_STATUS[dateKey],
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// ---- Small building blocks --------------------------------------------

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function DayCellView({ cell }: { cell: DayCell }) {
  if (cell.isToday) {
    return (
      <View style={[styles.dayCell, styles.dayCellToday]}>
        <Text style={styles.dayCellTodayText}>{cell.day}</Text>
      </View>
    );
  }
  if (cell.status === 'holiday') {
    return (
      <View style={[styles.dayCell, styles.dayCellHoliday]}>
        <Text style={styles.dayCellHolidayText}>{cell.day}</Text>
      </View>
    );
  }
  if (cell.status === 'full-day') {
    return (
      <View style={[styles.dayCell, styles.dayCellFullDay]}>
        <Text style={styles.dayCellFullDayText}>{cell.day}</Text>
      </View>
    );
  }
  if (cell.status === 'leave') {
    return (
      <View style={[styles.dayCell, styles.dayCellLeave]}>
        <Text style={styles.dayCellLeaveText}>{cell.day}</Text>
      </View>
    );
  }

  return (
    <View style={styles.dayCell}>
      <Text
        style={[
          styles.dayCellText,
          cell.isWeekend && styles.dayCellTextWeekend,
          !cell.inCurrentMonth && styles.dayCellTextMuted,
        ]}
      >
        {cell.day}
      </Text>
    </View>
  );
}

function SummarySectionCard({ section }: { section: SummarySection }) {
  return (
    <View style={styles.summarySection}>
      <View style={styles.summaryHeadingRow}>
        <View style={[styles.summaryDot, { backgroundColor: section.dotColor }]} />
        <Text style={styles.summaryHeading}>{section.heading}</Text>
      </View>
      {section.rows.map((row) => (
        <View key={row.label} style={styles.summaryRow}>
          <Text style={styles.summaryRowLabel}>{row.label}</Text>
          <Text style={styles.summaryRowValue}>
            {row.value}
            {row.unit ? <Text style={styles.summaryRowUnit}>{row.unit}</Text> : null}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ---- Main screen --------------------------------------------------------

const Attendance = () => {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(DEMO_TODAY.getFullYear(), DEMO_TODAY.getMonth(), 1),
  );

  const weeks = useMemo(
    () =>
      buildMonthMatrix(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        DEMO_TODAY,
      ),
    [visibleMonth],
  );

  const goToPreviousMonth = () => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Attendance</Text>
        <Text style={styles.subtitle}>{OFFICE_NAME}</Text>

        <View style={styles.calendarCard}>
          <View style={styles.monthNav}>
            <TouchableOpacity
              style={styles.navButton}
              activeOpacity={0.7}
              onPress={goToPreviousMonth}
            >
              <IonIcon name="chevron-back" size={18} color="#374151" />
            </TouchableOpacity>

            <Text style={styles.monthLabel}>
              {MONTH_LABELS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
            </Text>

            <TouchableOpacity
              style={styles.navButton}
              activeOpacity={0.7}
              onPress={goToNextMonth}
            >
              <IonIcon name="chevron-forward" size={18} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((label, index) => (
              <View key={index} style={styles.weekdayCell}>
                <Text style={styles.weekdayText}>{label}</Text>
              </View>
            ))}
          </View>

          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((cell, dayIndex) => (
                <DayCellView key={dayIndex} cell={cell} />
              ))}
            </View>
          ))}

          <View style={styles.legendRow}>
            <LegendDot color="#1F9D6B" label="Full day" />
            <LegendDot color="#DC2626" label="Leave" />
            <LegendDot color="#2DB6A3" label="Holiday" />
            <LegendDot color="#9CA3AF" label="Weekend" />
          </View>
        </View>

        <Text style={styles.sectionHeading}>Attendance Summary</Text>
        <View style={styles.summaryCard}>
          {SUMMARY_SECTIONS.map((section, index) => (
            <View key={section.id}>
              <SummarySectionCard section={section} />
              {index < SUMMARY_SECTIONS.length - 1 && (
                <View style={styles.summaryDivider} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Attendance;

// ---- Styles ---------------------------------------------------------

const NAVY = '#16213E';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 16,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  weekdayText: {
    fontSize: 12,
    color: '#9AA3B2',
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayCellText: {
    fontSize: 13,
    color: '#1F2937',
  },
  dayCellTextWeekend: {
    color: '#B0B6C3',
  },
  dayCellTextMuted: {
    color: '#D6DAE3',
  },
  dayCellToday: {
    backgroundColor: NAVY,
    borderRadius: 10,
  },
  dayCellTodayText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  dayCellHoliday: {
    backgroundColor: '#DCF3F0',
    borderRadius: 10,
  },
  dayCellHolidayText: {
    color: '#188C7B',
    fontSize: 13,
    fontWeight: '700',
  },
  dayCellFullDay: {
    backgroundColor: '#DFF5E9',
    borderRadius: 10,
  },
  dayCellFullDayText: {
    color: '#1F9D6B',
    fontSize: 13,
    fontWeight: '700',
  },
  dayCellLeave: {
    backgroundColor: '#FBDCE0',
    borderRadius: 10,
  },
  dayCellLeaveText: {
    color: '#C23A4E',
    fontSize: 13,
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 22,
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  summarySection: {
    paddingVertical: 14,
  },
  summaryHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  summaryHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9AA3B2',
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryRowLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  summaryRowValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  summaryRowUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#EEF0F4',
  },
});