import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { kv } from '@vercel/kv';
import { generateReport } from '../../utils/ai';
import { UserInput, ReportData } from '../../types/user';

// API route to generate and retrieve reports
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      const report = await kv.get<ReportData>(`report:${id}`);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      return res.status(200).json(report);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve report' });
    }
  }

  if (req.method === 'POST') {
    const input: UserInput = req.body;
    try {
      const reportId = uuidv4();
      const report = await generateReport(input, false); // Generate free report
      await kv.set(`report:${reportId}`, report, { ex: 60 * 60 * 24 }); // Store for 24 hours
      return res.status(200).json({ reportId });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}