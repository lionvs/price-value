import ReCaptchaProvider from '@/components/auth/ReCaptchaProvider';

export default function LoginLayout({children}: {children: React.ReactNode}) {
  return (
    <ReCaptchaProvider siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_LOGIN_SITE_KEY}>
      {children}
    </ReCaptchaProvider>
  );
}
