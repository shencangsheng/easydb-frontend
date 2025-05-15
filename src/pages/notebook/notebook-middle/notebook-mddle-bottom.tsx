import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { memo } from "react";
import DataTable from "./notebook-middle-table";

interface NotebookMiddleBottomProps {
  data: {
    header: string[];
    rows: string[][];
  };
  isLoading: boolean;
}

function NotebookMiddleBottom({ data, isLoading }: NotebookMiddleBottomProps) {
  return (
    <div className="flex w-full flex-col">
      <Tabs variant="underlined" defaultSelectedKey="results">
        <Tab key="history" title="Query History">
          <Card>
            <CardBody></CardBody>
          </Card>
        </Tab>
        <Tab key="results" title="Results">
          <DataTable data={data} isLoading={isLoading} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default memo(NotebookMiddleBottom);
