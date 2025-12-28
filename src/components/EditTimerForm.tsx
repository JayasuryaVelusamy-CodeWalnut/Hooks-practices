import { memo } from 'react';
import { Timer } from '../types/timer';

interface EditTimerFormProps {
  timer: Timer;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditTimerForm: React.FC<EditTimerFormProps> = memo(
  ({ timer, onNameChange, onDescriptionChange, onSave, onCancel }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (timer.name.trim()) {
        onSave();
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="timer-name" className="block text-sm font-medium text-gray-700 mb-1">
            Timer Name *
          </label>
          <input
            id="timer-name"
            type="text"
            value={timer.name}
            onChange={e => onNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter timer name"
            required
            maxLength={100}
            aria-label="Timer name"
          />
        </div>

        <div>
          <label
            htmlFor="timer-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="timer-description"
            value={timer.description}
            onChange={e => onDescriptionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
            rows={3}
            maxLength={500}
            aria-label="Timer description"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            disabled={!timer.name.trim()}
            aria-label="Save timer"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            aria-label="Cancel editing"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }
);
