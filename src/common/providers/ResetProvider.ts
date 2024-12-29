import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';

const ResetContainer = createContainer(() => {
  const [key, setKey] = useState(() => Date.now());

  const reset = useMemoizedFn(() => setKey(Date.now()));

  return { key, reset };
});

export const ResetProvider = ResetContainer.Provider;
export const useReset = ResetContainer.useContainer;
