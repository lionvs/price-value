'use client';

import Script from 'next/script';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ReCaptchaContextType {
  executeRecaptcha?: (action: string) => Promise<string>;
}

const ReCaptchaContext = createContext<ReCaptchaContextType>({});

export const useReCaptcha = () => useContext(ReCaptchaContext);

interface ReCaptchaProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function ReCaptchaProvider({children}: ReCaptchaProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const checkReady = useCallback(() => {
    if (window.grecaptcha?.enterprise) {
      window.grecaptcha.enterprise.ready(() => {
        setIsReady(true);
      });
    }
  }, []);

  useEffect(() => {
    checkReady();
  }, [checkReady]);

  const executeRecaptcha = useCallback(
    async (action: string) => {
      if (!window.grecaptcha?.enterprise) {
        return '';
      }
      return window.grecaptcha.enterprise.execute(siteKey!, {action});
    },
    [siteKey],
  );

  return (
    <ReCaptchaContext.Provider
      value={{executeRecaptcha: isReady ? executeRecaptcha : undefined}}>
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`}
        strategy="afterInteractive"
        onLoad={checkReady}
      />
      {children}
    </ReCaptchaContext.Provider>
  );
}
