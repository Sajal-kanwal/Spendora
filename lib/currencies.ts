// export type CurrencyOption = {
//     value: string;    // ISO 4217 code
//     label: string;    // Display text for combobox
//     locale: string;   // Locale for formatting
// };

export const Currencies = [
    {
        value: "USD",
        label: "$ US Dollar (USD)",
        locale: "en-US",
    },
    {
        value: "EUR",
        label: "€ Euro (EUR)",
        locale: "de-DE",
    },
    {
        value: "INR",
        label: "₹ Indian Rupee (INR)",
        locale: "en-IN",
    },
    {
        value: "GBP",
        label: "£ British Pound (GBP)",
        locale: "en-GB",
    },
    {
        value: "JPY",
        label: "¥ Japanese Yen (JPY)",
        locale: "ja-JP",
    },
    {
        value: "CAD",
        label: "$ Canadian Dollar (CAD)",
        locale: "en-CA",
    },
    {
        value: "AUD",
        label: "$ Australian Dollar (AUD)",
        locale: "en-AU",
    },
    {
        value: "CNY",
        label: "¥ Chinese Yuan (CNY)",
        locale: "zh-CN",
    },
    {
        value: "CHF",
        label: "₣ Swiss Franc (CHF)",
        locale: "de-CH",
    },

];

export type Currency = typeof Currencies[0];