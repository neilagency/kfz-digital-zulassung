'use client';

import { useEffect, useState } from 'react';

export default function DynamicContact() {
  const [phone, setPhone] = useState<string | null>(null);
  const [phoneLink, setPhoneLink] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted || !data) return;
        setPhone(data.phone || null);
        setPhoneLink(data.phoneLink || null);
        setWhatsapp(data.whatsapp || null);
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <a href={phoneLink || 'tel:015224999190'} className="text-accent font-bold text-sm hover:underline">
        {phone || '01522 4999190'}
      </a>
      <a
        href={whatsapp || 'https://wa.me/4915224999190'}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="text-green-400 font-bold text-sm hover:underline"
      >
        WhatsApp Live-Chat
      </a>
    </>
  );
}
