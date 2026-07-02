interface WelcomeEmailData {
  customerName: string;
}

export function generateWelcomeEmailHtml(data: WelcomeEmailData): string {
  const year = new Date().getFullYear();

  return '<!DOCTYPE html>\n'
    + '<html lang="en">\n'
    + '<head>\n'
    + '  <meta charset="UTF-8">\n'
    + '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    + '  <title>Welcome to FlowNexa</title>\n'
    + '</head>\n'
    + '<body style="margin: 0; padding: 0; background-color: #0a0b0e; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;">\n'
    + '  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">\n'

    + '    <div style="background: linear-gradient(135deg, #1a1d26 0%, #13151b 100%); border-radius: 16px 16px 0 0; padding: 40px 32px 32px; border: 1px solid rgba(255,255,255,0.05); border-bottom: none; text-align: center;">\n'
    + '      <h1 style="margin: 0 0 8px; color: #c8ff00; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">FlowNexa</h1>\n'
    + '      <p style="margin: 0; color: #6b7280; font-size: 14px;">Premium E-Commerce Experience</p>\n'
    + '    </div>\n'

    + '    <div style="background: #13151b; padding: 32px; border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">\n'
    + '      <p style="margin: 0 0 16px; color: #e0e0e0; font-size: 18px;">Welcome, <strong>' + data.customerName + '</strong>! 🎉</p>\n'
    + '      <p style="margin: 0 0 20px; color: #9ca3af; font-size: 14px; line-height: 1.7;">Thank you for creating an account with FlowNexa. You now have access to exclusive deals, faster checkout, and order tracking all in one place.</p>\n'

    + '      <div style="background: linear-gradient(135deg, #c8ff00 0%, #a0d800 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">\n'
    + '        <p style="margin: 0 0 4px; color: #0a0b0e; font-size: 16px; font-weight: 700;">Start Shopping</p>\n'
    + '        <p style="margin: 0 0 16px; color: #2a3a00; font-size: 13px;">Browse our latest collection</p>\n'
    + '        <a href="https://flow-nexa.vercel.app" style="display: inline-block; background: #0a0b0e; color: #c8ff00; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">Visit Store →</a>\n'
    + '      </div>\n'

    + '      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">\n'
    + '        <tr>\n'
    + '          <td style="width: 33.33%; padding: 12px; text-align: center; vertical-align: top;">\n'
    + '            <div style="background: #1a1d26; border-radius: 12px; padding: 16px;">\n'
    + '              <p style="margin: 0 0 4px; color: #c8ff00; font-size: 20px;">🚚</p>\n'
    + '              <p style="margin: 0; color: #e0e0e0; font-size: 12px; font-weight: 600;">Fast Delivery</p>\n'
    + '            </div>\n'
    + '          </td>\n'
    + '          <td style="width: 33.33%; padding: 12px; text-align: center; vertical-align: top;">\n'
    + '            <div style="background: #1a1d26; border-radius: 12px; padding: 16px;">\n'
    + '              <p style="margin: 0 0 4px; color: #c8ff00; font-size: 20px;">🔒</p>\n'
    + '              <p style="margin: 0; color: #e0e0e0; font-size: 12px; font-weight: 600;">Secure Payments</p>\n'
    + '            </div>\n'
    + '          </td>\n'
    + '          <td style="width: 33.33%; padding: 12px; text-align: center; vertical-align: top;">\n'
    + '            <div style="background: #1a1d26; border-radius: 12px; padding: 16px;">\n'
    + '              <p style="margin: 0 0 4px; color: #c8ff00; font-size: 20px;">💬</p>\n'
    + '              <p style="margin: 0; color: #e0e0e0; font-size: 12px; font-weight: 600;">24/7 Support</p>\n'
    + '            </div>\n'
    + '          </td>\n'
    + '        </tr>\n'
    + '      </table>\n'
    + '    </div>\n'

    + '    <div style="background: #0f1015; border-radius: 0 0 16px 16px; padding: 24px 32px; border: 1px solid rgba(255,255,255,0.05); border-top: none; text-align: center;">\n'
    + '      <p style="margin: 0 0 4px; color: #6b7280; font-size: 11px;">Need help? Contact us at support@flownexa.com</p>\n'
    + '      <p style="margin: 0; color: #4b5563; font-size: 10px;">© ' + year + ' FlowNexa. All rights reserved.</p>\n'
    + '    </div>\n'

    + '  </div>\n'
    + '</body>\n'
    + '</html>';
}

export function generateWelcomeEmailSubject(): string {
  return "🎉 Welcome to FlowNexa – Your Account is Ready!";
}
