import { CollectionConfig } from './types';

export const cleanBody = (body: any, path: CollectionConfig[]) => {
  const result = { ...body };
  for (let i = 0; i < path.length; i++) {
    const { idField, keepInDoc } = path[i];
    if (!keepInDoc) {
      delete result[idField];
    }
  }
  return result;
};
