// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://developer.tkawen.com',
  integrations: [
    starlight({
      title: 'TKAWEN Developer',
      description:
        'الوثائق الرسمية لمنصة TKAWEN — البنية الرقمية السيادية للجزائر. 7 طبقات، 4 SDKs، Sandbox مجاني.',
      logo: { src: './src/assets/tkawen-mark.svg', replacesTitle: false },
      favicon: '/favicon.svg',
      // Single-locale (Arabic RTL) for now. Multi-locale folders will be added
      // when full translations are ready — `src/content/docs/{en,fr}/` etc.
      defaultLocale: 'root',
      locales: {
        root: { label: 'العربية', lang: 'ar-DZ', dir: 'rtl' },
      },
      customCss: ['./src/styles/tkawen.css'],
      head: [
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#0a0e1a' },
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/tkawen' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/tkawen' },
      ],
      editLink: {
        baseUrl: 'https://github.com/tkawen/tkawen-developer-docs/edit/main/',
      },
      sidebar: [
        {
          label: 'البداية',
          translations: { en: 'Getting Started', fr: 'Démarrer' },
          items: [
            { label: 'مقدّمة', translations: { en: 'Introduction', fr: 'Introduction' }, slug: 'intro' },
            {
              label: 'احصل على مفتاح API',
              translations: { en: 'Get an API key', fr: 'Obtenir une clé API' },
              slug: 'getting-started/api-key',
            },
            {
              label: 'استدعاؤك الأوّل',
              translations: { en: 'Your first call', fr: 'Votre premier appel' },
              slug: 'getting-started/first-call',
            },
          ],
        },
        {
          label: 'الطبقات السبع',
          translations: { en: 'The 7 Pillars', fr: 'Les 7 Piliers' },
          items: [
            { label: '01 · الهوية', translations: { en: '01 · Identity', fr: '01 · Identité' }, slug: 'pillars/identity' },
            { label: '02 · الاتصال', translations: { en: '02 · Connect', fr: '02 · Connect' }, slug: 'pillars/connect' },
            { label: '03 · الدفع', translations: { en: '03 · Pay', fr: '03 · Paiement' }, slug: 'pillars/pay' },
            { label: '04 · التجارة', translations: { en: '04 · Commerce', fr: '04 · Commerce' }, slug: 'pillars/commerce' },
            { label: '05 · المعرفة', translations: { en: '05 · Knowledge', fr: '05 · Savoir' }, slug: 'pillars/knowledge' },
            { label: '06 · اللوجستيك', translations: { en: '06 · Logistics', fr: '06 · Logistique' }, slug: 'pillars/logistics' },
            { label: '07 · السحابة للمطوّرين', translations: { en: '07 · Developer Cloud', fr: '07 · Cloud Développeur' }, slug: 'pillars/developer' },
          ],
        },
        {
          label: 'SDKs',
          items: [
            { label: 'JavaScript / TypeScript', slug: 'sdks/javascript' },
            { label: 'PHP / Laravel', slug: 'sdks/php' },
            { label: 'Python', slug: 'sdks/python' },
            { label: 'Go', slug: 'sdks/go' },
          ],
        },
        {
          label: 'مرجع',
          translations: { en: 'Reference', fr: 'Référence' },
          items: [{ autogenerate: { directory: 'reference' } }],
        },
      ],
    }),
  ],
});
