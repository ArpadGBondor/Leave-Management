export default interface HolidayEntitlement {
  holidayEntitlementBase: number;
  holidayEntitlementAdditional: number; // Contractual additions
  holidayEntitlementMultiplier: number; // Part Time Factor * Service Factor
  holidayEntitlementDeduction: number; // Public Holidays
  holidayEntitlementTotal: number;
}
