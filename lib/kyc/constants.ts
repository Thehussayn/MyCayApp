export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Federal Capital Territory",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export const COUNTRIES = [
  "Nigeria",
  "United Kingdom",
  "United States",
  "Canada",
  "Ghana",
  "South Africa",
  "Kenya",
  "United Arab Emirates",
  "Germany",
  "France",
  "Australia",
  "Ireland",
  "Netherlands",
  "Switzerland",
  "Qatar",
  "Saudi Arabia",
] as const;

export interface CbnBank {
  code: string;
  name: string;
  shortName: string;
  sampleValidAccount: string; // Known valid NUBAN for demo/testing
}

export const CBN_BANKS: CbnBank[] = [
  { code: "058", name: "Guaranty Trust Bank (GTBank)", shortName: "GTBank", sampleValidAccount: "0123456789" },
  { code: "044", name: "Access Bank Plc", shortName: "Access Bank", sampleValidAccount: "0690000031" },
  { code: "011", name: "First Bank of Nigeria", shortName: "First Bank", sampleValidAccount: "2000000017" },
  { code: "057", name: "Zenith Bank Plc", shortName: "Zenith Bank", sampleValidAccount: "1000000004" },
  { code: "033", name: "United Bank for Africa (UBA)", shortName: "UBA", sampleValidAccount: "1010000002" },
  { code: "039", name: "Stanbic IBTC Bank", shortName: "Stanbic IBTC", sampleValidAccount: "0000000018" },
  { code: "214", name: "First City Monument Bank (FCMB)", shortName: "FCMB", sampleValidAccount: "0123456780" },
  { code: "232", name: "Sterling Bank Plc", shortName: "Sterling Bank", sampleValidAccount: "0010000012" },
  { code: "070", name: "Fidelity Bank Plc", shortName: "Fidelity Bank", sampleValidAccount: "4010000013" },
  { code: "032", name: "Union Bank of Nigeria", shortName: "Union Bank", sampleValidAccount: "0010000005" },
  { code: "035", name: "Wema Bank Plc", shortName: "Wema Bank", sampleValidAccount: "0120000014" },
  { code: "076", name: "Polaris Bank", shortName: "Polaris Bank", sampleValidAccount: "1770000010" },
  { code: "050", name: "Ecobank Nigeria", shortName: "Ecobank", sampleValidAccount: "0010000029" },
  { code: "215", name: "Unity Bank Plc", shortName: "Unity Bank", sampleValidAccount: "0010000036" },
  { code: "301", name: "Jaiz Bank Plc", shortName: "Jaiz Bank", sampleValidAccount: "0001000015" },
  { code: "302", name: "TAJBank", shortName: "TAJBank", sampleValidAccount: "0002000018" },
  { code: "50211", name: "Kuda Microfinance Bank", shortName: "Kuda", sampleValidAccount: "2000000014" },
  { code: "50515", name: "Moniepoint Microfinance Bank", shortName: "Moniepoint", sampleValidAccount: "8000000015" },
  { code: "999992", name: "OPay Digital Services", shortName: "OPay", sampleValidAccount: "8123456789" },
  { code: "999991", name: "PalmPay Nigeria", shortName: "PalmPay", sampleValidAccount: "7012345678" },
];

export const MARITAL_STATUS_OPTIONS = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "Prefer not to say",
] as const;

export const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say"] as const;

export const ID_TYPE_OPTIONS = [
  "NIN",
  "International Passport",
  "Driver Licence",
] as const;

export const EMPLOYMENT_STATUS_OPTIONS = [
  "Employed",
  "Self-Employed / Business Owner",
  "Unemployed",
  "Retired",
  "Student",
  "Other",
] as const;

export const RELATIONSHIP_OPTIONS = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Extended Family",
  "Friend",
  "Other",
] as const;

export const ACCOUNT_TYPE_OPTIONS = [
  "Current Account",
  "Savings Account",
  "Other",
] as const;

// Realistic sample fixture for Development Mode "Dummy Data"
export const DUMMY_INVESTOR_DATA = {
  fullName: "Babatunde Olawale Adeleke",
  dob: "1984-08-14",
  gender: "Male" as const,
  nationality: "Nigeria",
  stateOfOrigin: "Osun",
  maritalStatus: "Married" as const,

  email: "babatunde.adeleke@example.com",
  phone: "+2348035550192",
  residentialAddress: "12 Bishop Aboyade Cole Street, Victoria Island",
  city: "Lagos",
  stateProvince: "Lagos",
  country: "Nigeria",
  postalCode: "101241",

  idType: "NIN" as const,
  idNumber: "12345678901",
  issueDate: "2021-03-15",
  expiryDate: "2031-03-15",
  issuingAuthority: "National Identity Management Commission (NIMC)",

  employmentStatus: "Self-Employed / Business Owner" as const,
  employerName: "Adeleke & Partners Capital Ltd",
  jobTitle: "Managing Director / Real Estate Advisory",
  businessAddress: "Floor 4, Mulliner Towers, 39 Alfred Rewane Road, Ikoyi, Lagos",

  nokFullName: "Folashade Funmilayo Adeleke",
  nokRelationship: "Spouse" as const,
  nokPhone: "+2348024449811",
  nokAddress: "12 Bishop Aboyade Cole Street, Victoria Island, Lagos",

  bankCode: "058",
  bankName: "Guaranty Trust Bank (GTBank)",
  accountHolderName: "Babatunde Olawale Adeleke",
  accountNumber: "0123456789",
  accountType: "Current Account" as const,

  digitalSignature: "Babatunde Olawale Adeleke",
  acceptTerms: true,
  acceptPrivacy: true,
};

export const SAMPLE_MOCK_DOCUMENTS = [
  {
    documentType: "GOVERNMENT_ID" as const,
    fileName: "National_Identity_Slip_Babatunde_Adeleke.pdf",
    fileSize: 1845200,
    mimeType: "application/pdf",
    fileUrl: "/mock-docs/nin_slip_sample.pdf",
    status: "UPLOADED" as const,
  },
  {
    documentType: "PROOF_OF_ADDRESS" as const,
    fileName: "EKEDC_Electricity_Bill_July_2026.pdf",
    fileSize: 924300,
    mimeType: "application/pdf",
    fileUrl: "/mock-docs/proof_of_address_sample.pdf",
    status: "UPLOADED" as const,
  },
  {
    documentType: "SPECIMEN_SIGNATURE" as const,
    fileName: "Specimen_Signature_Babatunde.png",
    fileSize: 452100,
    mimeType: "image/png",
    fileUrl: "/mock-docs/specimen_signature_sample.png",
    status: "UPLOADED" as const,
  },
];
