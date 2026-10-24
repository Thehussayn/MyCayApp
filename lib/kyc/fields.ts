export const biodataSteps = [
  {
    title: "Personal details",
    fields: [
      { key: "fullName", label: "Full legal name" },
      { key: "dob", label: "Date of birth", type: "date" },
      {
        key: "gender",
        label: "Gender",
        options: ["Male", "Female", "Prefer not to say"],
      },
      { key: "nationality", label: "Nationality" },
      { key: "stateOfOrigin", label: "State of origin" },
      {
        key: "maritalStatus",
        label: "Marital status",
        options: [
          "Single",
          "Married",
          "Divorced",
          "Widowed",
          "Prefer not to say",
        ],
      },
    ],
  },
  {
    title: "Contact details",
    fields: [
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Phone", type: "tel" },
      { key: "residentialAddress", label: "Residential address" },
      { key: "city", label: "City" },
      { key: "stateProvince", label: "State / province" },
      { key: "country", label: "Country" },
      { key: "postalCode", label: "Postal code" },
    ],
  },
  {
    title: "Identification",
    fields: [
      {
        key: "idType",
        label: "Identification type",
        options: ["NIN", "International Passport", "Driver Licence"],
      },
      { key: "idNumber", label: "ID number" },
      { key: "issueDate", label: "Issue date (optional)", type: "date" },
      { key: "expiryDate", label: "Expiry date", type: "date" },
      { key: "issuingAuthority", label: "Issuing authority (optional)" },
    ],
  },
  {
    title: "Occupation",
    fields: [
      {
        key: "employmentStatus",
        label: "Employment status",
        options: [
          "Employed",
          "Self-Employed / Business Owner",
          "Unemployed",
          "Retired",
          "Student",
          "Other",
        ],
      },
      { key: "employerName", label: "Employer / business name" },
      { key: "jobTitle", label: "Job title" },
      { key: "businessAddress", label: "Business address (optional)" },
    ],
  },
  {
    title: "Next of kin",
    fields: [
      { key: "nokFullName", label: "Full name" },
      {
        key: "nokRelationship",
        label: "Relationship",
        options: [
          "Spouse",
          "Parent",
          "Child",
          "Sibling",
          "Extended Family",
          "Friend",
          "Other",
        ],
      },
      { key: "nokPhone", label: "Phone", type: "tel" },
      { key: "nokAddress", label: "Address" },
    ],
  },
  {
    title: "Bank details",
    fields: [
      { key: "bankCode", label: "Bank" },
      { key: "accountHolderName", label: "Account holder name" },
      { key: "accountNumber", label: "Account number" },
      {
        key: "accountType",
        label: "Account type",
        options: ["Current Account", "Savings Account", "Other"],
      },
    ],
  },
  { title: "Review & sign", fields: [] },
] as {
  title: string;
  fields: { key: string; label: string; type?: string; options?: string[] }[];
}[];
