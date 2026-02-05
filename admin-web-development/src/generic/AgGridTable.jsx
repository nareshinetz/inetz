import React from "react";
import { AgGridReact } from "ag-grid-react";
import { myTheme } from "./AgGridTheme";

const AgGridTable = ({
  rowData = [],
  columnDefs = [],
  loadingMessage = "Loading data...",
  height = 620,
}) => {
  return (
    <div style={{ height: height, width: "100%" }}>
      <AgGridReact
        theme={myTheme}
        rowData={Array.isArray(rowData) ? rowData : []}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        animateRows={true}
        domLayout="normal"
        alwaysShowVerticalScroll={true}
        suppressHorizontalScroll={false}
        loadingOverlayComponentParams={{
          loadingMessage,
        }}
      />
    </div>
  );
};

export default AgGridTable;