import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { COMPANY_PROFILE_DETAILS, type CompanyProfileDetails } from '@/content/company-profiles';
import type { CompanyProfile } from './types';

const FOLDER = 'company-profiles';

const LANGUAGES: Record<string, string> = {
  en: 'English',
  bn: 'Bangla',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  nl: 'Dutch',
  sv: 'Swedish',
  zh: 'Chinese',
  ja: 'Japanese',
  ar: 'Arabic',
};

/**
 * A readable title and language from a file name, for PDFs without an entry in
 * content/company-profiles.ts: "company_profile_en_0806.pdf" -> "Company Profile", English.
 */
export function describeFileName(fileName: string): CompanyProfileDetails {
  const words = fileName
    .replace(/\.pdf$/i, '')
    .split(/[\s_.-]+/)
    .filter(Boolean);
  const languageWord = words.find((w) => LANGUAGES[w.toLowerCase()]);
  const titleWords = words.filter((w) => w !== languageWord && !/^\d+$/.test(w));
  const title = titleWords.map((w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return {
    title: title || 'Company Profile',
    language: languageWord ? LANGUAGES[languageWord.toLowerCase()] : undefined,
  };
}

/**
 * Every PDF in public/company-profiles, read when the page is built. Files with details in
 * content/company-profiles.ts come first, in that order; the rest follow by name.
 */
export function listCompanyProfiles(): CompanyProfile[] {
  const dir = path.join(process.cwd(), 'public', FOLDER);
  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => /\.pdf$/i.test(f));
  } catch {
    return [];
  }
  const order = Object.keys(COMPANY_PROFILE_DETAILS);
  const rank = (f: string) => {
    const i = order.indexOf(f);
    return i === -1 ? order.length : i;
  };
  return files
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    .map((fileName) => {
      const details: CompanyProfileDetails =
        COMPANY_PROFILE_DETAILS[fileName] ?? describeFileName(fileName);
      return {
        id: fileName.replace(/\.pdf$/i, ''),
        title: details.title,
        description: details.description,
        language: details.language,
        url: `/${FOLDER}/${encodeURIComponent(fileName)}`,
        fileName,
        bytes: statSync(path.join(dir, fileName)).size,
      };
    });
}
