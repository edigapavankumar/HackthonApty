import React, { useState } from "react";
import { Button, Form, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

const AdBlocker = () => {
  const [adBlockerEnabled, setAdBlockerEnabled] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);
  const [newFilter, setNewFilter] = useState("");

  const handleAddFilter = () => {
    if (newFilter.trim()) {
      setCustomFilters([...customFilters, newFilter.trim()]);
      setNewFilter("");
    }
  };

  return (
    <div>
      <h3>Ad Blocker</h3>
      <ToggleButtonGroup
        type="checkbox"
        value={adBlockerEnabled}
        onChange={(val) => setAdBlockerEnabled(val)}
      >
        <ToggleButton value={true}>On</ToggleButton>
        <ToggleButton value={false}>Off</ToggleButton>
      </ToggleButtonGroup>

      <Form.Group className="mt-3">
        <Form.Label>Add Custom Filter</Form.Label>
        <Form.Control
          type="text"
          value={newFilter}
          onChange={(e) => setNewFilter(e.target.value)}
          placeholder="Enter domain to block"
        />
        <Button className="mt-2" onClick={handleAddFilter}>
          Add Filter
        </Button>
      </Form.Group>

      <div className="mt-3">
        <h5>Custom Filters</h5>
        <ul>
          {customFilters.map((filter, index) => (
            <li key={index}>{filter}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdBlocker;
