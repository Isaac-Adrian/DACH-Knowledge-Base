import { useState } from 'react';
import { useSkillStore } from './useSkillStore';
import { TopicSelector } from './components/TopicSelector';
import { DataManagement } from './components/DataManagement';
import { SkillList } from './components/SkillList';
import { LogTimeModal } from './components/LogTimeModal';
import { SkillDetailModal } from './components/SkillDetailModal';

function App() {
  const {
    userData,
    isLoading,
    error,
    showExportReminder,
    addSkill,
    removeSkill,
    updateSkillLevel,
    setSkillGoal,
    updateSkillNotes,
    exportData,
    importData,
  } = useSkillStore();

  const [logTimeTopicId, setLogTimeTopicId] = useState<string | null>(null);
  const [detailTopicId, setDetailTopicId] = useState<string | null>(null);
  const [showTopicLibrary, setShowTopicLibrary] = useState(false);

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
  const selectedSkill = detailTopicId 
    ? userData.skills.find((s) => s.topicId === detailTopicId)
    : null;

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
        {/* Skill List - Main view */}
        <SkillList
          skills={userData.skills}
          customTopics={userData.customTopics}
          onLevelChange={(topicId, level) => updateSkillLevel(topicId, level)}
          onLogTime={(topicId) => setLogTimeTopicId(topicId)}
          onViewDetails={(topicId) => setDetailTopicId(topicId)}
        />

        {/* Topic Library Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowTopicLibrary(!showTopicLibrary)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {showTopicLibrary ? '📚 Hide Topic Library' : '📚 Add New Topics'}
          </button>
        </div>

        {/* Topic Selector */}
        {showTopicLibrary && (
          <TopicSelector
            trackedTopicIds={trackedTopicIds}
            customTopics={userData.customTopics}
            onAddTopic={(topicId) => addSkill(topicId)}
            onRemoveTopic={(topicId) => removeSkill(topicId)}
          />
        )}

        <DataManagement
          onExport={exportData}
          onImport={importData}
          showExportReminder={showExportReminder}
          lastExported={userData.lastExported}
        />
      </main>

      {/* Log Time Modal */}
      {logTimeTopicId && (
        <LogTimeModal
          topicId={logTimeTopicId}
          customTopics={userData.customTopics}
          onSubmit={(minutes) => {
            updateSkillLevel(
              logTimeTopicId,
              userData.skills.find((s) => s.topicId === logTimeTopicId)?.level || 1,
              minutes
            );
            setLogTimeTopicId(null);
          }}
          onClose={() => setLogTimeTopicId(null)}
        />
      )}

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          customTopics={userData.customTopics}
          onUpdateNotes={(notes) => {
            updateSkillNotes(selectedSkill.topicId, notes);
          }}
          onSetGoal={(goalLevel, goalDate) => {
            setSkillGoal(selectedSkill.topicId, goalLevel, goalDate);
          }}
          onClose={() => setDetailTopicId(null)}
        />
      )}
    </div>
  );
}

export default App;
