import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import IonIcon from '@react-native-vector-icons/ionicons';

// ---- Types --------------------------------------------------------------

type DayStatus = 'public-holiday' | 'approved-leave' | 'pending-leave';

type DayCell = {
  date: Date;
  day: number;
  inCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  status?: DayStatus;
};

type Holiday = {
  id: string;
  month: string; // e.g. "APR"
  day: string; // e.g. "13"
  title: string;
  subtitle: string;
};

// ---- Mock data (swap for your API) ---------------------------------

// Demo "today" so the sample data lines up with the screenshot.
// Replace with `new Date()` once you're wiring in real data.
const DEMO_TODAY = new Date(2026, 3, 23); // April 23, 2026

const DAY_STATUS: Record<string, DayStatus> = {
  '2026-04-02': 'approved-leave',
  '2026-04-13': 'public-holiday',
  '2026-04-14': 'public-holiday',
  '2026-04-28': 'pending-leave',
  '2026-04-29': 'pending-leave',
};

const UPCOMING_HOLIDAYS: Holiday[] = [
  {
    id: '1',
    month: 'APR',
    day: '13',
    title: 'Sinhala & Tamil New Year Eve',
    subtitle: 'Public Holiday',
  },
  {
    id: '2',
    month: 'APR',
    day: '14',
    title: 'Sinhala & Tamil New Year',
    subtitle: 'Public Holiday',
  },
  {
    id: '3',
    month: 'MAY',
    day: '01',
    title: 'May Day',
    subtitle: 'Public Holiday',
  },
  {
    id: '4',
    month: 'MAY',
    day: '25',
    title: "Ishari B'Day",
    subtitle: 'Public Holiday',
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
  const startOffset = firstOfMonth.getDay(); // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset);

  const weeks: DayCell[][] = [];
  let cursor = new Date(gridStart);

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

  if (cell.status === 'public-holiday') {
    return (
      <View style={[styles.dayCell, styles.dayCellHoliday]}>
        <Text style={styles.dayCellHolidayText}>{cell.day}</Text>
      </View>
    );
  }
  if (cell.status === 'approved-leave') {
    return (
      <View style={[styles.dayCell, styles.dayCellApproved]}>
        <Text style={styles.dayCellApprovedText}>{cell.day}</Text>
      </View>
    );
  }
  if (cell.status === 'pending-leave') {
    return (
      <View style={[styles.dayCell, styles.dayCellPending]}>
        <Text style={styles.dayCellPendingText}>{cell.day}</Text>
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

function HolidayRow({ holiday, isLast }: { holiday: Holiday; isLast: boolean }) {
  return (
    <View style={[styles.holidayRow, !isLast && styles.holidayRowBorder]}>
      <View style={styles.dateBadge}>
        <Text style={styles.dateBadgeMonth}>{holiday.month}</Text>
        <Text style={styles.dateBadgeDay}>{holiday.day}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.holidayTitle}>{holiday.title}</Text>
        <Text style={styles.holidaySubtitle}>{holiday.subtitle}</Text>
      </View>
    </View>
  );
}

// ---- Main screen --------------------------------------------------------

const Calendar = () => {
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
    setVisibleMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setVisibleMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.subtitle}>Public holidays &amp; your leave</Text>

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
            <LegendDot color="#2DB6A3" label="Public holiday" />
            <LegendDot color="#22C55E" label="Approved leave" />
            <LegendDot color="#F59E0B" label="Pending leave" />
          </View>
          <View style={styles.legendRow}>
            <LegendDot color="#16213E" label="Today" />
          </View>
        </View>

        <Text style={styles.sectionHeading}>Upcoming Holidays</Text>
        <View style={styles.holidayCard}>
          {UPCOMING_HOLIDAYS.map((holiday, index) => (
            <HolidayRow
              key={holiday.id}
              holiday={holiday}
              isLast={index === UPCOMING_HOLIDAYS.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Calendar;

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
    color: '#6B5FD8',
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
  dayCellApproved: {
    backgroundColor: '#DFF5E9',
    borderRadius: 10,
  },
  dayCellApprovedText: {
    color: '#1F9D6B',
    fontSize: 13,
    fontWeight: '700',
  },
  dayCellPending: {
    backgroundColor: '#FBE9D0',
    borderRadius: 10,
  },
  dayCellPendingText: {
    color: '#B4700D',
    fontSize: 13,
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
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
  holidayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
  },
  holidayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  holidayRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
  },
  dateBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#DCF3F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateBadgeMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: '#188C7B',
  },
  dateBadgeDay: {
    fontSize: 15,
    fontWeight: '700',
    color: '#188C7B',
  },
  holidayTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  holidaySubtitle: {
    fontSize: 12,
    color: '#8A93A6',
  },
});