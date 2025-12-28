import { memo } from 'react';

interface TimerActionsProps {
  onStartEdit: () => void;
  onDelete: () => void;
  onCancelDelete: () => void;
  showConfirm: boolean;
}

export const TimerActions: React.FC<TimerActionsProps> = memo(
  ({ onStartEdit, onDelete, onCancelDelete, showConfirm }) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={onStartEdit}
          className="flex-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          aria-label="Edit timer"
        >
          Edit
        </button>
        {showConfirm ? (
          <>
            <button
              onClick={onDelete}
              className="flex-1 px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              aria-label="Confirm delete timer"
            >
              Confirm Delete
            </button>
            <button
              onClick={onCancelDelete}
              className="flex-1 px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              aria-label="Cancel delete"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={onDelete}
            className="flex-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            aria-label="Delete timer"
          >
            Delete
          </button>
        )}
      </div>
    );
  }
);

TimerActions.displayName = 'TimerActions';
