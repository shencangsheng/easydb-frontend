import FilterList from "@/components/common/filter-list";
import {
  faChevronLeft,
  faDatabase,
  faServer,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Listbox, ListboxItem } from "@heroui/react";
import { get } from "@/services/api";
import { memo, useState } from "react";

interface NotebookLeftProps {
  source: string;
  setSource: (source: string) => void;
}

interface Catalog {
  id: number;
  table_ref: string;
  table_path: string;
  table_schema: [];
}

function NotebookLeft({ source, setSource }: NotebookLeftProps) {
  const [tables, setTables] = useState<Catalog[]>([]);

  async function refreshTables() {
    const catalog: Catalog[] = await get("/api/catalog");
    setTables(catalog);
  }

  return (
    <div
      style={{
        width: "350px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          height: 60,
          borderBottom: "1px solid rgba(17, 17, 17, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        <Button
          isIconOnly
          aria-label="Like"
          style={{
            backgroundColor: "transparent",
            fontSize: "21px",
            padding: "10px",
          }}
        >
          <FontAwesomeIcon
            icon={faDatabase}
            size="lg"
            color={"#000000"}
            className="hover:text-black"
          />
        </Button>{" "}
      </div>
      {source === "" ? (
        <div>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "left",
              paddingLeft: "15px",
              paddingTop: "10px",
              color: "gray",
            }}
          >
            Sources
          </p>
          <Listbox
            aria-label="Dynamic Actions"
            onAction={(value) => {
              setSource(value.toString());
            }}
            disabledKeys={["MySQL", "PostgreSQL"]}
            style={{
              width: "100%",
              textAlign: "left",
            }}
          >
            <ListboxItem
              key="EasyDB"
              startContent={<FontAwesomeIcon icon={faServer} />}
              onPress={() => {
                refreshTables();
              }}
            >
              EasyDB
            </ListboxItem>
            <ListboxItem
              key="MySQL"
              startContent={<FontAwesomeIcon icon={faServer} />}
            >
              MySQL
            </ListboxItem>
            <ListboxItem
              key="PostgreSQL"
              startContent={<FontAwesomeIcon icon={faServer} />}
            >
              PostgreSQL
            </ListboxItem>
          </Listbox>
        </div>
      ) : (
        <div>
          <p
            style={{
              fontSize: "16px",
              textAlign: "left",
              paddingLeft: "1px",
              paddingTop: "3px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              isIconOnly
              onPress={() => {
                setSource("");
              }}
              style={{
                backgroundColor: "transparent",
                fontSize: "16px",
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <FontAwesomeIcon icon={faDatabase} style={{ marginRight: "5px" }} />
            {source}
          </p>
          <p
            style={{
              fontSize: "16px",
              textAlign: "left",
              paddingLeft: "10px",
              fontWeight: "bold",
              color: "gray", // Set text color to gray
            }}
          >
            Tables
          </p>
          <FilterList
            items={tables.map((table) => table.table_ref)}
            icon={<FontAwesomeIcon icon={faTable} />}
          />
        </div>
      )}
    </div>
  );
}

export default memo(NotebookLeft);
