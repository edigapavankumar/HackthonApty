import React, { useState } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import {
  FaAd,
  FaStickyNote,
  FaTachometerAlt,
  FaLayerGroup,
} from "react-icons/fa"; // Correctly imported icons

import AdBlocker from "./components/AdBlocker";
import NoteTakingTool from "./components/NoteTakingTool";
import ProductivityTracker from "./components/ProductivityTool";
import TabManager from "./components/TabManager";

const App = () => {
  const [activeFeature, setActiveFeature] = useState("");

  return (
    <Container className="text-center">
      <Row className="my-5">
        <Col>
          {/* Four Icon Buttons */}
          <div className="d-flex justify-content-around">
            <Card
              style={{ width: "100px", cursor: "pointer" }}
              onClick={() => setActiveFeature("adBlocker")}
              className="p-2 d-flex flex-column align-items-center"
            >
              <FaAd size={30} />
              <Card.Body className="p-1 mt-2">
                <Card.Text>Ad Blocker</Card.Text>
              </Card.Body>
            </Card>

            <Card
              style={{ width: "100px", cursor: "pointer" }}
              onClick={() => setActiveFeature("noteTaking")}
              className="p-2 d-flex flex-column align-items-center"
            >
              <FaStickyNote size={30} />
              <Card.Body className="p-1 mt-2">
                <Card.Text>Notes</Card.Text>
              </Card.Body>
            </Card>

            <Card
              style={{ width: "100px", cursor: "pointer" }}
              onClick={() => setActiveFeature("productivity")}
              className="p-2 d-flex flex-column align-items-center"
            >
              <FaTachometerAlt size={30} />
              <Card.Body className="p-1 mt-2">
                <Card.Text>Productivity</Card.Text>
              </Card.Body>
            </Card>

            <Card
              style={{ width: "100px", cursor: "pointer" }}
              onClick={() => setActiveFeature("tabManager")}
              className="p-2 d-flex flex-column align-items-center"
            >
              <FaLayerGroup size={30} />
              <Card.Body className="p-1 mt-2">
                <Card.Text>Tabs</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Conditionally Render Content Based on Active Feature */}
      {activeFeature === "adBlocker" && <AdBlocker />}
      {activeFeature === "noteTaking" && <NoteTakingTool />}
      {activeFeature === "tabManager" && <TabManager />}
      {activeFeature === "productivity" && <ProductivityTracker />}
    </Container>
  );
};

export default App;
