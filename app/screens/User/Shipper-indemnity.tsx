import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function CarrierIndemnityScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const INDEMNITY_VERSION = "v1.0";

  const handleAccept = async () => {
    if (!accepted) {
      Alert.alert(
        "Agreement Required",
        "Please read and accept the indemnity agreement to continue."
      );
      return;
    }

    try {
      setLoading(true);

      const acceptedAt = new Date().toISOString();

      router.push({
        pathname: "/screens/Auth/Rider",
        params: {
          indemnityAccepted: "true",
          indemnityAcceptedAt: acceptedAt,
          indemnityVersion: INDEMNITY_VERSION,
        },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to save agreement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[tw`pb-10`, styles.container, {}]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: themeColors.primaryColor,
          },
        ]}
      >
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark" size={32} color="#fff" />
        </View>
        <Text style={styles.headerTitle}>Carrier Indemnity Agreement</Text>
        <Text style={styles.headerSubtitle}>LAS Mobile Logistics Platform</Text>
      </View>
      {/* Important Notice */}
      <View style={styles.notice}>
        <Ionicons name="warning" size={24} color="#D97706" />
        <View style={styles.noticeTextContainer}>
          <Text style={styles.noticeTitle}>Important Legal Document</Text>
          <Text style={styles.noticeText}>
            Please read carefully before proceeding. By accepting, you
            acknowledge understanding all terms.
          </Text>
        </View>
      </View>
      {/* Scrollable Agreement */}
      <View style={styles.agreementContainer}>
        <ScrollView
          style={styles.scrollBox}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <Text
            style={[
              styles.mainTitle,
              {
                borderColor: themeColors.primaryColor,
              },
            ]}
          >
            LAS MOBILE CARRIER INDEMNITY & LIABILITY AGREEMENT
          </Text>

          {/* Section 1 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              1. Communication Protocol
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>
                (i) Official Communication Channels:
              </Text>{" "}
              All connections between carriers and customers/shippers must be
              maintained exclusively through the official LAS Mobile platform
              features, including in-app calls and live chat functionality. This
              ensures proper documentation and dispute resolution capabilities.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Violation may result in account suspension and loss of insurance
                coverage.
              </Text>
            </View>
          </View>

          {/* Section 2 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              2. Personal Contact Information
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(ii) Prohibited Conduct:</Text> Exchange
              of personal phone numbers, email addresses, social media handles,
              or any form of direct contact information with customers/shippers
              outside the LAS Mobile platform is strictly prohibited and
              constitutes a material breach of this agreement.
            </Text>
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                <Text style={styles.bold}>Consequences:</Text> Immediate account
                termination, forfeiture of pending earnings, and potential legal
                action.
              </Text>
            </View>
          </View>

          {/* Section 3 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              3. Service Scope & Platform Integrity
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(iii) Unauthorized Services:</Text> All
              delivery and logistics services must be performed exclusively
              through the LAS Mobile platform. Carriers are prohibited from:
            </Text>
            <Text style={styles.bulletPoint}>
              • Accepting off-platform payments or side jobs
            </Text>
            <Text style={styles.bulletPoint}>
              • Redirecting customers to external services
            </Text>
            <Text style={styles.bulletPoint}>
              • Operating competing logistics services while registered
            </Text>
            <Text style={styles.bulletPoint}>
              • Soliciting customers for personal business
            </Text>
            <Text style={styles.sectionContent}>
              Any such activities will result in immediate termination and may
              incur financial penalties equivalent to 3 months of average
              platform earnings.
            </Text>
          </View>

          {/* Section 4 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              4. Customer Rights & Carrier Obligations
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(iv) Protected Customer Rights:</Text>{" "}
              Customers and shippers retain all rights to:
            </Text>
            <Text style={styles.bulletPoint}>
              • Cancel orders according to platform policy
            </Text>
            <Text style={styles.bulletPoint}>
              • Request refunds for undelivered or damaged items
            </Text>
            <Text style={styles.bulletPoint}>
              • Rate and review carrier performance
            </Text>
            <Text style={styles.bulletPoint}>
              • Report violations to LAS Mobile support
            </Text>
            <Text style={styles.bulletPoint}>
              • Receive compensation for platform failures or carrier negligence
            </Text>
            <Text style={styles.sectionContent}>
              Carriers must respect these rights and cooperate fully with
              customer service investigations.
            </Text>
          </View>

          {/* Section 5 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              5. Insurance Coverage Exclusions
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(v) Excluded Items & Activities:</Text>{" "}
              LAS Mobile insurance coverage explicitly excludes:
            </Text>
            <Text style={styles.bulletPoint}>
              • Illegal goods, contraband, or prohibited substances
            </Text>
            <Text style={styles.bulletPoint}>
              • Firearms, ammunition, or explosive materials
            </Text>
            <Text style={styles.bulletPoint}>
              • Hazardous chemicals or biological materials
            </Text>
            <Text style={styles.bulletPoint}>
              • Currency exceeding ₦500,000 or precious metals/stones
            </Text>
            <Text style={styles.bulletPoint}>
              • Items not declared on the manifest
            </Text>
            <Text style={styles.bulletPoint}>
              • Perishable goods without proper packaging
            </Text>
            <Text style={styles.sectionContent}>
              Carriers found transporting excluded items will face immediate
              termination and potential criminal prosecution.
            </Text>
          </View>

          {/* Section 6 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              6. Documentation Requirements
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(vi) Mandatory Documentation:</Text> All
              registered carriers must maintain and provide upon request:
            </Text>
            <Text style={styles.bulletPoint}>
              • Valid government-issued identification (National ID, Driver's
              License, or International Passport)
            </Text>
            <Text style={styles.bulletPoint}>
              • Current vehicle registration and roadworthiness certificate (for
              vehicle-based carriers)
            </Text>
            <Text style={styles.bulletPoint}>
              • Valid driver's license (appropriate category)
            </Text>
            <Text style={styles.bulletPoint}>
              • Proof of address (utility bill or bank statement, not older than
              3 months)
            </Text>
            <Text style={styles.bulletPoint}>
              • Tax Identification Number (TIN)
            </Text>
            <Text style={styles.bulletPoint}>
              • Criminal background check clearance
            </Text>
            <Text style={styles.sectionContent}>
              Failure to maintain current documentation will result in account
              suspension until compliance is achieved.
            </Text>
          </View>

          {/* Section 7 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              7. Third-Party Insurance Coverage
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(vii) Basic Coverage Limits:</Text>{" "}
              Standard THIRD PARTY INSURANCE coverage provided through LAS
              Mobile is limited to:
            </Text>
            <View style={styles.coverageBox}>
              <Text style={styles.coverageAmount}>₦500,000</Text>
              <Text style={styles.coverageLabel}>
                Maximum Coverage per Incident
              </Text>
            </View>
            <Text style={styles.sectionContent}>This coverage includes:</Text>
            <Text style={styles.bulletPoint}>
              • Property damage to third parties
            </Text>
            <Text style={styles.bulletPoint}>
              • Bodily injury to third parties
            </Text>
            <Text style={styles.bulletPoint}>• Legal liability claims</Text>
            <Text style={styles.sectionContent}>
              Deductible: ₦50,000 per claim. Carriers are responsible for the
              deductible amount.
            </Text>
          </View>

          {/* Section 8 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              8. Comprehensive Insurance Coverage
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(viii) Premium Coverage Limits:</Text>{" "}
              Enhanced COMPREHENSIVE INSURANCE coverage (optional upgrade) is
              limited to:
            </Text>
            <View style={styles.coverageBoxPremium}>
              <Text style={styles.coverageAmount}>₦10,000,000</Text>
              <Text style={styles.coverageLabel}>
                Maximum Coverage per Incident
              </Text>
            </View>
            <Text style={styles.sectionContent}>
              This comprehensive coverage includes:
            </Text>
            <Text style={styles.bulletPoint}>
              • All third-party coverage benefits
            </Text>
            <Text style={styles.bulletPoint}>
              • Cargo/goods in transit (up to ₦5,000,000)
            </Text>
            <Text style={styles.bulletPoint}>
              • Vehicle damage (own vehicle)
            </Text>
            <Text style={styles.bulletPoint}>
              • Personal accident coverage for carrier
            </Text>
            <Text style={styles.bulletPoint}>• Theft and hijacking</Text>
            <Text style={styles.bulletPoint}>• Fire and natural disasters</Text>
            <Text style={styles.sectionContent}>
              Deductible: ₦100,000 per claim. Monthly premium: ₦15,000 (deducted
              from earnings automatically).
            </Text>
          </View>

          {/* Section 9 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              9. Claims Process & Requirements
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(ix) Mandatory Claims Procedure:</Text>{" "}
              All insurance claims must be:
            </Text>
            <Text style={styles.bulletPoint}>
              • Reported within 24 hours of incident occurrence
            </Text>
            <Text style={styles.bulletPoint}>
              • Processed exclusively through LAS Mobile Support Agents
              (contact: support@lasmobile.ng or in-app support)
            </Text>
            <Text style={styles.bulletPoint}>
              • Accompanied by complete documentation (photos, police report if
              applicable, witness statements)
            </Text>
            <Text style={styles.bulletPoint}>
              • Submitted with GPS data and trip manifest from the platform
            </Text>
            <Text style={styles.sectionContent}>
              Claims not reported through official channels or lacking proper
              documentation will be automatically denied. Processing time: 14-30
              business days.
            </Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Emergency Claims Hotline: +234 700 LAS MOBILE (527 6624)
              </Text>
            </View>
          </View>

          {/* Section 10 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              10. Additional Terms & Conditions
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(x) Supplementary Provisions:</Text>
            </Text>
            <Text style={styles.bulletPoint}>
              • All standard exclusions, limitations, and disclaimers provided
              by our insurance underwriting partners apply in full force
            </Text>
            <Text style={styles.bulletPoint}>
              • Coverage may be denied for incidents occurring while carrier was
              in violation of platform policies
            </Text>
            <Text style={styles.bulletPoint}>
              • Fraudulent claims will result in permanent ban and criminal
              prosecution
            </Text>
            <Text style={styles.bulletPoint}>
              • LAS Mobile reserves the right to modify insurance terms with 30
              days written notice
            </Text>
            <Text style={styles.bulletPoint}>
              • Carriers must cooperate fully with insurance investigations
            </Text>
            <Text style={styles.bulletPoint}>
              • Subrogation rights are retained by insurance providers
            </Text>
          </View>

          {/* Section 11 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              11. Liability & Indemnification
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(xi) Carrier Liability:</Text> By
              accepting this agreement, you acknowledge and agree that:
            </Text>
            <Text style={styles.bulletPoint}>
              • You are an independent contractor, not an employee of LAS Mobile
            </Text>
            <Text style={styles.bulletPoint}>
              • You assume all risks associated with delivery operations
            </Text>
            <Text style={styles.bulletPoint}>
              • You indemnify and hold harmless LAS Mobile, its officers,
              employees, and agents from any claims, damages, or liabilities
              arising from your negligence or willful misconduct
            </Text>
            <Text style={styles.bulletPoint}>
              • You are responsible for maintaining your own health, vehicle,
              and equipment insurance
            </Text>
            <Text style={styles.bulletPoint}>
              • You will comply with all applicable traffic laws, regulations,
              and safety standards
            </Text>
          </View>

          {/* Section 12 */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: themeColors.primaryColor,
                },
              ]}
            >
              12. Dispute Resolution
            </Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.bold}>(xii) Resolution Process:</Text> Any
              disputes arising from this agreement shall be resolved through:
            </Text>
            <Text style={styles.bulletPoint}>
              1. Initial mediation through LAS Mobile Support (mandatory first
              step)
            </Text>
            <Text style={styles.bulletPoint}>
              2. Binding arbitration under Nigerian Arbitration and Conciliation
              Act (if mediation fails)
            </Text>
            <Text style={styles.bulletPoint}>
              3. Legal proceedings in Lagos State Courts (as last resort)
            </Text>
            <Text style={styles.sectionContent}>
              This agreement shall be governed by the laws of the Federal
              Republic of Nigeria.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Last Updated: December 22, 2025
            </Text>
            <Text style={styles.footerText}>
              Version 1.0 - LAS Mobile Carrier Agreement
            </Text>
          </View>
        </ScrollView>
      </View>
      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setAccepted(!accepted)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, , accepted && styles.checked]}>
          {accepted && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        <Text style={styles.checkboxText}>
          I have read, understood, and agree to be bound by the LAS Mobile
          Carrier Indemnity Agreement and all Terms & Conditions outlined above.
        </Text>
      </TouchableOpacity>
      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: themeColors.primaryColor,
          },
          ,
          !accepted && styles.buttonDisabled,
        ]}
        disabled={!accepted || loading}
        onPress={handleAccept}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>Accept & Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
      {/* Help Link
      <TouchableOpacity style={styles.helpLink}>
        <Ionicons name="help-circle-outline" size={20} color="#0A84FF" />
        <Text style={styles.helpText}>
          Need help understanding this agreement?
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIcon: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#E0E7FF",
  },
  notice: {
    flexDirection: "row",
    backgroundColor: "#FEF3C7",
    borderLeftWidth: 4,
    borderLeftColor: "#D97706",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  noticeTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 12,
    color: "#78350F",
    lineHeight: 18,
  },
  agreementContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  scrollBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    padding: 20,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "center",
    borderBottomWidth: 2,
    paddingBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A84FF",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: "#374151",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "700",
    color: "#1F2937",
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
    marginLeft: 8,
    marginBottom: 4,
  },
  warningBox: {
    backgroundColor: "#EFF6FF",
    borderLeftWidth: 3,
    borderLeftColor: "#0A84FF",
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    color: "#1E3A8A",
    fontStyle: "italic",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderLeftWidth: 3,
    borderLeftColor: "#DC2626",
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#7F1D1D",
  },
  coverageBox: {
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 12,
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  coverageBoxPremium: {
    backgroundColor: "#D1FAE5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 12,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  coverageAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  coverageLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#F0F9FF",
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#0C4A6E",
    fontWeight: "600",
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  footerContact: {
    fontSize: 11,
    color: "#0A84FF",
    fontWeight: "600",
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#003C7A",
    borderRadius: 6,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#003C7A",
  },
  checkboxText: {
    fontSize: 13,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#0A84FF",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  helpLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  helpText: {
    fontSize: 13,
    color: "#0A84FF",
    marginLeft: 6,
    fontWeight: "600",
  },
});
