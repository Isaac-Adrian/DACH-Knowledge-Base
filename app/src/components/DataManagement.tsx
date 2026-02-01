import { useRef } from 'react';

interface DataManagementProps {
  onExport: () => Promise<string>;
  onImport: (jsonString: string) => Promise<void>;
  showExportReminder: boolean;
  lastExported?: string;
}

export function DataManagement({
  onExport,
  onImport,
  showExportReminder,
  lastExported,
}: DataManagementProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const json = await onExport();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `knowledge-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await onImport(text);
      alert('Data imported successfully!');
    } catch (error) {
      alert('Failed to import data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Never';
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        💾 Data Management
      </h2>

      {showExportReminder && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Reminder:</strong> It's been a while since your last backup. Consider exporting your data to keep it safe!
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            📤 Export Data
          </button>
          <button
            onClick={handleImportClick}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            📥 Import Data
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Last exported: <span className="font-medium">{formatDate(lastExported)}</span>
        </p>

        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <p className="font-medium mb-2">💡 Why backup?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your data is stored locally in this browser</li>
            <li>Clearing browser data will delete your progress</li>
            <li>Export regularly to keep your data safe</li>
            <li>Import to restore data or sync across devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
