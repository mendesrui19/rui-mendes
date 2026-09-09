declare module "meshline" {
  export class MeshLineGeometry {
    setPoints(points: unknown): void;
  }
  export class MeshLineMaterial {
    constructor(params?: Record<string, unknown>);
  }
}
