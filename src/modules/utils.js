export const getLetterCorrectCase = (letter, isShift, isCaps) => {
  if (isShift && isCaps) {
    return letter.toLowerCase();
  }

  if (!isShift && isCaps) {
    return letter.toUpperCase();
  }

  return letter;
};
