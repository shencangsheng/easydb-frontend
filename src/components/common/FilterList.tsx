import { useState } from "react";

const FilterList = ({ items }: { items: string[] }) => {
  const [filterText, setFilterText] = useState("");

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Filter items..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {filteredItems.map((item, index) => (
          <li
            key={index}
            style={{ padding: "8px", borderBottom: "1px solid #eee" }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterList;
