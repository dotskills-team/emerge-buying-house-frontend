import type { StaticImageData } from 'next/image';
// Logos are trimmed of their blank margins so each one fills its tile (see assets/clients).
import brandFsbn from '@/assets/clients/7-trim.png';
import brandRedtag from '@/assets/clients/8-trim.png';
import brandZudio from '@/assets/clients/9-trim.png';
import brandCherokee from '@/assets/clients/10-trim.png';
import brandBrooklyn from '@/assets/clients/11-trim.png';
import brandBrothers from '@/assets/clients/12.jpg';
import brandOvs from '@/assets/clients/13-trim.png';
import brandEsmara from '@/assets/clients/14-trim.png';
import brandFirefly from '@/assets/clients/15-trim.png';
import brandLeeCooper from '@/assets/clients/16-trim.png';
import brandPiazzaItalia from '@/assets/clients/17-trim.png';

export interface ClientLogo {
  name: string;
  logo: StaticImageData;
}

/** Client logos supplied by the client, shown on the home page and the clients page. */
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'FSBN', logo: brandFsbn },
  { name: 'Redtag', logo: brandRedtag },
  { name: 'Zudio', logo: brandZudio },
  { name: 'Cherokee', logo: brandCherokee },
  { name: 'Brooklyn New York', logo: brandBrooklyn },
  { name: 'Brothers Clothing Co.', logo: brandBrothers },
  { name: 'OVS', logo: brandOvs },
  { name: 'Esmara', logo: brandEsmara },
  { name: 'Firefly', logo: brandFirefly },
  { name: 'Lee Cooper', logo: brandLeeCooper },
  { name: 'Piazza Italia', logo: brandPiazzaItalia },
];
