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
import React, { memo, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NotebookLeftProps {}

type Path = "Sources" | "Databases" | "Tables";

interface CatalogEntry {
  id: number;
  table_ref: string;
  table_path: string;
  table_schema: any[]; // Changed from [] to any[]
}

// eslint-disable-next-line no-empty-pattern
function NotebookLeft({}: NotebookLeftProps) {
  const [location, setLocation] = useState<Path[]>(["Sources"]);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [databases] = useState<string[]>(["default"]); // Removed setDatabases as it's not used
  const [tables, setTables] = useState<string[]>([]);

  const getCurrentLocation = (pop = false) => {
    if (pop) {
      const newLocation = [...location];
      newLocation.pop();
      setLocation(newLocation);
      return newLocation[newLocation.length - 1];
    }
    return location[location.length - 1];
  };

  const getIcon = () => {
    switch (getCurrentLocation()) {
      case "Databases":
        return faServer;
      case "Tables":
        return faDatabase;
      default:
        return faServer; // Default icon or handle error
    }
  };

  const handleSourceSelect = (source: string) => {
    setSelectedSource(source);
    setLocation(["Databases"]);
  };

  const handleDatabaseSelect = async (dbName: string) => {
    setSelectedDatabase(dbName);
    setLocation(["Databases", "Tables"]);
    try {
      const catalog: CatalogEntry[] = await get("/api/catalog");
      // Filter tables by selectedDatabase if your API supports it or if catalog contains all tables
      // For now, assuming catalog returns tables for the "default" database or all tables
      setTables(catalog.map((p) => p.table_ref));
    } catch (error) {
      console.error("Failed to fetch catalog:", error);
      setTables([]); // Reset tables on error
    }
  };

  const handleBack = () => {
    const newLocation = [...location];
    newLocation.pop();
    setLocation(newLocation);
    const current = newLocation[newLocation.length - 1];
    if (current === "Databases") {
      setTables([]); // Clear tables when going back to database list
    } else if (current === "Sources") {
      setSelectedSource("");
      setSelectedDatabase(""); // Also clear selected database
      setTables([]);
    }
  };

  if (location.length === 0 || getCurrentLocation() === "Sources") {
    return (
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
          aria-label="Sources List"
          onAction={(key) => handleSourceSelect(key.toString())}
          disabledKeys={["MySQL", "PostgreSQL"]} // Example disabled keys
          style={{
            width: "100%",
            textAlign: "left",
          }}
        >
          <ListboxItem
            key="EasyDB"
            startContent={<FontAwesomeIcon icon={faServer} />}
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
    );
  }

  return (
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
          onPress={handleBack}
          style={{
            backgroundColor: "transparent",
            fontSize: "16px",
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <FontAwesomeIcon icon={getIcon()} style={{ marginRight: "5px" }} />
        {getCurrentLocation() === "Databases"
          ? selectedSource
          : selectedDatabase}
      </p>
      <p
        style={{
          fontSize: "16px",
          textAlign: "left",
          paddingLeft: "10px",
          fontWeight: "bold",
          color: "gray",
        }}
      >
        {tables.length === 0 ? "Databases" : "Tables"}
      </p>
      {tables.length === 0 ? (
        <FilterList
          items={databases} // Show list of databases
          icon={<FontAwesomeIcon icon={faDatabase} />}
          onSelect={handleDatabaseSelect}
        />
      ) : (
        <FilterList
          items={tables} // Show list of tables
          icon={<FontAwesomeIcon icon={faTable} />}
          onSelect={(tableName: string) => {
            // Handle table selection, e.g., display schema or data
            console.log("Selected table:", tableName);
          }}
        />
      )}
    </div>
  );
}

export default memo(NotebookLeft);
