export const getVerifyEmailTemplate = (url: string) => ({
  subject: "Verify Email Address",
  text: "Click the link to verify your Email Address",
  html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify Email</title>
        </head>
        <body style="background-color:#ffffff; color:#24292e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
          <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px; margin:0 auto; padding:20px 0 48px;">
            <tr>
              <td>
                <h2 style="text-align: center;">Verify Your Email Address</h2>
                <p style="font-size:16px; line-height:1.5;">
                Click the link to verify your Email Address
                </p>
                <div style="text-align:center; margin: 24px 0;">
                  <a href="${url}" target="_blank" style="display:inline-block; background-color:#28a745; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-size:16px;">
                    Verify Email
                  </a>
                </div>
           
                <p style="font-size:12px; color:#6a737d; text-align:center; margin-top:40px;">
                  &copy; 2025 Your Company. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>`,
});

export const getResetPasswordEmailTemplate = (url: string) => ({
  subject: "Reset Your Password",
  text: "Click the link below to reset your password.",
  html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="x-apple-disable-message-reformatting" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Reset Password</title>
            </head>
            <body style="background-color:#ffffff; color:#24292e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
              <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px; margin:0 auto; padding:20px 0 48px;">
                <tr>
                  <td>
                    <h2 style="text-align: center;">Reset Your Password</h2>
                    <p style="font-size:16px; line-height:1.5;">
                      We received a request to reset your password. Click the button below to continue.
                    </p>
                    <div style="text-align:center; margin: 24px 0;">
                      <a href="${url}" target="_blank" style="display:inline-block; background-color:#d73a49; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-size:16px;">
                        Reset Password
                      </a>
                    </div>
                    <p style="font-size:14px; line-height:1.5;">
                      If you didn’t request this, you can safely ignore this email.
                    </p>
                    <p style="font-size:12px; color:#6a737d; text-align:center; margin-top:40px;">
                      &copy; 2025 Your Company. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </body>
          </html>`,
});
