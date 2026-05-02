export const maxDaysInMonth = (() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return new Date(year, month + 1, 0).getDate();
})();
