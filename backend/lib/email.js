import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Order Confirmation Email to User
export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    const { orderId, products, totalAmount, shippingAddress } = orderDetails;

    // Generate product list HTML
    const productListHTML = products
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const mailOptions = {
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f4f4f4; padding: 10px; text-align: left; }
            .total { font-size: 18px; font-weight: bold; color: #4CAF50; }
            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Thank you for your order!</h2>
              <p>Hi ${shippingAddress.fullName},</p>
              <p>Your order has been successfully placed and is being processed.</p>
              
              <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> #${orderId}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style="text-align: center;">Quantity</th>
                      <th style="text-align: right;">Price</th>
                      <th style="text-align: right;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productListHTML}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" style="padding: 15px 10px; text-align: right; font-weight: bold;">Total Amount:</td>
                      <td style="padding: 15px 10px; text-align: right;" class="total">₹${totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
                
                <h3>Shipping Address</h3>
                <p>
                  ${shippingAddress.fullName}<br>
                  ${shippingAddress.addressLine1}<br>
                  ${shippingAddress.addressLine2 ? shippingAddress.addressLine2 + "<br>" : ""}
                  ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}<br>
                  ${shippingAddress.country}<br>
                  Phone: ${shippingAddress.phone}
                </p>
              </div>
              
              <p>We'll send you another email once your order has been shipped.</p>
              <p>If you have any questions, please contact us.</p>
            </div>
            <div class="footer">
              <p>© 2025 Your Store. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent to user:", userEmail);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};

// Send New Order Notification Email to Admin
export const sendAdminOrderNotification = async (orderDetails) => {
  try {
    const { orderId, userEmail, userName, products, totalAmount, shippingAddress } = orderDetails;

    // Generate product list HTML
    const productListHTML = products
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const mailOptions = {
      from: `"Your Store System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 New Order Received - #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF9800; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f4f4f4; padding: 10px; text-align: left; }
            .total { font-size: 18px; font-weight: bold; color: #FF9800; }
            .alert { background: #fff3cd; padding: 15px; border-left: 4px solid #FF9800; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Order Alert!</h1>
            </div>
            <div class="content">
              <div class="alert">
                <strong>Action Required:</strong> A new order has been placed and requires processing.
              </div>
              
              <div class="order-details">
                <h3>Order Information</h3>
                <p><strong>Order ID:</strong> #${orderId}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleString('en-IN')}</p>
                <p><strong>Customer Name:</strong> ${userName}</p>
                <p><strong>Customer Email:</strong> ${userEmail}</p>
                
                <h3>Products Ordered</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style="text-align: center;">Quantity</th>
                      <th style="text-align: right;">Price</th>
                      <th style="text-align: right;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productListHTML}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" style="padding: 15px 10px; text-align: right; font-weight: bold;">Total Amount:</td>
                      <td style="padding: 15px 10px; text-align: right;" class="total">₹${totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
                
                <h3>Shipping Address</h3>
                <p>
                  <strong>${shippingAddress.fullName}</strong><br>
                  ${shippingAddress.addressLine1}<br>
                  ${shippingAddress.addressLine2 ? shippingAddress.addressLine2 + "<br>" : ""}
                  ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}<br>
                  ${shippingAddress.country}<br>
                  <strong>Phone:</strong> ${shippingAddress.phone}
                </p>
              </div>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Process the order and prepare for shipment</li>
                <li>Update order status in the admin dashboard</li>
                <li>Contact customer if needed: ${shippingAddress.phone}</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent to:", process.env.ADMIN_EMAIL);
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    throw error;
  }
};