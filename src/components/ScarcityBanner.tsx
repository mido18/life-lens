import { ReportData } from '../types/user';

// Report component to display free or premium report
interface ReportProps {
  report: ReportData;
}

const Report: React.FC<ReportProps> = ({ report }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{report.isPremium ? 'Premium Life Report' : 'Free Life Report'}</h2>
      {report.isPremium && report.sections ? (
        <div className="space-y-6">
          {report.sections.introduction && (
            <section>
              <h3 className="text-xl font-semibold">Introduction</h3>
              <p className="text-gray-700">{report.sections.introduction}</p>
            </section>
          )}
          {report.sections.lifePath && (
            <section>
              <h3 className="text-xl font-semibold">Life Path Overview</h3>
              <p className="text-gray-700">{report.sections.lifePath}</p>
            </section>
          )}
          {report.sections.strengths && (
            <section>
              <h3 className="text-xl font-semibold">Strengths and Opportunities</h3>
              <p className="text-gray-700">{report.sections.strengths}</p>
            </section>
          )}
          {report.sections.actionPlan && (
            <section>
              <h3 className="text-xl font-semibold">Action Plan</h3>
              <p className="text-gray-700">{report.sections.actionPlan}</p>
            </section>
          )}
          {report.sections.challenges && (
            <section>
              <h3 className="text-xl font-semibold">Overcoming Challenges</h3>
              <p className="text-gray-700">{report.sections.challenges}</p>
            </section>
          )}
          {report.sections.aspirationalVision && (
            <section>
              <h3 className="text-xl font-semibold">Aspirational Vision</h3>
              <p className="text-gray-700">{report.sections.aspirationalVision}</p>
            </section>
          )}
          {report.sections.conclusion && (
            <section>
              <h3 className="text-xl font-semibold">Conclusion</h3>
              <p className="text-gray-700">{report.sections.conclusion}</p>
            </section>
          )}
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