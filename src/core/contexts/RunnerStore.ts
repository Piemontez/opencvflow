import GCStore from './GCStore';
import { useNotificationStore } from '../../ide/components/Notification/store';
import { create } from 'zustand';
import { useNodeStore } from './NodeStore';
import { CVFNodeProcessor } from 'core/types/node';

/**
 * Realiza o processamento dos nós
 * @param nodes
 * @returns
 */
type RunnerState = {
  running: boolean;
  runnerPromise: Promise<true> | null;

  run: () => Promise<void>;
  stop: () => Promise<void>;
  runner: (resolve: (value: true) => void) => Promise<void>;
};

export const useRunnerStore = create<RunnerState>((set, get) => ({
  running: false,
  runnerPromise: null as Promise<true> | null,

  run: async () => {
    if (get().running) {
      useNotificationStore.getState().info('The flow is already running.');
      return;
    }
    const processors = useNodeStore.getState().getProcessos();
    if (!processors.length) {
      useNotificationStore.getState().info('No flow defined.');
      return;
    }

    set({ running: true });

    get().runnerPromise = new Promise(get().runner);
  },

  stop: async () => {
    get().running = false;
    if (get().runnerPromise) {
      await get().runnerPromise;
      get().runnerPromise = null;

      const processors = useNodeStore.getState().getProcessos();
      for (const processor of processors) {
        try {
          if (processor.stop) {
            await processor.stop();
          }
        } catch (err: any) {
          console.error(err);
        }
      }
    }
  },

  runner: async (resolve: (value: true) => void) => {
    const processors = useNodeStore.getState().getProcessos();
    const processorsOrdered: Array<CVFNodeProcessor> = [];

    // Adiciona os nós de processamento de saída no inicio
    processors.filter((proc) => !proc.componentPointer.current.targets?.length).map((_) => processorsOrdered.push(_));

    // Adiciona os nós a partir deste
    for (const processor of processorsOrdered) {
      for (const outEdge of processor.outEdges) {
        if (outEdge?.targetProcessor && !processorsOrdered.includes(outEdge.targetProcessor)) {
          processorsOrdered.push(outEdge.targetProcessor);
        }
      }
    }

    // Adiciona os demais nós
    for (const processor of processors) {
      if (!processorsOrdered.includes(processor)) {
        processorsOrdered.push(processor);
      }
    }

    // Inicializa os nós
    for (const processor of processors) {
      try {
        processor.componentPointer.current.initOutputs();

        await processor.start();
      } catch (err: any) {
        processor.errorMessage = typeof err === 'number' ? `Code error: ${err}` : err?.message || 'Not detected';

        useNotificationStore.getState().danger(`Node ${processor.componentPointer.current.id}: ${processor.errorMessage}`);
      }
      if (!get().running) break;
    }

    // Processa os nós
    let cycle = 0;
    while (get().running) {
      for (const processor of processors) {
        try {
          await processor.proccess();
          if (processor.errorMessage) {
            delete processor.errorMessage;
          }
        } catch (err: any) {
          processor.errorMessage = typeof err === 'number' ? `Code error: ${err}` : err?.message || 'Not detected';

          processor.outputMsg(processor.errorMessage!);
        }
        if (!get().running) break;
      }
      //Pausa para deixar renderizar a tela.
      await new Promise((_res) => setTimeout(_res, 5));

      GCStore.replaceCycle(cycle++);
      GCStore.clear(cycle - 2);
    }

    GCStore.clear();

    resolve(true);
    return;
  },
}));
