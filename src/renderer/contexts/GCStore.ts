import { Mat } from 'opencv-ts';

type MathCycle = { cycle?: number; ref: Mat };

/**
 * Garbage Collector
 */
interface GCStoreI {
  mCollection: Array<MathCycle>;

  /**
   * Adiciona ao Garbage Collector
   * @param ref cv.Mat que devera ser removido
   * @param cycle ciclo de execução
   */
  add(ref: Mat, cycle?: number): void;

  // Limpa Garbage Collector
  clear(cycle?: number): void;

  // Sobreescreve os ciclos não definidos
  replaceCycle(cycle: number): void;
}

class GCStore implements GCStoreI {
  mCollection: Array<MathCycle> = [];

  add(ref: Mat, cycle?: number) {
    this.mCollection.push({
      ref,
      cycle,
    });
  }

  clear(cycle?: number) {
    this.mCollection = this.mCollection
      // Delete as referencia ao mat
      .map((mc) => {
        if (
          cycle === undefined ||
          mc.cycle === undefined ||
          mc.cycle === cycle
        ) {
          mc.ref.delete();
        }
        return mc;
      })
      // retorna só o que não foi removido
      .filter(
        (mc) =>
          cycle !== undefined && mc.cycle !== undefined && mc.cycle !== cycle
      );
  }

  replaceCycle(cycle: number) {
    this.mCollection.forEach((mc) => {
      if (mc.cycle === undefined) {
        mc.cycle = cycle;
      }
    });
  }
}

export default new GCStore() as GCStoreI;
