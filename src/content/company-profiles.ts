/**
 * Company profile PDFs. Every PDF in public/company-profiles/ is shown on /company/profiles
 * automatically. Add an entry here (keyed by file name) to give it a proper title, description and
 * language, and to set its position: listed files come first, in this order.
 */
export interface CompanyProfileDetails {
  title: string;
  description?: string;
  /** Shown as a label, e.g. "English". */
  language?: string;
}

export const COMPANY_PROFILE_DETAILS: Record<string, CompanyProfileDetails> = {
  // Example:
  // 'emerge-company-profile-en.pdf': {
  //   title: 'Emerge Company Profile',
  //   description: 'Our capabilities, sourcing network, quality systems and partner brands.',
  //   language: 'English',
  // },
};
