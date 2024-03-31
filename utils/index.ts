export function randomString(length: number) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export async function afterRerender<T>(
  state: Ref<boolean>,
  callback: () => T
): Promise<T> {
  state.value = false;
  await nextTick();
  state.value = true;
  await nextTick();
  return callback();
}
