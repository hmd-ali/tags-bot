let TAG_PREFIX = "$";

export const setTagPrefix = (prefix: string) => {
  TAG_PREFIX = prefix;
};

export const getTagPrefix = () => TAG_PREFIX;
