import React, { useEffect, useState, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL from "react-map-gl";
import {
  Editor,
  EditingMode,
  DrawPolygonMode,
  DrawCircleFromCenterMode,
} from "react-map-gl-draw";
import * as turf from "@turf/turf";
import centroid from "@turf/centroid";
import { ModifyMode } from "@nebula.gl/edit-modes";
import './styles/style.css'
import { FaBeer } from "react-icons/fa";
import Select from "react-dropdown-select";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pwY3owbGFxMDVwNTNxcXdwMms2OWtzbiJ9.1PPVl0VLUQgqrosrI2nUhg";

const MODES = [
  {
    id: "drawcircle",
    text: " Radius ",
    text2: " ⵔ ",
    handler: DrawCircleFromCenterMode,
  },
  { id: "drawPolygon", text: " Polygon  ⬡", handler: DrawPolygonMode },
];

const DEFAULT_VIEWPORT = {
  width: 800,
  height: 600,
  longitude: -122.45,
  latitude: 37.78,
  zoom: 14,
};

const App = () => {
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler] = useState(null);
  const editorRef = useRef();
  const mapRef = useRef();
  const [editedFeatures, setEditedFeatures] = useState("CLOSING");
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const switchMode = (evt) => {
    const newModeId = evt.target.value === modeId ? null : evt.target.value;
    const mode = MODES.find((m) => m.id === newModeId);
    const newModeHandler = mode ? new mode.handler() : null;
    setModeId(newModeId);
    setModeHandler(newModeHandler);
  };

  const CustomDropdown = ({ icon, text }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      {icon}
      <span style={{ marginLeft: 5 }}>{text}</span>
    </div>
  );
  
  const renderToolbar = () => {
    return (
      <>
        <div style={{ position: "absolute", top: 0, right: 100, padding: 4 }}>
          <button
            style={{ color: "#969b89", marginRight: 20, marginTop: 20 }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
  
        <div style={{ position: "absolute", top: 0, right: 0, maxWidth: "420px" }}>
          <select
            style={{ color: "#969b89", marginRight: 20, marginTop: 20, padding: 4 }}
            onChange={switchMode}
          >
            <option value="draw">Draw</option>
            {MODES.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.text === " Radius " ? (
                  <CustomDropdown icon={<FaBeer />} text={mode.text} />
                ) : (
                  mode.text
                )}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  };
   

  const handleDelete = () => {
    if (editorRef.current) {
      console.log(editorRef.current.deleteFeatures([selectedFeatures]));
    }
    setSelectedFeatures([]);
    setViewport(DEFAULT_VIEWPORT);
  };

  const handleSelect = (selectedFeatures) => {
    console.log("Draw Features:", selectedFeatures.mapCoords);
  };

  return (
    <div>
      <MapGL
        {...viewport}
        ref={mapRef}
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onViewportChange={setViewport}
      >
        <Editor
          ref={editorRef}
          clickRadius={12}
          mode={modeHandler}
          onSelect={handleSelect}
        />
        {renderToolbar()}
      </MapGL>
    </div>
  );
};

export default App;
