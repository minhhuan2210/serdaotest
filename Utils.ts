export const _isValidIBAN = (text: string) => {
  if (text.length === 0 || text === '') return false;
  const [, head, tail] = text.split(/(^\w{4})(\w+)$/),
    rearrange = `${tail}${head}`,
    replace = rearrange
      .split('')
      .map(c =>
        /[a-z]/i.test(c) ? c.toLowerCase().charCodeAt(0) - 87 : parseInt(c, 10),
      )
      .join('');
  return BigInt(replace) % 97n === 1n;
};
