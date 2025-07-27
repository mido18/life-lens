import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from 'redis';
import { generateReport } from '../../utils/ai';
import { ReportData } from '../../types/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });

// API route for Stripe payment processing
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Create Redis client and connect
  const redis = createClient({ url: process.env.REDIS_URL });
  await redis.connect();
  // Extract origin/host header if needed
  const origin = (req.headers.origin ?? req.headers.host) as string | undefined;
  const { reportId } = req.body;
  try {
    const reportStr = await redis.get(`report:${reportId}`);
    if (!reportStr) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const report: ReportData = JSON.parse(reportStr);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1RpPYjEp1GiSPrAVWLHxRHLV',
          quantity: 1,
        },
      ],
      metadata: {
        reportId,
      },
      mode: 'payment',
      success_url: `${origin}/report/${reportId}`,
      cancel_url: `${origin}/report/${reportId}`,
    });

    // Generate and store premium report
    const premiumReport = await generateReport(report.input, true);
    await redis.set(`report:${reportId}`, JSON.stringify(premiumReport), { EX: 60 * 60 * 24 * 7 }); // Store for 7 days

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Payment processing failed' });
  }
}