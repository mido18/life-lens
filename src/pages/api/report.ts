import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from 'redis';
import { generateReport } from '../../utils/ai';
import { UserInput, ReportData } from '../../types/user';

// API route to generate and retrieve reports
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("test the request");
  const redis =  await createClient({ url: process.env.REDIS_URL }).connect();
  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      const report = await redis.get(`report:${id}`);
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
      await redis.set(`report:${reportId}`, JSON.stringify(report), { EX: 60 * 60 * 24 }); // Store for 24 hours
      return res.status(200).json({ reportId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}