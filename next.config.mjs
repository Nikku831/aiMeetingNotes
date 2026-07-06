/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stripe webhooks need the raw request body — disable body parsing for that route
  // In Next.js App Router this is handled by reading request.text() in the route handler.
  // No extra config needed for App Router.
};

export default nextConfig;
