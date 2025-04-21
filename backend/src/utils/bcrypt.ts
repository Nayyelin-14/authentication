import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltRound?: number) => {
  return bcrypt.hash(value, saltRound || 10);
};

export const compareValue = async (value: string, hashValue: string) => {
  return bcrypt.compare(value, hashValue).catch(() => false);
};
