import Image from 'next/image';
import type { ClientLogo } from '@/content/clients';

/** One client logo on a white tile, shown in colour on hover. */
export function ClientLogoTile({ client }: { client: ClientLogo }) {
  return (
    <div className="border-border flex h-20 items-center justify-center rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:h-24 sm:rounded-2xl sm:p-5 lg:h-28">
      <div className="relative h-full w-full">
        <Image
          src={client.logo}
          alt={client.name}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 25vw, 45vw"
          className="object-contain grayscale transition-[filter] duration-500 hover:grayscale-0"
        />
      </div>
    </div>
  );
}
