import GCStore from './GCStore';
import { useNotificationStore } from '../../ide/components/Notification/store';
import { create } from 'zustand';
import { useNodeStore } from './NodeStore';

type RunnerState = {
  running: boolean;
  runner: Promise<true> | null;

  run: () => Promise<void>;
  stop: () => Promise<void>;
};

export const useRunnerStore = create<RunnerState>((set, get) => ({
  running: false,
  runner: null as Promise<true> | null,

  run: async () => {
    if (get().running) {
      useNotificationStore.getState().info('The flow is already running.');
      return;
    }
    const { nodes } = useNodeStore.getState();
    if (!nodes.length) {
      useNotificationStore.getState().info('No flow defined.');
      return;
    }

    get().running = true;

    get().runner = new Promise(async (resolve) => {
      for (const node of nodes) {
        try {
          node.data.processor.componentPointer.current.initOutputs();

          await node.data.processor.start();
        } catch (err: any) {
          node.data.processor.errorMessage = typeof err === 'number' ? `Code error: ${err}` : err?.message || 'Not detected';

          useNotificationStore.getState().danger(`Node ${node.id}: ${node.data.processor.errorMessage}`);
        }
        if (!get().running) break;
      }

      let cycle = 0;
      while (get().running) {
        for (const node of nodes) {
          try {
            await node.data.processor.proccess();
            if (node.data.processor.errorMessage) {
              delete node.data.processor.errorMessage;
            }
          } catch (err: any) {
            node.data.processor.errorMessage = typeof err === 'number' ? `Code error: ${err}` : err?.message || 'Not detected';

            node.data.processor.outputMsg(node.data.processor.errorMessage!);
          }
          if (!get().running) break;
        }
        await new Promise((_res) => setTimeout(_res, 10));

        GCStore.replaceCycle(cycle++);
        GCStore.clear(cycle - 2);
      }

      GCStore.clear();

      resolve(true);
    });
  },

  stop: async () => {
    get().running = false;
    if (get().runner) {
      await get().runner;
      get().runner = null;

      const { nodes } = useNodeStore.getState();
      for (const node of nodes) {
        try {
          if (node.data.processor.stop) {
            await node.data.processor.stop();
          }
        } catch (err: any) {
          console.error(err);
        }
      }
    }
  },
}));
