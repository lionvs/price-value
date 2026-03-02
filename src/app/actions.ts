'use server';

import {RecaptchaEnterpriseServiceClient} from '@google-cloud/recaptcha-enterprise';

export interface TransactionData {
  transactionId?: string;
  paymentMethod?: string;
  cardBin?: string;
  cardLastFour?: string;
  currencyCode?: string;
  value?: number;
  user?: {
    accountId?: string;
    email?: string;
    phoneNumber?: string;
  };
  billingAddress?: {
    recipient?: string;
    address?: string[];
    locality?: string;
    administrativeArea?: string;
    regionCode?: string;
    postalCode?: string;
  };
}

export async function verifyCaptcha(
  token: string,
  action: string = 'submit',
  transactionData?: TransactionData,
) {
  const projectID = process.env.RECAPTCHA_PROJECT_ID;
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!projectID || !recaptchaKey) {
    console.warn(
      'RECAPTCHA_PROJECT_ID or NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. Skipping verification.',
    );
    return {success: true, message: 'Skipped verification (dev mode)'};
  }

  // Check for credentials in environment variables (Vercel)
  const credentials =
    process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
      ? {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }
      : undefined;

  // NOTE: This requires GOOGLE_APPLICATION_CREDENTIALS to be set or ADC to be configured.
  console.log('Verifying captcha execution', {
    hasEnvCredentials: !!credentials,
  });

  const client = new RecaptchaEnterpriseServiceClient({credentials});
  const projectPath = client.projectPath(projectID);

  const eventData: any = {
    token: token,
    siteKey: recaptchaKey,
  };

  // Add transaction_data if provided (required for Fraud Prevention)
  if (transactionData) {
    eventData.transactionData = transactionData;
  }

  const request = {
    assessment: {
      event: eventData,
    },
    parent: projectPath,
  };

  try {
    const [response] = await client.createAssessment(request);

    // Log complete assessment response for debugging
    console.log('reCAPTCHA CreateAssessment Response:', {
      name: response.name,
      tokenValid: response.tokenProperties?.valid,
      tokenAction: response.tokenProperties?.action,
      tokenInvalidReason: response.tokenProperties?.invalidReason,
      riskScore: response.riskAnalysis?.score,
      riskReasons: response.riskAnalysis?.reasons,
      fraudPreventionTransactionRisk: response.fraudPreventionAssessment?.transactionRisk,
      hasTransactionData: !!request.assessment.event.transaction_data,
    });

    if (!response.tokenProperties?.valid) {
      console.error(
        'The CreateAssessment call failed because the token was invalid:',
        response.tokenProperties,
      );
      return {
        success: false,
        message: `Invalid token: ${response.tokenProperties?.invalidReason || 'UNKNOWN'}`,
      };
    }

    if (response.tokenProperties.action === action) {
      return {
        success: true,
        score: response.riskAnalysis?.score,
        fraudPrevention: response.fraudPreventionAssessment
          ? {
              transactionRisk: response.fraudPreventionAssessment?.transactionRisk,
            }
          : undefined,
      };
    } else {
      console.error(
        'The action attribute in your reCAPTCHA tag does not match the action you are expecting to score',
      );
      return {success: false, message: 'Action mismatch'};
    }
  } catch (error: any) {
    console.error('reCAPTCHA verification error:', error);

    // Provide a clear error message if authentication fails
    if (
      error.code === 2 ||
      error.message?.includes('Could not refresh access token')
    ) {
      return {
        success: false,
        message:
          'Authentication failed. Please set GOOGLE_APPLICATION_CREDENTIALS.',
      };
    }

    return {success: false, message: 'Error verifying captcha'};
  }
}
