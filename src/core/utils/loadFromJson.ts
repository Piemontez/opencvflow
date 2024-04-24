import { useCustomComponentStore } from '../../ide/contexts/CustomComponentStore';
import { useNotificationStore } from '../../ide/components/Notification/store';
import { SaveContentLoaded } from '../../ide/types/SaveContent';
import { useNodeStore } from '../contexts/NodeStore';
import { useProjectStore } from '../../ide/contexts/ProjectStore';

/**
 * Carrega os dados
 */
export const loadFromJson = (jsonLoaded: SaveContentLoaded): boolean => {
  // Aguarda renderizar a tela e carrega a última edição em cache
  try {
    if (!jsonLoaded.custom?.components.length && !jsonLoaded.nodesLoaded.length) {
      return false;
    }

    // Limpa os custom componentes existentes
    useCustomComponentStore.getState().clear();
    // Limpa os nós e arestas
    useNodeStore.getState().clear();

    // Carrega o nome do projeto
    useProjectStore.getState().changeName(jsonLoaded.projectName);

    // Carrega os tipo de nó customizados
    if (jsonLoaded.custom?.components) {
      for (const customComponent of jsonLoaded.custom.components) {
        useCustomComponentStore.getState().add(customComponent);
      }
    }

    // Adiciona os nós
    useNodeStore.getState().refreshNodes(jsonLoaded.nodesLoaded);

    // Adiciona as conecções
    jsonLoaded.edgesLoaded.forEach(({ data, ...rest }) => {
      useNodeStore.getState().onConnect(rest as any);
    });

    useNodeStore.getState().refreshFlow();

    setTimeout(useNodeStore.getState().fitView, 100);

    return true;
  } catch (err: any) {
    console.error(err);
    useNotificationStore.getState().danger(err.message);
  }
  return false;
};
