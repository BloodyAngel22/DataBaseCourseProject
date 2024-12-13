const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const sortData = <T,>(
  data: T[],
  key: keyof T | string, 
  direction: "asc" | "desc"
): T[] => {
  return [...data].sort((a, b) => {
    const valueA = getNestedValue(a, key as string);
    const valueB = getNestedValue(b, key as string);

    const normalizedValueA =
      typeof valueA === "string" ? valueA.trim().toLowerCase() : valueA;
    const normalizedValueB =
      typeof valueB === "string" ? valueB.trim().toLowerCase() : valueB;

    // console.log(`Comparing: "${normalizedValueA}" vs "${normalizedValueB}"`);

    if (normalizedValueA === normalizedValueB) return 0;

    if (typeof normalizedValueA === "string" && typeof normalizedValueB === "string") {
      return direction === "asc"
        ? normalizedValueA.localeCompare(normalizedValueB)
        : normalizedValueB.localeCompare(normalizedValueA);
    }

    return direction === "asc"
      ? (normalizedValueA as number) - (normalizedValueB as number)
      : (normalizedValueB as number) - (normalizedValueA as number);
  });
};


// const sortData = <T,>(data: T[], column: keyof T, direction: "asc" | "desc") => {
//   return [...data].sort((a, b) => {
//     if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
//     if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
//     return 0;
//   });
// };
	
export default sortData;