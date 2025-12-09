export default function calculateHolidayEntitlementTotal(
  holidayEntitlementBase: number,
  holidayEntitlementAdditional: number,
  holidayEntitlementMultiplier: number,
  holidayEntitlementDeduction: number
): number {
  const rawTotal =
    (holidayEntitlementBase + holidayEntitlementAdditional) *
      holidayEntitlementMultiplier -
    holidayEntitlementDeduction;

  // Always round UP to 1 decimal place (0.1)
  return Math.ceil(rawTotal * 10) / 10;
}
