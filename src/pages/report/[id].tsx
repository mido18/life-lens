import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Report from '../../components/Report';
import { ReportData } from '../../types/user';
import { loadStripe } from '@stripe/stripe-js';
import { generatePDF } from '../../utils/pdf';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ReportPageProps {
  report: ReportData | null;
  error?: string;
}

const ReportPage: NextPage<ReportPageProps> = ({ report, error }) => {
  const router = useRouter();
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: router.query.id }),
      });
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe!.redirectToCheckout({ sessionId });
    } catch (err) {
      console.log(err);
      setPaymentError('Payment failed. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Head>
        <title>LifeLens - Your Life Report</title>
        <meta name="description" content="View your personalized LifeLens report" />
      </Head>
      <main className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Your LifeLens Report</h1>
        <Report report={report} />
        {!report.isPremium && (
          <div className="mt-6 text-center">
            <button
              onClick={handlePayment}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Unlock Premium Report ($10)
            </button>
            {paymentError && <p className="text-red-500 mt-4">{paymentError}</p>}
          </div>
        )}
        {report.isPremium && (
          <div className="mt-6 text-center">
            <button
              onClick={() => generatePDF(report)}
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
            >
              Download PDF
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    // Pick base URL depending on environment (dev ⇒ localhost, prod ⇒ configured env var)
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(`${baseUrl}/api/report?id=${params?.id}`);
    console.log(response);
    if (!response.ok) {
      return { props: { error: 'Report not found' } };
    }
    const report = await response.json();
    console.log(report);
    return { props: { report } };
  } catch (err) {
    console.log(err);
    return { props: { error: 'Failed to load report' } };
  }
};

export default ReportPage;