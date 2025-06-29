export interface SeedStock {
  name: string;
  image: string;
  value: number;
}

export interface CosmeticStock extends SeedStock {}
export interface EggStock extends SeedStock {}
export interface GearStock extends SeedStock {}
export interface RestockTimers {
  seeds: number;
  gears: number;
  eggs: number;
  cosmetics: number;
  honey: number;
}
export interface Stock {
  gearStock: GearStock[];
  eggStock: EggStock[];
  cosmeticsStock: CosmeticStock[];
  seedsStock: SeedStock[];
  restockTimers: RestockTimers;
}
