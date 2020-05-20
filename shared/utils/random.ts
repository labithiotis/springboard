import crypto from 'crypto';

export const randomString = (partial?: string): string => {
  const random = crypto.randomBytes(20).toString('hex');
  return partial ? `${partial}-${random}` : random;
};

export const randomNumber = (min: number = 0, max: number = 10000): number => {
  const random = Math.random() * (max - min) + min;
  return Math.round(random);
};

export const randomPort = (): number => {
  return randomNumber(10000, 20000);
};
