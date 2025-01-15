import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-sql";

import "ace-builds/src-noconflict/ext-language_tools";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronLeft,
  faSearch,
  faDatabase,
  faFolderOpen,
  faServer,
  faPlay,
  faStop,
  faScrewdriverWrench,
  faAlignLeft,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { format } from "sql-formatter";

import FilterList from "@/components/common/FilterList";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("database");
  const [selectedSource, setSelectedSource] = React.useState("");
  const [isRunning, setIsRunning] = React.useState(false);
  const [sql, setSql] = React.useState("");
  const databases = ["default"];

  const formatSql = () => {
    setSql(format(sql, { language: "sql", keywordCase: "upper" }));
  };

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <div>
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="full"
        className="px-8 data-[menu-open=true]:border-solid"
      >
        <NavbarContent justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            icon={() => (
              <FontAwesomeIcon
                icon={isMenuOpen ? faChevronLeft : faBars}
                style={{ height: "1.2em" }}
              />
            )}
          />
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          <NavbarBrand style={{ width: "100px" }}>
            <AcmeLogo />
            <p className="font-bold text-inherit">EasyDB</p>
          </NavbarBrand>
          <NavbarItem>
            <Input
              labelPlacement="outside"
              placeholder="Search data and saved documents..."
              startContent={<FontAwesomeIcon icon={faSearch} />}
              variant="bordered"
              style={{ width: "600px", textAlign: "left" }}
            />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" style={{ paddingLeft: "200px" }}>
          <NavbarItem className="hidden lg:flex">
            <Link href="#">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="warning" href="#" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu
          className="border border-gray-300 rounded-md p-2 w-1/5"
          style={{ width: "300px", border: "none" }}
        >
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full block p-2 rounded hover:bg-gray-200"
                color={
                  index === 2
                    ? "warning"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "top",
          height: "calc(100vh - 65px)",
          gap: "0px",
        }}
      >
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
              onPress={() => setSelected("database")}
              style={{
                backgroundColor: "transparent",
                fontSize: "21px",
                padding: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={faDatabase}
                size="lg"
                color={selected === "database" ? "#000000" : "gray"}
                className="hover:text-black"
              />
            </Button>

            <Button
              isIconOnly
              aria-label="Like"
              onPress={() => setSelected("file")}
              style={{
                backgroundColor: "transparent",
                fontSize: "21px",
                padding: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={faFolderOpen}
                size="lg"
                color={selected === "file" ? "#000000" : "gray"}
                className="hover:text-black"
              />
            </Button>
          </div>
          {selectedSource === "" ? (
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
                onAction={(value) => setSelectedSource(value.toString())}
                disabledKeys={["MySQL", "PostgreSQL"]}
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
                  onPress={() => setSelectedSource("")}
                  style={{
                    backgroundColor: "transparent",
                    fontSize: "16px",
                  }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <FontAwesomeIcon
                  icon={faServer}
                  style={{ marginRight: "5px" }}
                />
                {selectedSource}
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
                Databases
              </p>
              <FilterList items={databases} />
            </div>
          )}
        </div>
        <div
          style={{
            flex: "1",
            textAlign: "center",
            borderLeft: "1px solid rgba(17, 17, 17, 0.15)",
            borderRight: "1px solid rgba(17, 17, 17, 0.15)",
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
              <FontAwesomeIcon
                icon={faServer}
                style={{ marginRight: "10px" }}
              />
              {selectedSource}
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
                  isDisabled={selectedSource === "" || sql === ""}
                  style={{ backgroundColor: "transparent" }}
                  onPress={() => setIsRunning(!isRunning)}
                >
                  <FontAwesomeIcon
                    icon={isRunning ? faStop : faPlay}
                    style={{
                      color: isRunning ? "red" : "#87CEEB",
                      fontSize: "1.2em",
                    }}
                  />
                </Button>
                <Dropdown
                  placement="bottom-start"
                  isDisabled={selectedSource === "" || sql === ""}
                >
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
              />
            </div>
          </div>
          <div>Item 4</div>
        </div>
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
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
