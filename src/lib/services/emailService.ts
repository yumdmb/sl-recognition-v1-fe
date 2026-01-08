/**
 * Email Service
 * Handles sending emails for password changes and other notifications
 */

export interface PasswordChangeEmailData {
  to: string;
  userName: string;
  newPassword: string;
}

export class EmailService {
  /**
   * Send password change notification email
   */
  static async sendPasswordChangeEmail(data: PasswordChangeEmailData): Promise<void> {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'password-change',
          data,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('EmailService: Error sending password change email:', error);
      throw error;
    }
  }
}
