import { ApiResponse, post } from "@/services/api";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/ext-language_tools";
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
import NotebookMiddleBottom from "./notebook-mddle-bottom";
import { AxiosError } from "axios";

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
    query_time: string;
  }>({ header: [], rows: [], query_time: "" });

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
          height: "45%",
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
              isDisabled={sql === ""}
              style={{ backgroundColor: "transparent" }}
              onPress={async () => {
                setIsRunning(!isRunning);
                if (!isRunning) {
                  try {
                    setData({ header: [], rows: [], query_time: "" });
                    setIsLoading(true);
                    const results: {
                      header: string[];
                      rows: string[][];
                      query_time: string;
                    } = await post("/api/fetch", {
                      sql: sql,
                    });
                    setData(results);
                  } catch (error) {
                    const axiosError = error as AxiosError<
                      ApiResponse<unknown>
                    >;
                    if (axiosError.status !== 502) {
                      setData({
                        header: ["Error"],
                        rows: [
                          [
                            axiosError?.response?.data?.resp_msg ??
                              "Unknown error",
                          ],
                        ],
                        query_time: "<1ms",
                      });
                    }
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
      <div style={{ marginTop: "20px", marginLeft: "50px" }}>
        <NotebookMiddleBottom
          data={data}
          isLoading={isLoading}
          setSql={setSql}
          sql={sql}
        />
      </div>
    </div>
  );
}

export default memo(NotebookMiddle);
