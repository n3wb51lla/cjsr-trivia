import { getEnvStatus } from '../../lib/env';

export function ConfigWarning() {
  const status = getEnvStatus();

  if (status.isConfigured) return null;

  return (
    <section className="border-b-4 border-cjsr-magenta bg-cjsr-surface px-4 py-3 text-white" role="status" aria-live="polite">
      <div className="mx-auto max-w-6xl">
        <p className="font-bold">Configuration warning</p>
        <p className="mt-1 text-sm">
          Missing Firebase environment variables: {status.missing.join(', ')}. Add them to `.env.local` using `.env.example`.
        </p>
      </div>
    </section>
  );
}
