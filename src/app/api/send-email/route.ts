import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'password-change') {
      const { to, userName, newPassword } = data;

      // Email service configuration
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com';

      if (!RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured, email will not be sent');
        // Return success even if email service is not configured (for development)
        return NextResponse.json({ 
          success: true, 
          message: 'Email service not configured' 
        });
      }

      // Send email using Resend API
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [to],
          subject: 'Your Password Has Been Changed',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header {
                    background-color: #4F46E5;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                  }
                  .content {
                    background-color: #f9f9f9;
                    padding: 30px;
                    border: 1px solid #ddd;
                    border-top: none;
                    border-radius: 0 0 5px 5px;
                  }
                  .password-box {
                    background-color: #fff;
                    border: 2px solid #4F46E5;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                    color: #4F46E5;
                    letter-spacing: 1px;
                  }
                  .warning {
                    background-color: #FEF3C7;
                    border-left: 4px solid #F59E0B;
                    padding: 15px;
                    margin: 20px 0;
                  }
                  .footer {
                    text-align: center;
                    margin-top: 30px;
                    color: #666;
                    font-size: 12px;
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>Password Changed Successfully</h1>
                </div>
                <div class="content">
                  <p>Hello ${userName},</p>
                  
                  <p>Your password has been successfully changed. Here is your new password:</p>
                  
                  <div class="password-box">
                    ${newPassword}
                  </div>
                  
                  <div class="warning">
                    <strong>⚠️ Important Security Notice:</strong>
                    <ul style="margin: 10px 0;">
                      <li>Please keep this password secure and do not share it with anyone</li>
                      <li>We recommend changing this password to something more memorable after logging in</li>
                      <li>Delete this email after you've saved your password securely</li>
                    </ul>
                  </div>
                  
                  <p>If you did not request this password change, please contact our support team immediately.</p>
                  
                  <p>Thank you for using our Sign Language Recognition platform!</p>
                  
                  <div class="footer">
                    <p>This is an automated message, please do not reply to this email.</p>
                    <p>&copy; ${new Date().getFullYear()} Sign Language Recognition Platform. All rights reserved.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Resend API Error:', errorData);
        throw new Error('Failed to send email via Resend');
      }

      const result = await emailResponse.json();
      console.log('Email sent successfully:', result);

      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: result.id 
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send email' 
      },
      { status: 500 }
    );
  }
}
