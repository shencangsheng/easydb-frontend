import { downloadFile, post } from "@/services/api";
import {
  faCode,
  faDownload,
  faFileCsv,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import { sql } from "sql-formatter";

type TableRow = {
  id: string;
  values: string[];
  index: number;
};

interface TableProps {
  data: {
    header: string[];
    rows: string[][];
  };
  isLoading: boolean;
  sql: string;
}

const transformTableData = (rows: string[][]): TableRow[] => {
  return rows.map((row, index) => ({
    id: `row-${index}`,
    values: [`${index + 1}`, ...row],
    index: index,
  }));
};

function getHeader(header: string[]) {
  const headers = [];
  headers.push(
    <TableColumn
      key="row-number"
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid rgba(17, 17, 17, 0.15)",
        width: "40px",
      }}
    >
      #
    </TableColumn>
  );
  header?.forEach((column) => {
    headers.push(
      <TableColumn
        key={column}
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid rgba(17, 17, 17, 0.15)",
          fontWeight: "bold",
          fontSize: "0.9em",
        }}
      >
        {column}
      </TableColumn>
    );
  });
  return headers;
}

function DataTable({ data, isLoading, sql }: TableProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<TableRow | null>(null);

  const handleRowDoubleClick = (item: TableRow) => {
    setSelectedItem(item);
    onOpen();
  };

  async function exportResults(fileType: string) {
    await downloadFile("/api/query/export", {
      sql: sql,
      file_type: fileType,
    });
  }

  return (
    <div
      style={{
        display: "flex",
        height: "calc(40vh - 50px)",
        width: "100%",
        overflow: "hidden",
        // border: "1px solid rgba(17, 17, 17, 0.15)",
      }}
    >
      <div
        style={{
          justifyContent: "flex-end",
          paddingTop: "15px",
        }}
      >
        <Dropdown placement="bottom-start" isDisabled={data.rows.length === 0}>
          <DropdownTrigger>
            <Button variant="light" isIconOnly>
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="csv"
              onPress={async () => await exportResults("CSV")}
            >
              <FontAwesomeIcon
                icon={faFileCsv}
                style={{ marginRight: "5px" }}
              />
              CSV
            </DropdownItem>
            <DropdownItem
              key="json"
              onPress={async () => await exportResults("JSON")}
            >
              <FontAwesomeIcon icon={faCode} style={{ marginRight: "5px" }} />
              JSON
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Table
        isVirtualized={true}
        maxTableHeight={500}
        rowHeight={40}
        radius={"none"}
      >
        <TableHeader>{getHeader(data.header)}</TableHeader>
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
                  style={{
                    whiteSpace: "nowrap",
                    ...(index === 0
                      ? {
                          position: "sticky",
                          left: 0,
                          backgroundColor: "#f5f5f5",
                          zIndex: 1,
                        }
                      : {
                          backgroundColor:
                            item.index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                        }),
                    borderBottom: "1px solid rgba(17, 17, 17, 0.15)",
                  }}
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
                    {selectedItem.values
                      .filter((_value, index) => index !== 0)
                      .map((value, index) => (
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
