/**
 * FlowNexa Invoice Email Template
 * Professional HTML email template for order invoice/confirmation
 */

interface InvoiceItem {
  productName: string;
  sku: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    fullName?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
}

function formatINR(amount: number): string {
  return "₹" + amount.toFixed(2);
}

export function generateInvoiceEmailHtml(data: InvoiceData): string {
  const itemRows = data.items
    .map((item) => {
      const lineTotal = formatINR(item.price * item.quantity);
      const unitPrice = formatINR(item.price);
      return [
        '<tr>',
        '  <td style="padding: 12px 16px; border-bottom: 1px solid #2a2d35; color: #e0e0e0; font-size: 14px;">' + item.productName + '</td>',
        '  <td style="padding: 12px 16px; border-bottom: 1px solid #2a2d35; color: #9ca3af; font-size: 13px; text-align: center;">' + item.sku + '</td>',
        '  <td style="padding: 12px 16px; border-bottom: 1px solid #2a2d35; color: #e0e0e0; font-size: 14px; text-align: center;">' + item.quantity + '</td>',
        '  <td style="padding: 12px 16px; border-bottom: 1px solid #2a2d35; color: #e0e0e0; font-size: 14px; text-align: right;">' + unitPrice + '</td>',
        '  <td style="padding: 12px 16px; border-bottom: 1px solid #2a2d35; color: #c8ff00; font-size: 14px; font-weight: 600; text-align: right;">' + lineTotal + '</td>',
        '</tr>',
      ].join("\n");
    })
    .join("\n");

  const paymentBadgeColor = data.paymentMethod === "COD" ? "#f59e0b" : "#10b981";
  const paymentLabel = data.paymentMethod === "COD" ? "Cash on Delivery" : "Paid via Card";

  const addr = data.shippingAddress;
  const addressParts: string[] = [];
  if (addr.fullName) addressParts.push(addr.fullName);
  if (addr.street) addressParts.push(addr.street);
  const cityLine = [addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ");
  if (cityLine) addressParts.push(cityLine);
  addressParts.push(addr.country || "India");
  if (addr.phone) addressParts.push("📞 " + addr.phone);
  const addressHtml = addressParts.join("<br>");

  const discountRow = data.discount > 0
    ? '<tr><td style="padding: 4px 0; color: #10b981; font-size: 13px;">Discount</td><td style="padding: 4px 0; color: #10b981; font-size: 13px; text-align: right;">-' + formatINR(data.discount) + '</td></tr>'
    : "";

  const year = new Date().getFullYear();

  return '<!DOCTYPE html>\n'
    + '<html lang="en">\n'
    + '<head>\n'
    + '  <meta charset="UTF-8">\n'
    + '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    + '  <title>Order Invoice - ' + data.orderNumber + '</title>\n'
    + '</head>\n'
    + '<body style="margin: 0; padding: 0; background-color: #0a0b0e; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;">\n'
    + '  <div style="max-width: 640px; margin: 0 auto; padding: 24px;">\n'

    // Header
    + '    <div style="background: linear-gradient(135deg, #1a1d26 0%, #13151b 100%); border-radius: 16px 16px 0 0; padding: 32px; border: 1px solid rgba(255,255,255,0.05); border-bottom: none;">\n'
    + '      <table width="100%" cellpadding="0" cellspacing="0">\n'
    + '        <tr>\n'
    + '          <td>\n'
    + '            <h1 style="margin: 0; color: #c8ff00; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">FlowNexa</h1>\n'
    + '            <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Order Confirmation &amp; Invoice</p>\n'
    + '          </td>\n'
    + '          <td style="text-align: right;">\n'
    + '            <span style="display: inline-block; background: ' + paymentBadgeColor + '20; color: ' + paymentBadgeColor + '; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;">' + paymentLabel + '</span>\n'
    + '          </td>\n'
    + '        </tr>\n'
    + '      </table>\n'
    + '    </div>\n'

    // Order Info
    + '    <div style="background: #13151b; padding: 24px 32px; border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">\n'
    + '      <p style="margin: 0 0 8px; color: #e0e0e0; font-size: 16px;">Hello <strong>' + data.customerName + '</strong>,</p>\n'
    + '      <p style="margin: 0 0 20px; color: #9ca3af; font-size: 14px; line-height: 1.5;">Thank you for your order! Here are your invoice details. Our AI verification team will contact you shortly to confirm.</p>\n'
    + '      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">\n'
    + '        <tr>\n'
    + '          <td style="padding: 8px 0;"><span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</span><br><span style="color: #c8ff00; font-size: 16px; font-weight: 700;">' + data.orderNumber + '</span></td>\n'
    + '          <td style="text-align: right; padding: 8px 0;"><span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order Date</span><br><span style="color: #e0e0e0; font-size: 14px; font-weight: 500;">' + data.orderDate + '</span></td>\n'
    + '        </tr>\n'
    + '      </table>\n'
    + '    </div>\n'

    // Items Table
    + '    <div style="background: #13151b; padding: 0 32px 24px; border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">\n'
    + '      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius: 12px; overflow: hidden; background: #1a1d26;">\n'
    + '        <thead>\n'
    + '          <tr style="background: #1f2230;">\n'
    + '            <th style="padding: 12px 16px; text-align: left; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Product</th>\n'
    + '            <th style="padding: 12px 16px; text-align: center; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">SKU</th>\n'
    + '            <th style="padding: 12px 16px; text-align: center; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Qty</th>\n'
    + '            <th style="padding: 12px 16px; text-align: right; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Price</th>\n'
    + '            <th style="padding: 12px 16px; text-align: right; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Total</th>\n'
    + '          </tr>\n'
    + '        </thead>\n'
    + '        <tbody>\n'
    + itemRows + '\n'
    + '        </tbody>\n'
    + '      </table>\n'
    + '    </div>\n'

    // Summary Section
    + '    <div style="background: #13151b; padding: 0 32px 24px; border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">\n'
    + '      <table width="100%" cellpadding="0" cellspacing="0">\n'
    + '        <tr>\n'
    + '          <td style="vertical-align: top; width: 50%; padding-right: 16px;">\n'
    + '            <p style="margin: 0 0 8px; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Shipping Address</p>\n'
    + '            <div style="background: #1a1d26; border-radius: 12px; padding: 16px; color: #9ca3af; font-size: 13px; line-height: 1.6;">' + addressHtml + '</div>\n'
    + '          </td>\n'
    + '          <td style="vertical-align: top; width: 50%; padding-left: 16px;">\n'
    + '            <p style="margin: 0 0 8px; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Order Summary</p>\n'
    + '            <div style="background: #1a1d26; border-radius: 12px; padding: 16px;">\n'
    + '              <table width="100%" cellpadding="0" cellspacing="0">\n'
    + '                <tr><td style="padding: 4px 0; color: #9ca3af; font-size: 13px;">Subtotal</td><td style="padding: 4px 0; color: #e0e0e0; font-size: 13px; text-align: right;">' + formatINR(data.subtotal) + '</td></tr>\n'
    + '                <tr><td style="padding: 4px 0; color: #9ca3af; font-size: 13px;">Tax</td><td style="padding: 4px 0; color: #e0e0e0; font-size: 13px; text-align: right;">' + formatINR(data.tax) + '</td></tr>\n'
    + '                <tr><td style="padding: 4px 0; color: #9ca3af; font-size: 13px;">Shipping</td><td style="padding: 4px 0; color: #e0e0e0; font-size: 13px; text-align: right;">' + formatINR(data.shippingCharges) + '</td></tr>\n'
    + discountRow + '\n'
    + '                <tr><td colspan="2" style="padding: 8px 0 0;"><hr style="border: none; border-top: 1px solid #2a2d35;"></td></tr>\n'
    + '                <tr><td style="padding: 8px 0; color: #ffffff; font-size: 16px; font-weight: 700;">Total</td><td style="padding: 8px 0; color: #c8ff00; font-size: 18px; font-weight: 800; text-align: right;">' + formatINR(data.total) + '</td></tr>\n'
    + '              </table>\n'
    + '            </div>\n'
    + '          </td>\n'
    + '        </tr>\n'
    + '      </table>\n'
    + '    </div>\n'

    // AI Verification Notice
    + '    <div style="background: linear-gradient(135deg, #1a1d26 0%, #181b23 100%); padding: 24px 32px; border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">\n'
    + '      <div style="background: rgba(200, 255, 0, 0.05); border: 1px solid rgba(200, 255, 0, 0.15); border-radius: 12px; padding: 16px 20px;">\n'
    + '        <p style="margin: 0 0 4px; color: #c8ff00; font-size: 13px; font-weight: 600;">🤖 AI Verification Call Incoming</p>\n'
    + '        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">Our AI agent will call you within the next 5 minutes to verify this order. Please keep your phone nearby.</p>\n'
    + '      </div>\n'
    + '    </div>\n'

    // Footer
    + '    <div style="background: #0f1015; border-radius: 0 0 16px 16px; padding: 24px 32px; border: 1px solid rgba(255,255,255,0.05); border-top: none; text-align: center;">\n'
    + '      <p style="margin: 0 0 4px; color: #6b7280; font-size: 11px;">Need help? Contact us at support@flownexa.com</p>\n'
    + '      <p style="margin: 0; color: #4b5563; font-size: 10px;">© ' + year + ' FlowNexa. All rights reserved.</p>\n'
    + '    </div>\n'

    + '  </div>\n'
    + '</body>\n'
    + '</html>';
}

export function generateInvoiceEmailSubject(orderNumber: string): string {
  return "📦 FlowNexa Order Confirmation - " + orderNumber;
}
