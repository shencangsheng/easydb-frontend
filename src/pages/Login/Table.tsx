import { faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { memo } from "react";

type TableRow = {
  id: string;
  values: string[];
};

interface TableProps {
  data: {
    header: string[];
    rows: string[][];
  };
  isLoading: boolean;
}

const transformTableData = (rows: string[][]): TableRow[] => {
  return rows.map((row, index) => ({
    id: `row-${index}`,
    values: row,
  }));
};

function DataTable({ data, isLoading }: TableProps) {
  return (
    <div
      style={{
        height: "calc(40vh - 60px)",
        width: "100%",
        overflow: "auto",
        border: "1px solid rgba(17, 17, 17, 0.15)",
      }}
    >
      <Table
        aria-label="Example table with dynamic content"
        isVirtualized={true}
        maxTableHeight={500}
        rowHeight={40}
      >
        <TableHeader>
          {data.header.map((column) => (
            <TableColumn key={column}>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={transformTableData(data.rows)}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#666",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FontAwesomeIcon icon={faTable} size="2x" />
              <p>No data available</p>
              <p style={{ fontSize: "14px" }}>
                Run a query to see results here
              </p>
            </div>
          }
        >
          {(item: TableRow) => (
            <TableRow key={item.id}>
              {item.values.map((value, index) => (
                <TableCell key={`${item.id}-${index}`}>{value}</TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default memo(DataTable);
