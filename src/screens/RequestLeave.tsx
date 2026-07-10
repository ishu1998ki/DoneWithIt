import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import IonIcon from '@react-native-vector-icons/ionicons';

// ---- Types --------------------------------------------------------------

type LeaveType = 'Annual' | 'Casual' | 'Medical';

// ---- Mock data (swap for your API / auth context) -----------------------

// Remaining balance per leave type, used to preview "days remaining after this request".
const LEAVE_BALANCES: Record<LeaveType, number> = {
  Annual: 9,
  Casual: 4,
  Medical: 6,
};

const LEAVE_TYPES: LeaveType[] = ['Annual', 'Casual', 'Medical'];

// ---- Date helpers --------------------------------------------------------

const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function formatDate(date: Date) {
  return `${MONTH_LABELS[date.getMonth()].slice(0, 3)} ${String(
    date.getDate(),
  ).padStart(2, '0')}, ${date.getFullYear()}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function countWorkingDays(start: Date, end: Date) {
  if (end < start) return 0;
  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

function buildMonthMatrix(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// ---- Lightweight date picker modal (no external deps) -------------------

function DatePickerModal({
  visible,
  initialDate,
  onClose,
  onSelect,
}: {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}) {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  const weeks = useMemo(
    () => buildMonthMatrix(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth],
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
          <View style={styles.monthNav}>
            <TouchableOpacity
              style={styles.navButton}
              activeOpacity={0.7}
              onPress={() =>
                setVisibleMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                )
              }
            >
              <IonIcon name="chevron-back" size={16} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {MONTH_LABELS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
            </Text>
            <TouchableOpacity
              style={styles.navButton}
              activeOpacity={0.7}
              onPress={() =>
                setVisibleMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                )
              }
            >
              <IonIcon name="chevron-forward" size={16} color="#374151" />
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
              {week.map((date, dayIndex) => {
                const inMonth = date.getMonth() === visibleMonth.getMonth();
                const selected = isSameDay(date, initialDate);
                return (
                  <TouchableOpacity
                    key={dayIndex}
                    style={styles.dayCell}
                    activeOpacity={0.6}
                    onPress={() => onSelect(date)}
                  >
                    <View style={selected ? styles.daySelected : undefined}>
                      <Text
                        style={[
                          styles.dayCellText,
                          !inMonth && styles.dayCellTextMuted,
                          selected && styles.dayCellTextSelected,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ---- Small building blocks --------------------------------------------

function DateField({
  label,
  date,
  onPress,
}: {
  label: string;
  date: Date;
  onPress: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dateInput}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Text style={styles.dateInputText}>{formatDate(date)}</Text>
        <IonIcon name="calendar-outline" size={16} color="#8A93A6" />
      </TouchableOpacity>
    </View>
  );
}

// ---- Main screen --------------------------------------------------------

const RequestLeave = () => {
  const navigation = useNavigation();

  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState(new Date(2026, 4, 6)); // May 6, 2026
  const [endDate, setEndDate] = useState(new Date(2026, 4, 8)); // May 8, 2026
  const [reason, setReason] = useState('');
  const [pickerOpen, setPickerOpen] = useState<'start' | 'end' | null>(null);

  const workingDays = useMemo(
    () => countWorkingDays(startDate, endDate),
    [startDate, endDate],
  );

  const remainingBefore = LEAVE_BALANCES[leaveType];
  const remainingAfter = Math.max(remainingBefore - workingDays, 0);

  const handleSelectDate = (date: Date) => {
    if (pickerOpen === 'start') {
      setStartDate(date);
      if (date > endDate) setEndDate(date);
    } else if (pickerOpen === 'end') {
      setEndDate(date);
    }
    setPickerOpen(null);
  };

  const handleSubmit = () => {
    // TODO: call your leave-request API with { leaveType, startDate, endDate, reason }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <IonIcon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Leave</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.fieldLabel}>Leave Type</Text>
        <View style={styles.typeRow}>
          {LEAVE_TYPES.map((type) => {
            const active = type === leaveType;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, active && styles.typeChipActive]}
                activeOpacity={0.7}
                onPress={() => setLeaveType(type)}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    active && styles.typeChipTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.dateRow}>
          <DateField
            label="Start Date"
            date={startDate}
            onPress={() => setPickerOpen('start')}
          />
          <DateField
            label="End Date"
            date={endDate}
            onPress={() => setPickerOpen('end')}
          />
        </View>

        <Text style={styles.workingDaysNote}>
          {workingDays} working day{workingDays === 1 ? '' : 's'} · weekends
          excluded
        </Text>

        <Text style={styles.fieldLabel}>Reason / Notes</Text>
        <TextInput
          style={styles.reasonInput}
          placeholder="Add a short note for your manager"
          placeholderTextColor="#9AA3B2"
          multiline
          value={reason}
          onChangeText={setReason}
        />

        <TouchableOpacity style={styles.attachRow} activeOpacity={0.7}>
          <IonIcon name="cloud-upload-outline" size={18} color="#1F2937" />
          <Text style={styles.attachText}>
            <Text style={styles.attachTextBold}>Tap to attach</Text> a
            document · PDF, PNG, max 5MB
          </Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <IonIcon name="checkmark-circle" size={16} color="#3B5BA9" />
          <Text style={styles.infoBoxText}>
            <Text style={styles.infoBoxBold}>{remainingBefore} days</Text>{' '}
            remaining · will be{' '}
            <Text style={styles.infoBoxBold}>{remainingAfter} days</Text>{' '}
            after this request.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.submitWrap}>
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.85}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>

      <DatePickerModal
        visible={pickerOpen !== null}
        initialDate={pickerOpen === 'start' ? startDate : endDate}
        onClose={() => setPickerOpen(null)}
        onSelect={handleSelectDate}
      />
    </SafeAreaView>
  );
};

export default RequestLeave;

// ---- Styles ---------------------------------------------------------

const NAVY = '#16213E';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  typeChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  typeChipActive: {
    backgroundColor: '#EAF0FB',
    borderColor: NAVY,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeChipTextActive: {
    color: NAVY,
    fontWeight: '700',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateInputText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  workingDaysNote: {
    fontSize: 12,
    color: '#3B5BA9',
    marginBottom: 20,
  },
  reasonInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    minHeight: 110,
    fontSize: 14,
    color: '#1F2937',
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  attachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  attachText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
    flexShrink: 1,
  },
  attachTextBold: {
    fontWeight: '700',
    color: '#111827',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF0FB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoBoxText: {
    fontSize: 12,
    color: '#3B5BA9',
    marginLeft: 8,
    flexShrink: 1,
  },
  infoBoxBold: {
    fontWeight: '700',
  },
  submitWrap: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F4F6FB',
  },
  submitButton: {
    backgroundColor: NAVY,
    borderRadius: 26,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // -- Date picker modal --
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '86%',
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
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 14,
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
    paddingVertical: 4,
  },
  weekdayText: {
    fontSize: 11,
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
  },
  dayCellText: {
    fontSize: 13,
    color: '#1F2937',
    padding: 6,
  },
  dayCellTextMuted: {
    color: '#D6DAE3',
  },
  daySelected: {
    backgroundColor: NAVY,
    borderRadius: 8,
  },
  dayCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});