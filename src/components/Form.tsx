import { FormEvent } from 'react';
import { UserInput } from '../types/user';

// Form component for user inputs
interface FormProps {
  onSubmit: (event: FormEvent, input: UserInput) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input: UserInput = {
      name: formData.get('name') as string,
      ageRange: formData.get('ageRange') as string,
      biggestGoal: formData.get('biggestGoal') as string,
      personalityWord: formData.get('personalityWord') as string,
      currentMood: formData.get('currentMood') as string,
      challenge: formData.get('challenge') as string,
      areaOfFocus: formData.getAll('areaOfFocus') as string[],
      riskComfortLevel: formData.get('riskComfortLevel') as string,
      dreamDestination: formData.get('dreamDestination') as string,
      fateVsPath: formData.get('fateVsPath') as string,
    };
    onSubmit(event, input);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Age Range</label>
        <select
          name="ageRange"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
        >
          <option value="">Select</option>
          <option value="Under 18">Under 18</option>
          <option value="18-24">18-24</option>
          <option value="25-34">25-34</option>
          <option value="35-44">35-44</option>
          <option value="45+">45+</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Biggest Goal</label>
        <select
          name="biggestGoal"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
        >
          <option value="">Select</option>
          <option value="Career Success">Career Success</option>
          <option value="Personal Growth">Personal Growth</option>
          <option value="Relationships">Relationships</option>
          <option value="Health">Health</option>
          <option value="Adventure/Travel">Adventure/Travel</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Personality Word</label>
        <input
          type="text"
          name="personalityWord"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Current Mood</label>
        <select
          name="currentMood"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
        >
          <option value="">Select</option>
          <option value="Excited">Excited</option>
          <option value="Curious">Curious</option>
          <option value="Stressed">Stressed</option>
          <option value="Hopeful">Hopeful</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Challenge (Optional)</label>
        <textarea
          name="challenge"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Area of Focus (Select all that apply)</label>
        <div className="mt-2 space-y-2">
          {['Career', 'Relationships', 'Personal Growth', 'Health', 'Finances'].map((focus) => (
            <label key={focus} className="flex items-center">
              <input
                type="checkbox"
                name="areaOfFocus"
                value={focus}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{focus}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Risk Comfort Level</label>
        <select
          name="riskComfortLevel"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
        >
          <option value="">Select</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Dream Destination/Experience</label>
        <input
          type="text"
          name="dreamDestination"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fate vs. Path Belief</label>
        <select
          name="fateVsPath"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
        >
          <option value="">Select</option>
          <option value="Fate">Fate</option>
          <option value="My Own Path">My Own Path</option>
          <option value="A Mix">A Mix</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Generate Free Report
      </button>
    </form>
  );
};

export default Form;