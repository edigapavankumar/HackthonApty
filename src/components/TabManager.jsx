import React, { useState, useEffect } from "react";
import { Button, ListGroup, Form, Table } from "react-bootstrap";

const TabManager = () => {
  const [tabs, setTabs] = useState([]);
  const [savedSessions, setSavedSessions] = useState([]);
  const [sessionName, setSessionName] = useState("");

  // Fetch all open tabs
  const fetchTabs = async () => {
    const allTabs = await chrome.tabs.query({});
    setTabs(allTabs);
  };

  // Group tabs by category
  const groupTabs = (tabs) => {
    const categories = {
      Social: ["facebook.com", "twitter.com", "instagram.com"],
      Work: ["docs.google.com", "trello.com", "slack.com"],
      News: ["nytimes.com", "bbc.com", "cnn.com"],
    };

    const groupedTabs = {};

    tabs.forEach((tab) => {
      const url = new URL(tab.url).hostname;
      let category = "Other";

      for (const [key, values] of Object.entries(categories)) {
        if (values.some((domain) => url.includes(domain))) {
          category = key;
          break;
        }
      }

      if (!groupedTabs[category]) {
        groupedTabs[category] = [];
      }
      groupedTabs[category].push(tab);
    });

    return groupedTabs;
  };

  // Save current session to localStorage
  const saveSession = () => {
    if (sessionName.trim()) {
      const newSession = {
        name: sessionName,
        tabs: tabs.map((tab) => ({ url: tab.url, title: tab.title })),
      };
      const updatedSessions = [...savedSessions, newSession];
      setSavedSessions(updatedSessions);
      localStorage.setItem("savedSessions", JSON.stringify(updatedSessions)); // Save to localStorage
      setSessionName(""); // Clear session name input
    }
  };

  // Restore a saved session
  const restoreSession = (session) => {
    session.tabs.forEach((tab) => {
      chrome.tabs.create({ url: tab.url });
    });
  };

  // Delete a saved session
  const deleteSession = (index) => {
    const updatedSessions = savedSessions.filter((_, i) => i !== index);
    setSavedSessions(updatedSessions);
    localStorage.setItem("savedSessions", JSON.stringify(updatedSessions)); // Update localStorage
  };

  // Load saved sessions from localStorage on component mount
  useEffect(() => {
    const storedSessions = localStorage.getItem("savedSessions");
    if (storedSessions) {
      setSavedSessions(JSON.parse(storedSessions)); // Load from localStorage
    }
    fetchTabs(); // Fetch current tabs
  }, []);

  const groupedTabs = groupTabs(tabs);

  return (
    <div>
      <h3>Tab Manager</h3>
      <Button onClick={fetchTabs} className="mb-3">
        Refresh Tabs
      </Button>

      <h5>Grouped Tabs</h5>
      <div>
        {Object.entries(groupedTabs).map(([category, tabs]) => (
          <div key={category}>
            <h6>{category}</h6>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tab Title</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {tabs.map((tab) => (
                  <tr key={tab.id}>
                    <td>{tab.title}</td>
                    <td>
                      <a href={tab.url} target="_blank" rel="noopener noreferrer">
                        {tab.url}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ))}
      </div>

      <h5 className="mt-4">Save Session</h5>
      <Form.Group>
        <Form.Control
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="Enter session name"
        />
        <Button onClick={saveSession} className="mt-2">
          Save Current Session
        </Button>
      </Form.Group>

      <h5 className="mt-4">Saved Sessions</h5>
      <ListGroup>
        {savedSessions.map((session, index) => (
          <ListGroup.Item key={index}>
            <div className="d-flex justify-content-between align-items-center">
              <span>{session.name}</span>
              <div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => restoreSession(session)}
                >
                  Restore
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteSession(index)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TabManager;
