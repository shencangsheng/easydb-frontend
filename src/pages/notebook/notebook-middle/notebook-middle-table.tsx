import { faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { memo, useState } from "react";

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<TableRow | null>(null);

  const handleRowDoubleClick = (item: TableRow) => {
    setSelectedItem(item);
    onOpen();
  };

  return (
    <div
      style={{
        height: "calc(40vh - 60px)",
        width: "100%",
        overflow: "hidden",
        // border: "1px solid rgba(17, 17, 17, 0.15)",
      }}
    >
      <Table
        aria-label="Example table with dynamic content"
        isVirtualized={true}
        maxTableHeight={500}
        rowHeight={40}
        isStriped
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
            <TableRow
              key={item.id}
              onDoubleClick={() => handleRowDoubleClick(item)}
            >
              {item.values.map((value, index) => (
                <TableCell
                  key={`${item.id}-${index}`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        style={{ maxWidth: "40vw" }}
      >
        <ModalContent>
          <ModalHeader>Row details</ModalHeader>
          <ModalBody>
            {selectedItem && (
              <div
                style={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <table className="w-full border-collapse border border-gray-200">
                  <tbody>
                    {selectedItem.values.map((value, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <th className="py-2 px-4 text-left bg-gray-50 font-medium">
                          {data.header[index]}
                        </th>
                        <td className="py-2 px-4">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default memo(DataTable);
