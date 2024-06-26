import { Mat, MatVector } from 'opencv-ts';

type MathCycle = { cycle?: number; ref: Mat | MatVector };

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
  add<T extends Mat | MatVector>(ref: T, cycle?: number): T;

  // Limpa Garbage Collector
  clear(cycle?: number): void;

  // Sobreescreve os ciclos não definidos
  replaceCycle(cycle: number): void;
}

class GCStore implements GCStoreI {
  mCollection: Array<MathCycle> = [];

  add<T extends Mat | MatVector>(ref: T, cycle?: number): T {
    this.mCollection.push({
      ref,
      cycle,
    });
    return ref;
  }

  clear(cycle?: number) {
    this.mCollection = this.mCollection
      // Delete as referencia ao mat
      .map((mc) => {
        if (cycle === undefined || mc.cycle === undefined || mc.cycle === cycle) {
          try {
            mc.ref.delete();
          } catch (ex) {
            console.warn(ex);
          }
        }
        return mc;
      })
      // retorna só o que não foi removido
      .filter((mc) => cycle !== undefined && mc.cycle !== undefined && mc.cycle !== cycle);
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
