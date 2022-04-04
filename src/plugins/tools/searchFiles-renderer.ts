import * as glob from 'glob';

const searchFiles = (pattern: string): string[] => {
  return glob.sync(pattern);
};

export default searchFiles;
