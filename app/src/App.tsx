import { useSkillStore } from './useSkillStore';
import { TopicSelector } from './components/TopicSelector';
import { DataManagement } from './components/DataManagement';

function App() {
  const {
    userData,
    isLoading,
    error,
    showExportReminder,
    addSkill,
    removeSkill,
    exportData,
    importData,
  } = useSkillStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  const trackedTopicIds = userData.skills.map((s) => s.topicId);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          🎯 Knowledge Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Track your skills and learning progress
        </p>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        <TopicSelector
          trackedTopicIds={trackedTopicIds}
          customTopics={userData.customTopics}
          onAddTopic={(topicId) => addSkill(topicId)}
          onRemoveTopic={(topicId) => removeSkill(topicId)}
        />

        <DataManagement
          onExport={exportData}
          onImport={importData}
          showExportReminder={showExportReminder}
          lastExported={userData.lastExported}
        />
      </main>
    </div>
  );
}

export default App;
