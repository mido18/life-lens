import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { generateReport } from '../../utils/ai';
import { ReportData } from '../../types/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });

// API route for Stripe payment processing
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reportId } = req.body;
  try {
    const report = await kv.get<ReportData>(`report:${reportId}`);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'LifeLens Premium Report' },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/report/${reportId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/report/${reportId}`,
    });

    // Generate and store premium report
    const premiumReport = await generateReport(report.input, true);
    await kv.set(`report:${reportId}`, premiumReport, { ex: 60 * 60 * 24 * 7 }); // Store for 7 days

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    return res.status(500).json({ error: 'Payment processing failed' });
  }
}