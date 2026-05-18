import Script from 'next/script';

interface GA4ScriptProps {
  id: string | null;
  enabled: boolean;
  sendPageView?: boolean;
  anonymizeIp?: boolean;
}

export default function GA4Script({
  id,
  enabled,
  sendPageView = true,
  anonymizeIp = true,
}: GA4ScriptProps) {
  if (!enabled || !id) return null;

  const config: Record<string, unknown> = {};
  if (anonymizeIp) {
    config.anonymize_ip = true;
  }
  if (sendPageView === false) {
    config.send_page_view = false;
  }

  const configJson = Object.keys(config).length > 0 ? JSON.stringify(config) : '';

  return (
    <>
      <Script
        id="ga4-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}'${configJson ? ', ' + configJson : ''});
          `.trim(),
        }}
      />
    </>
  );
}
