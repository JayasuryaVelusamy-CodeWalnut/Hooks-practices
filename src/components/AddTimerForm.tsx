import { memo, useState } from 'react';

interface AddTimerFormProps {
  onSubmit: (name: string, description: string) => void;
  isCreating: boolean;
}

export const AddTimerForm: React.FC<AddTimerFormProps> = memo(({ onSubmit, isCreating }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name, description);
      setName('');
      setDescription('');
    }
  };

  return (
    <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Create New Timer</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-timer-name" className="block text-sm font-medium text-gray-700 mb-1">
            Timer Name *
          </label>
          <input
            id="new-timer-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter timer name"
            required
            maxLength={100}
            aria-label="New timer name"
          />
        </div>

        <div>
          <label
            htmlFor="new-timer-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="new-timer-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
            rows={3}
            maxLength={500}
            aria-label="New timer description"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating || !name.trim()}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          aria-label="Create new timer"
        >
          {isCreating ? 'Creating...' : 'Create Timer'}
        </button>
      </form>
    </div>
  );
});

AddTimerForm.displayName = 'AddTimerForm';
