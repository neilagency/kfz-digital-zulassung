import Script from 'next/script';

interface GTMScriptProps {
  id: string | null;
  enabled: boolean;
}

export default function GTMScript({ id, enabled }: GTMScriptProps) {
  if (!enabled || !id) return null;

  return (
    <>
      <Script
        id="gtm-loader"
        src={`https://www.googletagmanager.com/gtm.js?id=${id}`}
        strategy="afterInteractive"
      />
      <noscript>
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${id}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
