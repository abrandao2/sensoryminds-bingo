const isCornerCell = (coords: string, rowColMaxIndex: number): boolean => {
  const minMax = `0,${rowColMaxIndex}`;
  const maxMin = `${rowColMaxIndex},0`;
  const maxMax = `${rowColMaxIndex},${rowColMaxIndex}`;

  const cases = ['0,0', minMax, maxMin, maxMax];

  return cases.includes(coords);
};

export default isCornerCell;