import { TableBody } from "@nextui-org/react";

export default function EmptyTableData() {
  return (
    <>
      <TableBody emptyContent="No data">{[]}</TableBody>
    </>
  );
}
