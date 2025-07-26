import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import Form from '../components/Form';
import ScarcityBanner from '../components/ScarcityBanner';
import { ReportData, UserInput } from '../types/user';

// Homepage component for LifeLens
const Home: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Minimal placeholder report object so ScarcityBanner receives the required prop.
  const previewReport: ReportData = {
    reportId: 'preview',
    input: {
      name: '',
      ageRange: '',
      biggestGoal: '',
      personalityWord: '',
      currentMood: '',
      challenge: '',
      areaOfFocus: [],
      riskComfortLevel: '',
      dreamDestination: '',
      fateVsPath: '',
    },
    isPremium: false,
    content: '',
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent, input: UserInput) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const { reportId } = await response.json();
      if (response.ok) {
        router.push(`/report/${reportId}`);
      } else {
        setError('Failed to generate report. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>LifeLens - Your Personalized Life Report</title>
        <meta name="description" content="Generate personalized AI-driven life reports with LifeLens" />
      </Head>
      <main className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">LifeLens</h1>
        <ScarcityBanner report={previewReport} />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <Form onSubmit={handleSubmit} />
        <div className="mt-6 flex justify-center space-x-4">
          <a
            href={`https://twitter.com/intent/tweet?text=Discover your life path with LifeLens! Get your free report now: ${process.env.NEXT_PUBLIC_BASE_URL}?ref=twitter`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Share on Twitter
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=Check out LifeLens for a personalized life report! ${process.env.NEXT_PUBLIC_BASE_URL}?ref=whatsapp`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Share on WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;