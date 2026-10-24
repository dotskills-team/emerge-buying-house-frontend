export interface CompanyProfile {
  /** File name without ".pdf"; unique. */
  id: string;
  title: string;
  description?: string;
  language?: string;
  /** Public URL of the PDF. */
  url: string;
  fileName: string;
  bytes: number;
}
