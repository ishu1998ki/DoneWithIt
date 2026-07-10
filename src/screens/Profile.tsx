import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import IonIcon from '@react-native-vector-icons/ionicons';

// ---- Types -----------------------------------------------------------

type PersonalInfo = {
  email: string;
  mobile: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  dob: string;
  nic: string;
};

type ContractPeriod = {
  id: string;
  title: string;
  period: string;
  status: 'Current' | 'Past';
};

type ProfessionalInfo = {
  designation: string;
  department: string;
  dateJoined: string;
  contractHistory: ContractPeriod[];
};

type ProfileData = {
  name: string;
  role: string;
  team: string;
  employeeId: string;
  personal: PersonalInfo;
  professional: ProfessionalInfo;
};

// ---- Mock data (swap this out for your API / auth context) -----------

const MOCK_PROFILE: ProfileData = {
  name: 'Nimali Perera',
  role: 'Product Designer',
  team: 'Design',
  employeeId: 'EMP-0142',
  personal: {
    email: 'nimali.perera@booleanlab.lk',
    mobile: '+94 77 214 5566',
    address: '24/3 Galle Road, Colombo 06',
    emergencyContactName: 'Kumari Perera',
    emergencyContactPhone: '+94 71 908 2231',
    dob: '14 Sep 1996',
    nic: '966572314V',
  },
  professional: {
    designation: 'Product Designer',
    department: 'Design',
    dateJoined: '06 Feb 2025',
    contractHistory: [
      {
        id: '2',
        title: 'Associate Software Engineer',
        period: 'Period 2 · 06 Feb 2026 – Present',
        status: 'Current',
      },
      {
        id: '1',
        title: 'Associate Software Engineer',
        period: 'Period 1 · 06 Feb 2025 – 05 Feb 2026',
        status: 'Past',
      },
    ],
  },
};

// ---- Small building blocks --------------------------------------------

function getInitials(fullName: string) {
  const parts = fullName.trim().split(' ');
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof IonIcon>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <IonIcon name={icon} size={18} color="#3B5BA9" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// ---- Tab content --------------------------------------------------------

function PersonalTab({ data }: { data: PersonalInfo }) {
  return (
    <View>
      <SectionLabel>Contact Details</SectionLabel>
      <View style={styles.card}>
        <InfoRow icon="mail-outline" label="Email" value={data.email} />
        <Divider />
        <InfoRow icon="call-outline" label="Mobile" value={data.mobile} />
        <Divider />
        <InfoRow
          icon="location-outline"
          label="Address"
          value={data.address}
        />
        <Divider />
        <InfoRow
          icon="person-outline"
          label="Emergency Contact"
          value={`${data.emergencyContactName} · ${data.emergencyContactPhone}`}
        />
      </View>

      <SectionLabel>Personal Info</SectionLabel>
      <View style={styles.card}>
        <InfoRow
          icon="calendar-outline"
          label="Date of Birth"
          value={data.dob}
        />
        <Divider />
        <InfoRow icon="card-outline" label="NIC Number" value={data.nic} />
      </View>
    </View>
  );
}

function ContractHistoryRow({ item }: { item: ContractPeriod }) {
  const isCurrent = item.status === 'Current';
  return (
    <View style={styles.contractRow}>
      <View style={styles.contractIconWrap}>
        <IonIcon name="card-outline" size={18} color="#1F9D6B" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.contractTitle}>{item.title}</Text>
        <Text style={styles.contractPeriod}>{item.period}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          isCurrent ? styles.statusBadgeCurrent : styles.statusBadgePast,
        ]}
      >
        <Text
          style={[
            styles.statusBadgeText,
            isCurrent
              ? styles.statusBadgeTextCurrent
              : styles.statusBadgeTextPast,
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );
}

function ProfessionalTab({
  data,
  onEdit,
  onLogPastPeriod,
  onRenewContract,
}: {
  data: ProfessionalInfo;
  onLogPastPeriod?: () => void;
  onRenewContract?: () => void;
}) {
  return (
    <View>
      <View style={styles.sectionHeaderRow}>
        <SectionLabel>Professional Details</SectionLabel>
      </View>

      <View style={styles.stackedCards}>
        <View style={styles.miniCard}>
          <InfoRow
            icon="briefcase-outline"
            label="Designation"
            value={data.designation}
          />
        </View>
        <View style={styles.miniCard}>
          <InfoRow
            icon="person-outline"
            label="Department"
            value={data.department}
          />
        </View>
        <View style={styles.miniCard}>
          <InfoRow
            icon="calendar-outline"
            label="Date Joined"
            value={data.dateJoined}
          />
        </View>
      </View>

      <SectionLabel>Contract History</SectionLabel>

      <View style={styles.contractCard}>
        {data.contractHistory.map((item, index) => (
          <View key={item.id}>
            <ContractHistoryRow item={item} />
            {index < data.contractHistory.length - 1 && <Divider />}
          </View>
        ))}
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

// ---- Main screen --------------------------------------------------------

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'professional'>(
    'personal',
  );
  const data = MOCK_PROFILE;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(data.name)}</Text>
          </View>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.roleText}>
            {data.role} · {data.team}
          </Text>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>{data.employeeId}</Text>
          </View>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('personal')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'personal' && styles.tabTextActive,
              ]}
            >
              Personal
            </Text>
            {activeTab === 'personal' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('professional')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'professional' && styles.tabTextActive,
              ]}
            >
              Professional
            </Text>
            {activeTab === 'professional' && (
              <View style={styles.tabIndicator} />
            )}
          </TouchableOpacity>
        </View>

        {/* Tab content */}
        <View style={styles.body}>
          {activeTab === 'personal' ? (
            <PersonalTab data={data.personal} />
          ) : (
            <ProfessionalTab
              data={data.professional}
              onEdit={() => {
                // TODO: navigate to an edit-professional-details screen
              }}
              onLogPastPeriod={() => {
                // TODO: open a "log past contract period" form/modal
              }}
              onRenewContract={() => {
                // TODO: open a "renew contract" form/modal
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

// ---- Styles ---------------------------------------------------------

const NAVY = '#16213E';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NAVY,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: NAVY,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 4,
  },
  roleText: {
    color: '#9FB3E8',
    fontSize: 13,
    marginBottom: 12,
  },
  idBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  idBadgeText: {
    color: '#D7E1FA',
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 18,
    paddingHorizontal: 24,
  },
  tabItem: {
    marginRight: 28,
    paddingBottom: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#9AA3B2',
    fontWeight: '500',
  },
  tabTextActive: {
    color: NAVY,
    fontWeight: '700',
  },
  tabIndicator: {
    marginTop: 8,
    height: 2,
    width: '100%',
    backgroundColor: NAVY,
    borderRadius: 1,
  },
  body: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 32,
    flex: 1,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#F7F9FC',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E7ECFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8A93A6',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E7E9EF',
    marginLeft: 46,
  },

  // -- Professional tab --
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B5BA9',
    marginTop: 20,
  },
  stackedCards: {
    gap: 10,
  },
  miniCard: {
    backgroundColor: '#F7F9FC',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  contractActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#D7DAE2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  primaryOutlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#3B5BA9',
    backgroundColor: '#EAF0FB',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  primaryOutlineButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B5BA9',
  },
  contractCard: {
    backgroundColor: '#F7F9FC',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  contractRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  contractIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DFF5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contractTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  contractPeriod: {
    fontSize: 12,
    color: '#8A93A6',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeCurrent: {
    backgroundColor: '#DFF5E9',
  },
  statusBadgePast: {
    backgroundColor: '#EEF0F4',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadgeTextCurrent: {
    color: '#1F9D6B',
  },
  statusBadgeTextPast: {
    color: '#6B7280',
  },
});