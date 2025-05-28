import axios from 'axios';

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error('Missing RECAPTCHA_SECRET_KEY in environment variables.');
    return false;
  }
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    );
    console.log('Recaptcha verification response:', response.data);

    return response.data.success;
  } catch (error) {
    console.error('Recaptcha verification error:', error);
    return false;
  }
}

// export async function verifyRecaptcha(token: string): Promise<boolean> {
//   const secret = process.env.RECAPTCHA_SECRET_KEY;
//   if (!secret) {
//     console.error('Missing RECAPTCHA_SECRET_KEY in environment variables.');
//     return false;
//   }

//   if (!token || token.trim() === '') {
//     console.error('Missing or empty reCAPTCHA token');
//     return false;
//   }

//   try {
//     const params = new URLSearchParams();
//     params.append('secret', secret);
//     params.append('response', token);
//     const response = await axios.post(
//       'https://www.google.com/recaptcha/api/siteverify',
//       params,
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         timeout: 10000,
//       },
//     );

//     console.log('Recaptcha verification response:', response.data);

//     if (!response.data.success) {
//       console.error('reCAPTCHA verification failed');
//       if (response.data['error-codes']) {
//         console.error('Error codes:', response.data['error-codes']);

//         // Log specific error meanings
//         const errorMeanings = {
//           'missing-input-secret': 'Missing secret key',
//           'invalid-input-secret': 'Invalid secret key',
//           'missing-input-response': 'Missing response token',
//           'invalid-input-response': 'Invalid response token or domain mismatch',
//           'bad-request': 'Bad request to Google',
//           'timeout-or-duplicate': 'Token timeout or already used',
//         } as const;

//         type ErrorCode = keyof typeof errorMeanings;

//         response.data['error-codes'].forEach((code: string) => {
//           if (code in errorMeanings) {
//             console.error(`${code}: ${errorMeanings[code as ErrorCode]}`);
//           } else {
//             console.error(`${code}: Unknown error`);
//           }
//         });
//       }
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error('Recaptcha verification error:', error);
//     return false;
//   }
// }
interface RecaptchaV3Response {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}
export async function verifyRecaptchaV3(
  token: string,
  expectedAction: string = 'login',
  minScore: number = 0.5,
): Promise<{ success: boolean; score?: number; error?: string }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error('Missing RECAPTCHA_SECRET_KEY in environment variables.');
    return { success: false, error: 'Server configuration error' };
  }

  if (!token || token.trim() === '') {
    console.error('Missing or empty reCAPTCHA token');
    return { success: false, error: 'Missing reCAPTCHA token' };
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const response = await axios.post<RecaptchaV3Response>(
      'https://www.google.com/recaptcha/api/siteverify',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      },
    );

    console.log('reCAPTCHA v3 verification response:', response.data);

    if (!response.data.success) {
      console.error('reCAPTCHA v3 verification failed');
      if (response.data['error-codes']) {
        console.error('Error codes:', response.data['error-codes']);
      }
      return { success: false, error: 'reCAPTCHA verification failed' };
    }

    // Check action matches (important for security)
    if (response.data.action !== expectedAction) {
      console.error(
        `Action mismatch. Expected: ${expectedAction}, Got: ${response.data.action}`,
      );
      return { success: false, error: 'Invalid action' };
    }

    // Check score threshold
    const score = response.data.score;
    console.log(`reCAPTCHA v3 score: ${score} (minimum required: ${minScore})`);

    if (score < minScore) {
      console.warn(`Low reCAPTCHA score: ${score}`);
      return {
        success: false,
        score,
        error: `Security check failed. Score: ${score}`,
      };
    }

    return { success: true, score };
  } catch (error) {
    console.error('reCAPTCHA v3 verification error:', error);
    return { success: false, error: 'Verification service unavailable' };
  }
}
