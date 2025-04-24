export const oneDayFromNow = () => {
  return new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
};

export const thirtyDayFromNow = () => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
};

export const fifteenminsFromNow = () => {
  return new Date(Date.now() + 15 * 60 * 1000);
};
//

export const fiveMinsAgo = () => {
  return new Date(Date.now() - 5 * 60 * 1000);
};

export const oneHourFromNow = () => {
  return new Date(Date.now() + 1 * 60 * 60 * 1000);
};
