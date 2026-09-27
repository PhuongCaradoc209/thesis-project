export type Vector3Tuple = [number, number, number];

export function toVector3(value: number[] | undefined, fallback: Vector3Tuple): Vector3Tuple {
  if (value?.length === 3 && value.every(Number.isFinite)) {
    return [value[0], value[1], value[2]];
  }

  return fallback;
}
