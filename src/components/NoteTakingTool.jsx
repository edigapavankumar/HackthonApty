import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS

const NoteTakingTool = () => {
  const [globalNotes, setGlobalNotes] = useState([]);
  const [localNotes, setLocalNotes] = useState({});
  const [newNote, setNewNote] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentView, setCurrentView] = useState("global"); // Track which view (global/local) is active
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null); // To edit specific note
  const [editedNote, setEditedNote] = useState(""); // For editing note in place

  // Get current page URL
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentUrl(tabs[0]?.url || "Unknown Page");
    });

    // Load stored notes
    chrome.storage.local.get(["globalNotes", "localNotes"], (data) => {
      setGlobalNotes(data.globalNotes || []);
      setLocalNotes(data.localNotes || {});
    });
  }, []);

  // Save Notes to Chrome Storage
  const saveNotes = (key, value) => {
    chrome.storage.local.set({ [key]: value });
  };

  // Add a new note
  const addNote = (type) => {
    if (!newNote.trim()) return;

    if (type === "global") {
      const updatedNotes = [...globalNotes, newNote];
      setGlobalNotes(updatedNotes);
      saveNotes("globalNotes", updatedNotes);
    } else {
      const updatedLocalNotes = {
        ...localNotes,
        [currentUrl]: [...(localNotes[currentUrl] || []), newNote],
      };
      setLocalNotes(updatedLocalNotes);
      saveNotes("localNotes", updatedLocalNotes);
    }

    setNewNote(""); // Clear input
  };

  // Start editing a note
  const editNote = (type, index) => {
    if (type === "global") {
      setEditedNote(globalNotes[index]);
      setSelectedNoteIndex(index);
    } else {
      setEditedNote(localNotes[currentUrl][index]);
      setSelectedNoteIndex(index);
    }
  };

  // Save edited note
  const saveEditedNote = (type) => {
    if (!editedNote.trim()) return;

    if (type === "global") {
      const updatedNotes = [...globalNotes];
      updatedNotes[selectedNoteIndex] = editedNote;
      setGlobalNotes(updatedNotes);
      saveNotes("globalNotes", updatedNotes);
    } else {
      const updatedLocalNotes = { ...localNotes };
      updatedLocalNotes[currentUrl][selectedNoteIndex] = editedNote;
      setLocalNotes(updatedLocalNotes);
      saveNotes("localNotes", updatedLocalNotes);
    }

    setEditedNote(""); // Clear edited note
    setSelectedNoteIndex(null); // Reset selected note index
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditedNote(""); // Reset the edited note
    setSelectedNoteIndex(null); // Reset selected note index
  };

  // Remove Note
  const removeNote = (type, index) => {
    if (type === "global") {
      const updatedNotes = globalNotes.filter((_, i) => i !== index);
      setGlobalNotes(updatedNotes);
      saveNotes("globalNotes", updatedNotes);
    } else {
      const updatedLocalNotes = { ...localNotes };
      updatedLocalNotes[currentUrl] = updatedLocalNotes[currentUrl].filter(
        (_, i) => i !== index
      );
      setLocalNotes(updatedLocalNotes);
      saveNotes("localNotes", updatedLocalNotes);
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        width: "300px",
        height: "500px",
        overflow: "hidden",
      }}
    >
      <h3
        className="text-center mb-3"
        style={{ fontSize: "16px", marginBottom: "15px" }}
      >
        Smart Notes
      </h3>

      {/* Input for new note */}
      <TextField
        label="Write a note..."
        variant="outlined"
        fullWidth
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        style={{ marginBottom: "10px", fontSize: "12px" }}
        size="small"
      />

      {/* Add Note Buttons */}
      <div className="d-flex justify-content-around mb-2">
        <Button
          variant="contained"
          color="primary"
          onClick={() => addNote("global")}
          style={{ fontSize: "10px", padding: "5px" }}
        >
          Add Global Note
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => addNote("local")}
          style={{ fontSize: "10px", padding: "5px" }}
        >
          Add Local Note
        </Button>
      </div>

      {/* Navigation between Global and Local Notes */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="outlined"
          color={currentView === "global" ? "primary" : "default"}
          onClick={() => setCurrentView("global")}
          style={{ fontSize: "10px", padding: "5px", width: "45%" }}
        >
          Global Notes
        </Button>
        <Button
          variant="outlined"
          color={currentView === "local" ? "primary" : "default"}
          onClick={() => setCurrentView("local")}
          style={{ fontSize: "10px", padding: "5px", width: "45%" }}
        >
          Local Notes
        </Button>
      </Box>

      {/* Notes List */}
      <h5 style={{ fontSize: "12px", marginBottom: "5px" }}>
        {currentView === "global"
          ? "Global Notes"
          : `Local Notes for ${currentUrl}`}
      </h5>

      <List
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          padding: "0",
          fontSize: "10px",
        }}
      >
        {(currentView === "global"
          ? globalNotes
          : localNotes[currentUrl] || []
        ).map((note, index) => (
          <ListItem key={index} style={{ padding: "5px 0", fontSize: "12px" }}>
            {selectedNoteIndex === index ? (
              <div style={{ display: "flex", width: "100%" }}>
                <TextField
                  variant="outlined"
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  fullWidth
                  size="small"
                  style={{ marginRight: "5px", fontSize: "12px" }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => saveEditedNote(currentView)}
                  size="small"
                  style={{ fontSize: "10px", padding: "5px" }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="default"
                  onClick={cancelEdit}
                  size="small"
                  style={{ fontSize: "10px", padding: "5px", marginLeft: "5px" }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", width: "100%" }}>
                <ListItemText primary={note} />
                <IconButton
                  color="primary"
                  onClick={() => editNote(currentView, index)}
                  style={{ padding: "5px" }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => removeNote(currentView, index)}
                  style={{ padding: "5px" }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default NoteTakingTool;
