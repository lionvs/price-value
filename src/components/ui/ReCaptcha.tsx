'use client';

import {useEffect} from 'react';

interface ReCaptchaProps {
  siteKey: string;
  action?: string;
  onChange: (token: string | null) => void;
}

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function ReCaptcha({
  siteKey,
  action = 'submit',
  onChange,
}: ReCaptchaProps) {
  useEffect(() => {
    // 1. Ensure Script Loaded
    const scriptId = 'recaptcha-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
      script.async = true;
      document.body.appendChild(script);
    }

    // 2. Define Execution Logic
    const execute = () => {
      if (
        window.grecaptcha &&
        window.grecaptcha.enterprise &&
        window.grecaptcha.enterprise.ready
      ) {
        window.grecaptcha.enterprise.ready(() => {
          window.grecaptcha.enterprise
            .execute(siteKey, {action})
            .then(onChange)
            .catch((err: any) => console.error('ReCaptcha Error:', err));
        });
      }
    };

    // 3. Initial Execute (poll until available)
    const initInterval = setInterval(() => {
      if (
        window.grecaptcha &&
        window.grecaptcha.enterprise &&
        window.grecaptcha.enterprise.ready
      ) {
        execute();
        clearInterval(initInterval);
      }
    }, 100);

    // 4. Refresh Token Interval (every 90s)
    const refreshInterval = setInterval(execute, 90000);

    // 5. Cleanup
    return () => {
      clearInterval(initInterval);
      clearInterval(refreshInterval);
    };
  }, [siteKey, action, onChange]);

  return (
    <div className="text-xs text-gray-500 text-center mt-2">
      This site is protected by reCAPTCHA and the Google{' '}
      <a
        href="https://policies.google.com/privacy"
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer">
        Privacy Policy
      </a>{' '}
      and{' '}
      <a
        href="https://policies.google.com/terms"
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer">
        Terms of Service
      </a>{' '}
      apply.
    </div>
  );
}
