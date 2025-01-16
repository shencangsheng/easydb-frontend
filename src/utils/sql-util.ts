/* eslint-disable @typescript-eslint/no-explicit-any */
import parser from "js-sql-parser";

function extractTableNameFromNode(value: any, tableNames: Set<string>) {
  if (!value) {
    return;
  }
  switch (value.type) {
    case "TableReference":
    case "TableFactor":
    case "SubQuery":
      extractTableNameFromNode(value.value, tableNames);
      break;
    case "TableReferences":
      value.value.forEach((element: any) => {
        extractTableNameFromNode(element, tableNames);
      });
      break;
    case "InnerCrossJoinTable":
      extractTableNameFromNode(value?.left, tableNames);
      extractTableNameFromNode(value?.right, tableNames);
      break;
    case "Select":
      extractTableNameFromNode(value.from, tableNames);
      break;
    case "Identifier":
      tableNames.add(value.value);
      break;
  }
}

export function extractTableNames(sql: string): Set<string> {
  const value = parser.parse(sql)?.value?.from?.value[0];
  const tableNames = new Set<string>();
  extractTableNameFromNode(value, tableNames);
  return tableNames;
}
