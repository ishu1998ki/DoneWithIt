import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import IonIcon from '@react-native-vector-icons/ionicons';

// ---- Types --------------------------------------------------------------

type LeaveBalance = {
  id: string;
  label: string;
  used: number;
  total: number;
};

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

type LeaveRequest = {
  id: string;
  type: string;
  dateRange: string;
  duration: string;
  status: LeaveStatus;
};

// ---- Mock data (swap for your API) -----------------------------------

const YEAR = 2026;
const EMPLOYEE_NAME = 'Nimali Perera';

const LEAVE_BALANCES: LeaveBalance[] = [
  { id: 'annual', label: 'Annual Leave', used: 9, total: 14 },
  { id: 'casual', label: 'Casual Leave', used: 4, total: 7 },
  { id: 'medical', label: 'Medical Leave', used: 6, total: 7 },
];

const RECENT_REQUESTS: LeaveRequest[] = [
  {
    id: '1',
    type: 'Annual Leave',
    dateRange: 'May 06 – May 08',
    duration: '3 days',
    status: 'Pending',
  },
  {
    id: '2',
    type: 'Medical Leave',
    dateRange: 'Apr 14',
    duration: '1 day',
    status: 'Approved',
  },
  {
    id: '3',
    type: 'Casual Leave',
    dateRange: 'Mar 30 – Mar 31',
    duration: '2 days',
    status: 'Approved',
  },
  {
    id: '4',
    type: 'Annual Leave',
    dateRange: 'Mar 02 – Mar 06',
    duration: '5 days',
    status: 'Rejected',
  },
];

// ---- Small building blocks --------------------------------------------

function LeaveBalanceCard({ balance }: { balance: LeaveBalance }) {
  const left = balance.total - balance.used;
  const progress = Math.min(balance.used / balance.total, 1);

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>{balance.label}</Text>
      <View style={styles.balanceValueRow}>
        <Text style={styles.balanceUsed}>{left}</Text>
        <Text style={styles.balanceTotal}> / {balance.total} left</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

function statusBadgeStyle(status: LeaveStatus) {
  switch (status) {
    case 'Pending':
      return { bg: styles.badgePending, text: styles.badgePendingText };
    case 'Approved':
      return { bg: styles.badgeApproved, text: styles.badgeApprovedText };
    case 'Rejected':
      return { bg: styles.badgeRejected, text: styles.badgeRejectedText };
  }
}

function LeaveRequestRow({
  request,
  isLast,
}: {
  request: LeaveRequest;
  isLast: boolean;
}) {
  const badge = statusBadgeStyle(request.status);

  return (
    <View style={[styles.requestRow, !isLast && styles.requestRowBorder]}>
      <View style={styles.requestIconWrap}>
        <IonIcon name="repeat-outline" size={18} color="#3B5BA9" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.requestType}>{request.type}</Text>
        <Text style={styles.requestMeta}>
          {request.dateRange} · {request.duration}
        </Text>
      </View>
      <View style={[styles.statusBadge, badge.bg]}>
        <Text style={[styles.statusBadgeText, badge.text]}>
          {request.status}
        </Text>
      </View>
    </View>
  );
}

// ---- Main screen --------------------------------------------------------

const Leaves = () => {
   const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>My Leaves</Text>
            <Text style={styles.subtitle}>
              {YEAR} · {EMPLOYEE_NAME}
            </Text>
          </View>
          <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
            <IonIcon name="notifications-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Leave balance */}
        <Text style={styles.sectionHeading}>Leave Balance</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.balanceScrollContent}
        >
          {LEAVE_BALANCES.map((balance) => (
            <LeaveBalanceCard key={balance.id} balance={balance} />
          ))}
        </ScrollView>

        {/* Recent requests */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Recent Requests</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requestCard}>
          {RECENT_REQUESTS.map((request, index) => (
            <LeaveRequestRow
              key={request.id}
              request={request}
              isLast={index === RECENT_REQUESTS.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating action button */}
      <TouchableOpacity 
      style={styles.fab} 
      activeOpacity={0.85}
      onPress={() => navigation.navigate('RequestLeave' as never)}>
        <IonIcon name="add" size={18} color="#FFFFFF" />
        <Text style={styles.fabText}>Request Leave</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Leaves;

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
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#C7862B',
    marginTop: 2,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B5BA9',
    marginBottom: 10,
  },
  balanceScrollContent: {
    paddingRight: 8,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    width: 140,
    marginRight: 10,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  balanceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  balanceUsed: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  balanceTotal: {
    fontSize: 12,
    color: '#9AA3B2',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E7E9EF',
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#22C55E',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  requestRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
  },
  requestIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E7ECFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requestType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  requestMeta: {
    fontSize: 12,
    color: '#8A93A6',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgePending: {
    backgroundColor: '#FBE9D0',
  },
  badgePendingText: {
    color: '#B4700D',
  },
  badgeApproved: {
    backgroundColor: '#DFF5E9',
  },
  badgeApprovedText: {
    color: '#1F9D6B',
  },
  badgeRejected: {
    backgroundColor: '#FBDCE0',
  },
  badgeRejectedText: {
    color: '#C23A4E',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NAVY,
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
});