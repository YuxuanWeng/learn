import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

export const spotPanelLoader = async ({ params }: LoaderFunctionArgs) => {
  const { internalCode } = params;
  return { internalCode };
};

export const useSpotPanelLoader = () => useLoaderData() as Awaited<ReturnType<typeof spotPanelLoader>>;
