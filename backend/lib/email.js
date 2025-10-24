import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Send Order Confirmation Email to User
export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    console.log("Sending order confirmation email to:", userEmail);
    
    const { orderId, products, totalAmount, shippingAddress } = orderDetails;

    // Generate product list HTML
    const productListHTML = products
      .map(
        (item) => `
        <tr>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb;">
            <span style="font-weight: 500; color: #111827;">${item.product.name}</span>
          </td>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            <span style="background: #f3f4f6; padding: 4px 12px; border-radius: 6px; font-weight: 500;">${item.quantity}</span>
          </td>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">₹${item.price}</td>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #111827;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6; 
            color: #374151;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
          }
          .header { 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white; 
            padding: 40px 30px; 
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .success-icon {
            width: 64px;
            height: 64px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            font-size: 32px;
          }
          .content { 
            padding: 40px 30px;
          }
          .content h2 {
            color: #111827;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 12px 0;
          }
          .content p {
            color: #6b7280;
            margin: 8px 0;
            font-size: 15px;
          }
          .greeting {
            color: #111827;
            font-size: 16px;
            font-weight: 500;
          }
          .order-details { 
            background: #f9fafb;
            padding: 24px; 
            margin: 30px 0;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .order-details h3 {
            color: #111827;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-label {
            color: #6b7280;
            font-size: 14px;
          }
          .info-value {
            color: #111827;
            font-weight: 500;
            font-size: 14px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
          }
          th { 
            background: #f9fafb;
            padding: 14px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e5e7eb;
          }
          .total-row {
            background: #f0fdf4;
            border-top: 2px solid #10b981;
          }
          .total-row td {
            padding: 18px 12px !important;
            border: none !important;
          }
          .total { 
            font-size: 22px; 
            font-weight: 700; 
            color: #10b981;
          }
          .address-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-top: 16px;
            line-height: 1.8;
          }
          .address-box p {
            margin: 0;
            color: #374151;
          }
          .info-box {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 4px;
          }
          .info-box p {
            margin: 0;
            color: #1e40af;
            font-size: 14px;
          }
          .footer { 
            text-align: center; 
            padding: 30px 20px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .footer p {
            color: #9ca3af;
            font-size: 13px;
            margin: 6px 0;
          }
          .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 24px 0;
          }
        </style>
      </head>
      <body>
        <div style="padding: 20px; background-color: #f9fafb;">
          <div class="container">
            <div class="header">
              <div class="success-icon">✓</div>
              <h1>Order Confirmed!</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">Your purchase is on its way</p>
            </div>
            
            <div class="content">
              <h2>Thank You for Your Order!</h2>
              <p class="greeting">Hello ${shippingAddress.fullName},</p>
              <p>We're excited to let you know that your order has been successfully confirmed and is now being prepared for shipment.</p>
              
              <div class="order-details">
                <h3>📋 Order Summary</h3>
                <div class="info-row">
                  <span class="info-label">Order Number</span>
                  <span class="info-value">#${orderId}</span>
                </div>
                <div class="info-row" style="border: none;">
                  <span class="info-label">Order Date</span>
                  <span class="info-value">${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${productListHTML}
                </tbody>
                <tfoot>
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right; font-weight: 600; color: #111827;">Total Amount:</td>
                    <td style="text-align: right;" class="total">₹${totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
              
              <div class="order-details">
                <h3>📍 Delivery Address</h3>
                <div class="address-box">
                  <p><strong style="color: #111827;">${shippingAddress.fullName}</strong></p>
                  <p>${shippingAddress.addressLine1}</p>
                  ${shippingAddress.addressLine2 ? `<p>${shippingAddress.addressLine2}</p>` : ""}
                  <p>${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
                  <p>${shippingAddress.country}</p>
                  <p style="margin-top: 8px;"><strong>📞 Phone:</strong> ${shippingAddress.phone}</p>
                </div>
              </div>
              
              <div class="info-box">
                <p>📦 <strong>What's next?</strong> You'll receive a shipping confirmation email with tracking details once your order is dispatched.</p>
              </div>
              
              <div class="divider"></div>
              
              <p style="text-align: center; color: #6b7280; font-size: 14px;">
                Need assistance? Our support team is here to help at 
                <a href="mailto:support@slatebooks.com" style="color: #10b981; text-decoration: none; font-weight: 500;">support@slatebooks.com</a>
              </p>
            </div>
            
            <div class="footer">
              <p style="font-weight: 500; color: #6b7280;">© 2025 Slate Books. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'SlateBooks <orders@slatebooks.com>',
      replyTo: 'support@slatebooks.com',
      to: userEmail,
      subject: `Order Confirmation - #${orderId}`,
      html: emailHTML,
    });

    if (error) {
      console.error('Resend error sending order confirmation:', error);
      throw error;
    }

    console.log('✅ Order confirmation email sent successfully to:', userEmail);
    console.log('Email ID:', data?.id);
    return data;
  } catch (error) {
    console.error("❌ Error sending order confirmation email:", error);
    throw error;
  }
};

// Send New Order Notification Email to Admin
export const sendAdminOrderNotification = async (orderDetails) => {
  try {
    console.log("Sending admin notification to:", process.env.ADMIN_EMAIL);
    
    const { orderId, userEmail, userName, products, totalAmount, shippingAddress } = orderDetails;

    // Generate product list HTML
    const productListHTML = products
      .map(
        (item) => `
        <tr>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb;">
            <span style="font-weight: 500; color: #111827;">${item.product.name}</span>
          </td>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 6px; font-weight: 500;">${item.quantity}</span>
          </td>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">₹${item.price}</td>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #111827;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6; 
            color: #374151;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
          }
          .header { 
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white; 
            padding: 40px 30px; 
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .alert-icon {
            width: 64px;
            height: 64px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            font-size: 32px;
          }
          .content { 
            padding: 40px 30px;
          }
          .alert-box { 
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            padding: 20px 24px;
            border-left: 5px solid #f59e0b;
            margin: 0 0 30px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(245,158,11,0.1);
          }
          .alert-box p {
            margin: 0;
            color: #78350f;
            font-weight: 500;
            font-size: 15px;
          }
          .alert-box strong {
            color: #92400e;
            font-size: 16px;
          }
          .order-details { 
            background: #f9fafb;
            padding: 24px; 
            margin: 24px 0;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .order-details h3 {
            color: #111827;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 16px;
          }
          .info-card {
            background: white;
            padding: 16px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          .info-card-label {
            color: #6b7280;
            font-size: 13px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
          }
          .info-card-value {
            color: #111827;
            font-size: 15px;
            font-weight: 600;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
          }
          th { 
            background: #fef3c7;
            padding: 14px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            color: #92400e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #fde68a;
          }
          .total-row {
            background: #fffbeb;
            border-top: 2px solid #f59e0b;
          }
          .total-row td {
            padding: 18px 12px !important;
            border: none !important;
          }
          .total { 
            font-size: 22px; 
            font-weight: 700; 
            color: #f59e0b;
          }
          .address-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-top: 16px;
            line-height: 1.8;
          }
          .address-box p {
            margin: 4px 0;
            color: #374151;
          }
          .action-list {
            background: #eff6ff;
            border-radius: 8px;
            padding: 20px 24px;
            margin: 24px 0;
          }
          .action-list h4 {
            color: #1e40af;
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 12px 0;
          }
          .action-list ul {
            margin: 0;
            padding-left: 20px;
            color: #1e3a8a;
          }
          .action-list li {
            margin: 8px 0;
            font-size: 14px;
          }
          .footer { 
            text-align: center; 
            padding: 30px 20px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .footer p {
            color: #9ca3af;
            font-size: 13px;
            margin: 6px 0;
          }
        </style>
      </head>
      <body>
        <div style="padding: 20px; background-color: #f9fafb;">
          <div class="container">
            <div class="header">
              <div class="alert-icon">🔔</div>
              <h1>New Order Received!</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">Action required - Process this order</p>
            </div>
            
            <div class="content">
              <div class="alert-box">
                <p><strong>⚡ Immediate Action Required</strong></p>
                <p>A new order has been placed and is awaiting processing. Please review and fulfill this order promptly.</p>
              </div>
              
              <div class="order-details">
                <h3>📋 Order Information</h3>
                <div class="info-grid">
                  <div class="info-card">
                    <div class="info-card-label">Order Number</div>
                    <div class="info-card-value">#${orderId}</div>
                  </div>
                  <div class="info-card">
                    <div class="info-card-label">Order Date</div>
                    <div class="info-card-value">${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <div class="info-card">
                    <div class="info-card-label">Customer Name</div>
                    <div class="info-card-value">${userName}</div>
                  </div>
                  <div class="info-card">
                    <div class="info-card-label">Customer Email</div>
                    <div class="info-card-value" style="font-size: 13px; word-break: break-all;">${userEmail}</div>
                  </div>
                </div>
              </div>
              
              <div class="order-details">
                <h3>🛍️ Products Ordered</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style="text-align: center;">Qty</th>
                      <th style="text-align: right;">Price</th>
                      <th style="text-align: right;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productListHTML}
                  </tbody>
                  <tfoot>
                    <tr class="total-row">
                      <td colspan="3" style="text-align: right; font-weight: 600; color: #111827;">Total Order Value:</td>
                      <td style="text-align: right;" class="total">₹${totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div class="order-details">
                <h3>📍 Shipping Details</h3>
                <div class="address-box">
                  <p><strong style="color: #111827; font-size: 16px;">${shippingAddress.fullName}</strong></p>
                  <p>${shippingAddress.addressLine1}</p>
                  ${shippingAddress.addressLine2 ? `<p>${shippingAddress.addressLine2}</p>` : ""}
                  <p>${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
                  <p>${shippingAddress.country}</p>
                  <p style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                    <strong style="color: #111827;">📞 Contact:</strong> ${shippingAddress.phone}
                  </p>
                </div>
              </div>
              
              <div class="action-list">
                <h4>✅ Action Items:</h4>
                <ul>
                  <li>Verify inventory availability for all ordered items</li>
                  <li>Process payment confirmation and update order status</li>
                  <li>Prepare products for packaging and shipment</li>
                  <li>Update tracking information in the admin dashboard</li>
                  <li>Contact customer at ${shippingAddress.phone} if clarification needed</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p style="font-weight: 500; color: #6b7280;">SlateBooks Admin Notification System</p>
              <p>This is an automated admin alert. Please process this order in your dashboard.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'SlateBooks Orders <noreply@slatebooks.com>',
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 New Order Received - #${orderId}`,
      html: emailHTML,
    });

    if (error) {
      console.error('Resend error sending admin notification:', error);
      throw error;
    }

    console.log('✅ Admin notification email sent successfully to:', process.env.ADMIN_EMAIL);
    console.log('Email ID:', data?.id);
    return data;
  } catch (error) {
    console.error("❌ Error sending admin notification email:", error);
    throw error;
  }
};
