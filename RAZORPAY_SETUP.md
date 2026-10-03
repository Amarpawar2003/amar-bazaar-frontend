# Frontend Razorpay Flow

Checkout uses Razorpay Standard Checkout loaded from Razorpay's hosted checkout script.

The React app never contains the Razorpay secret.

The frontend calls:

- `POST /api/orders?paymentMethod=RAZORPAY`
- `POST /api/payment/razorpay/verify`

The backend returns the public Razorpay Key ID and server-created Razorpay Order ID. The browser opens Razorpay Checkout and sends the resulting payment data back to the backend for signature verification.

Before testing, make sure the Spring Boot backend is running on `http://localhost:5454` and the user is logged in.
