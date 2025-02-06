import { useState, useCallback } from 'react';
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';

export const useUIState = () => {
  const { ui: { showSettings }, setShowSettings } = useImageGeneratorStore();
  const [isGenerating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);

  const addLog = useCallback((log: string) => {
    setLogs(prev => [...prev, log]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const updateProgress = useCallback((newProgress: number) => {
    setProgress(Math.min(Math.max(newProgress, 0), 100));
  }, []);

  const startGeneration = useCallback(() => {
    setGenerating(true);
    setProgress(0);
    clearLogs();
    addLog('Starting image generation...');
  }, [clearLogs, addLog]);

  const finishGeneration = useCallback(() => {
    setGenerating(false);
    setProgress(100);
    addLog('Generation complete!');
  }, [addLog]);

  const handleError = useCallback((error: string) => {
    setGenerating(false);
    setProgress(0);
    addLog(`Error: ${error}`);
  }, [addLog]);

  return {
    // Settings state
    isSettingsOpen: showSettings,
    setSettingsOpen: setShowSettings,

    // Help modal state
    isHelpModalOpen,
    setHelpModalOpen,

    // Generation state
    isGenerating,
    setGenerating,
    startGeneration,
    finishGeneration,

    // Progress state
    progress,
    setProgress: updateProgress,

    // Logs state
    logs,
    addLog,
    clearLogs,
    handleError
  };
};
