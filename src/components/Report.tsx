import { ReportData } from '../types/user';

// Report component to display free or premium report
interface ReportProps {
  report: ReportData;
}

const Report: React.FC<ReportProps> = ({ report }) => {
  // If the report is premium but sections are missing, show a friendly fallback
  if (report.isPremium && !report.sections) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-red-600">
        Unable to display premium report: missing sections data.
      </div>
    );
  }

  // With the above guard, `sections` is guaranteed to exist when needed
  const sections = report.sections!;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{report.isPremium ? 'Premium Life Report' : 'Free Life Report'}</h2>
      {report.isPremium ? (
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold">Introduction</h3>
            <p className="text-gray-700">{sections.introduction}</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold">Life Path Overview</h3>
            <p className="text-gray-700">{sections.lifePath}</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold">Strengths and Opportunities</h3>
            <p className="text-gray-700">{sections.strengths}</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold">Action Plan</h3>
            <p className="text-gray-700">{sections.actionPlan}</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold">Overcoming Challenges</h3>
            <p className="text-gray-700">{sections.challenges}</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold">Aspirational Vision</h3>
            <p className="text-gray-700">{sections.aspirationalVision}</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold">Conclusion</h3>
            <p className="text-gray-700">{sections.conclusion}</p>
          </section>
        </div>
      ) : (
        <div>
          <p className="text-gray-700">{report.content}</p>
          <p className="text-gray-500 italic mt-4">
            Unlock a detailed 1,000+ word premium report for deeper insights!
          </p>
        </div>
      )}
    </div>
  );
};

export default Report;