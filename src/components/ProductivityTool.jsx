import React, { useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";

const ProductivityTracker = () => {
  const [tracking, setTracking] = useState(true);
  const [timeData, setTimeData] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(60); // Default daily limit in minutes
  const [currentPage, setCurrentPage] = useState(""); // Track current page URL

  // Function to update the time data in localStorage
  const saveTimeData = (data) => {
    localStorage.setItem("timeData", JSON.stringify(data));
  };

  // Load time data from localStorage
  const loadTimeData = () => {
    const savedData = localStorage.getItem("timeData");
    if (savedData) {
      setTimeData(JSON.parse(savedData));
    }
  };

  // Initialize time data when the component loads
  useEffect(() => {
    loadTimeData();
  }, []);

  // Track page URL change
  useEffect(() => {
    const handlePageChange = () => {
      const currentSite = window.location.href; // Get full URL of the current site

      // If the page has changed, reset the timer for the new page
      if (currentPage !== currentSite) {
        setCurrentPage(currentSite);
        setTimeData((prevData) => {
          // Stop tracking for the previous site
          return prevData.map((site) =>
            site.name === currentPage ? { ...site, isTracking: false } : site
          );
        });
      }
    };

    handlePageChange(); // Initial page load
    const interval = setInterval(handlePageChange, 6000); // Update every 6 seconds (for demo purposes)

    return () => clearInterval(interval);
  }, [currentPage]);

  // Function to update time for the current website
  useEffect(() => {
    if (tracking && currentPage) {
      const interval = setInterval(() => {
        setTimeData((prevData) => {
          const newData = [...prevData];
          const existingSite = newData.find((site) => site.name === currentPage);

          if (existingSite) {
            existingSite.time += 6; // Increment time by 6 seconds (tracked every 6 seconds)
          } else {
            newData.push({ name: currentPage, time: 6, isTracking: true });
          }

          saveTimeData(newData); // Save data to localStorage
          return newData;
        });
      }, 6000); // Update every 6 seconds

      return () => clearInterval(interval);
    }
  }, [tracking, currentPage]);

  // Reset time data
  const handleReset = () => {
    setTimeData([]);
    localStorage.removeItem("timeData"); // Remove from localStorage on reset
  };

  // Set daily limit for tracking
  const handleSetDailyLimit = (e) => {
    setDailyLimit(Number(e.target.value));
  };

  return (
    <div>
      <h3>Productivity Tracker</h3>
      <Button onClick={() => setTracking(!tracking)}>
        {tracking ? "Stop Tracking" : "Start Tracking"}
      </Button>

      <Form.Group className="mt-3">
        <Form.Label>Set Daily Limit (minutes)</Form.Label>
        <Form.Control
          type="number"
          value={dailyLimit}
          onChange={handleSetDailyLimit}
          placeholder="Enter daily limit"
        />
      </Form.Group>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Website</th>
            <th>Time Spent (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {timeData.map((site, index) => (
            <tr key={index}>
              <td>{site.name}</td>
              <td>{site.time}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="danger" onClick={handleReset}>
        Reset Data
      </Button>
    </div>
  );
};

export default ProductivityTracker;
