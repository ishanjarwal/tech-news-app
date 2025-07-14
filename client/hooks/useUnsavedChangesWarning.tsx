import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useUnsavedChangesWarning = (
  hasUnsavedChanges: boolean,
  exitAction: (...props: any) => void
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome to show prompt
    };

    const handleUnload = () => {
      if (hasUnsavedChanges) {
        exitAction();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [hasUnsavedChanges]);
};
