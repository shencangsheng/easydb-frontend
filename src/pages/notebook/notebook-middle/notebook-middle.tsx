import { post } from "@/services/api";
import AceEditor from "react-ace";
import {
  faServer,
  faStop,
  faPlay,
  faScrewdriverWrench,
  faAlignLeft,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { memo, useState } from "react";
import { format } from "sql-formatter";
import DataTable from "./notebook-middle-table";

interface NotebookMiddleProps {
  source: string;
}

function NotebookMiddle({ source }: NotebookMiddleProps) {
  const [sql, setSql] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    header: string[];
    rows: string[][];
  }>({ header: [], rows: [] });

  const formatSql = () => {
    setSql(format(sql, { language: "sql", keywordCase: "upper" }));
  };

  return (
    <div
      style={{
        flex: "1",
        textAlign: "center",
        borderLeft: "1px solid rgba(17, 17, 17, 0.15)",
        borderRight: "1px solid rgba(17, 17, 17, 0.15)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 60,
          borderBottom: "1px solid rgba(17, 17, 17, 0.15)",
          backgroundColor: "#F5F5F5", // Even lighter gray
        }}
      >
        <p
          style={{
            fontSize: "20px",
            textAlign: "left",
            paddingLeft: "15px",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <FontAwesomeIcon icon={faServer} style={{ marginRight: "10px" }} />
          {source}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "60%",
          width: "100%",
          overflowY: "auto", // Enable vertical scrolling
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "end",
            paddingBottom: "10px",
            height: "100%",
            width: "60px",
          }}
        >
          <div>
            <Button
              isIconOnly
              isDisabled={source === "" || sql === ""}
              style={{ backgroundColor: "transparent" }}
              onPress={async () => {
                setIsRunning(!isRunning);
                if (!isRunning) {
                  try {
                    setIsLoading(true);
                    const results: {
                      header: string[];
                      rows: string[][];
                    } = await post("/api/fetch", {
                      sql: sql,
                    });
                    setData(results);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsRunning(false);
                    setIsLoading(false);
                  }
                }
              }}
            >
              <FontAwesomeIcon
                icon={isRunning ? faStop : faPlay}
                style={{
                  color: isRunning ? "red" : "#87CEEB",
                  fontSize: "1.2em",
                }}
              />
            </Button>
            <Dropdown placement="bottom-start" isDisabled={sql === ""}>
              <DropdownTrigger>
                <Button variant="light" isIconOnly>
                  <FontAwesomeIcon icon={faScrewdriverWrench} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="format" onPress={formatSql}>
                  <FontAwesomeIcon
                    icon={faAlignLeft}
                    style={{ marginRight: "5px" }}
                  />
                  Format
                </DropdownItem>
                <DropdownItem key="clear" onPress={() => setSql("")}>
                  <FontAwesomeIcon
                    icon={faEraser}
                    style={{ marginRight: "5px" }}
                  />
                  Clear
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div
          className="textarea-container"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            paddingTop: "10px",
          }}
        >
          <AceEditor
            mode="sql"
            theme="github"
            name="editor"
            width="100%"
            height="100%"
            fontSize={16}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            placeholder="Example: SELECT * FROM tablename, or press CTRL + space"
            value={sql}
            onChange={(value) => setSql(value)}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      </div>
      <DataTable data={data} isLoading={isLoading} />
    </div>
  );
}

export default memo(NotebookMiddle);
