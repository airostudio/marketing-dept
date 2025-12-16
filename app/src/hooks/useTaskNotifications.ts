// Custom hook for task lifecycle notifications
import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface TaskStatusMap {
  [taskId: string]: string;
}

export function useTaskNotifications() {
  const { tasks, workers } = useStore();
  const previousTasksRef = useRef<TaskStatusMap>({});

  useEffect(() => {
    const currentTaskStatuses: TaskStatusMap = {};

    tasks.forEach((task) => {
      const previousStatus = previousTasksRef.current[task.id];
      const currentStatus = task.status;

      currentTaskStatuses[task.id] = currentStatus;

      // Skip if this is the first time we're seeing this task
      if (!previousStatus) {
        return;
      }

      // Task started
      if (previousStatus === 'pending' && currentStatus === 'in_progress') {
        const worker = workers.find(w => w.id === task.workerId);
        toast.success(
          `${worker?.emoji || '🤖'} ${worker?.name || 'Agent'} started: ${task.description}`,
          {
            duration: 3000,
            icon: '🚀',
          }
        );
      }

      // Task completed successfully
      if (previousStatus === 'in_progress' && currentStatus === 'completed') {
        const worker = workers.find(w => w.id === task.workerId);
        toast.success(
          `${worker?.emoji || '🤖'} ${worker?.name || 'Agent'} completed: ${task.description}`,
          {
            duration: 4000,
            icon: '✅',
          }
        );
      }

      // Task failed
      if (previousStatus === 'in_progress' && currentStatus === 'failed') {
        const worker = workers.find(w => w.id === task.workerId);
        toast.error(
          `${worker?.emoji || '🤖'} ${worker?.name || 'Agent'} failed: ${task.description}`,
          {
            duration: 5000,
          }
        );
      }
    });

    // Update reference for next comparison
    previousTasksRef.current = currentTaskStatuses;
  }, [tasks, workers]);
}
