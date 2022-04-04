const evalFile = async (fileName: string): Promise<any> => {
  return await eval(`import(${fileName})`);
};

export default evalFile;
