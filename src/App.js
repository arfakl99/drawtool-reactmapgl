import React, { useEffect, useState, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL from "react-map-gl";
import {
  Editor,
  EditingMode,
  DrawPolygonMode,
  DrawCircleFromCenterMode,
} from "react-map-gl-draw";

import "./styles/style.css";
import { FaBeer } from "react-icons/fa";
import Select, { components } from "react-select";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pwY3owbGFxMDVwNTNxcXdwMms2OWtzbiJ9.1PPVl0VLUQgqrosrI2nUhg";

const MODES = [
  {
    id: "drawcircle",
    text: " Radius",
    icon: require("./images/circle.png"),
    handler: DrawCircleFromCenterMode,
  },
  {
    id: "drawPolygon",
    text: " Polygon ",
    icon: require("./images/polygon.png"),
    handler: DrawPolygonMode,
  },
];

const DEFAULT_VIEWPORT = {
  width: 800,
  height: 600,
  longitude: 73.05232198377377,
  latitude: 33.71650794185521,
  zoom: 14,
};

const App = () => {
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler] = useState(null);
  const [modeId2, setModeId2] = useState(null);
  const [modeHandler2, setModeHandler2] = useState(null);

  const editorRef = useRef();
  const mapRef = useRef();
  const [editedFeatures, setEditedFeatures] = useState("CLOSING");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [currentShape, setCurrentShape] = useState(null);
  const [drawnFeaturesInfo, setDrawnFeaturesInfo] = useState([]);
  const [drawingComplete, setDrawingComplete] = useState(false);

  

  const switchMode2 = (newValue) => {
    const newModeId = newValue.value;
    const mode = MODES.find((m) => m.id === newModeId);
    const newModeHandler = mode ? new mode.handler() : null;

    if (newModeHandler instanceof DrawCircleFromCenterMode) {
      setModeHandler(new DrawCircleFromCenterMode());
    } else if (newModeHandler instanceof DrawPolygonMode) {
      setModeHandler(new DrawPolygonMode());
    }

    setModeId2(newModeId);
    debugger;
  };

  const options = MODES.map((mode) => ({
    value: mode.id,
    label: mode.text,
    icon: mode.icon,
  }));

  const IconOption = (props) => (
    <components.Option {...props}>
      <img src={props.data.icon} style={{ width: 24 }} alt={props.data.label} />
      <span style={{ marginLeft: 8 }}>{props.data.label}</span>
    </components.Option>
  );

  const MultiValueOption = (props) => (
    <components.MultiValue {...props}>
      <img src={props.data.icon} style={{ width: 36 }} alt={props.data.label} />
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#969b89" : "white",
      color: state.isSelected ? "white" : "#969b89",
      cursor: "pointer",
      display: "flex", // Make the option content inline
      alignItems: "center", // Center the icon and text vertically
    }),
    optionLabel: {
      
      flex: 1, // Allow the label to take up remaining space
    },
    optionIcon: { 
      width: 10,
      height: 10, 
      marginRight: 10, 
    },
    
  };
  const renderToolbar = () => {
    const selectedOption2 = options.find((option) => option.value === modeId2);
    return (
      <>
        <div style={{ position: "absolute", top: 0, right: 100, padding: 4 }}>
          <button
            style={{ color: "#969b89", marginRight: 20, marginTop: 10,width:70, height:30 }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>

        {/* div2 */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 20,
            maxWidth: "420px",
          }}
        >
          <Select
            placeholder={"Draw"}
            value={selectedOption2}
            onChange={switchMode2}
            options={options}
            components={{
              Option: IconOption,
              MultiValue: MultiValueOption,
            }}
            styles={customStyles}
          />
        </div>
      </>
    );
  };

  const handleDelete = () => {
    if (editorRef.current) {
      editorRef.current.deleteFeatures([selectedFeatures]);
    }
    // setSelectedFeatures([]);
    // setViewport(DEFAULT_VIEWPORT);
  };

  const handleFeatureUpdate = (features) => {
    console.log("All Drawn Feature Info:", features);
    if (features.data.length > 1) {
      const lastFeature = features.data[features.data.length - 1];
      editorRef.current.deleteFeatures(0);
      setTimeout(() => editorRef.current.addFeatures(lastFeature), 100);

      //
      // editorRef.current.deleteFeatures(features.data[0]);
      // editorRef.current.
      // setDrawnFeaturesInfo([lastFeature]);
    } else {
      setDrawnFeaturesInfo(features.data);
    }
  };

  const handleSelect = (selectedFeatures) => {
    console.log("selectefFeature are " + selectedFeatures);
    if (selectedFeatures.length > 0) {
      const selectedFeature = selectedFeatures[0];
      console.log("Selected Features:", selectedFeatures);

      if (currentShape) {
        if (editorRef.current) {
          editorRef.current.deleteFeatures([currentShape]);
        }
      }

      setCurrentShape(selectedFeature);
      console.log("Current Shape:", currentShape);
    }
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
          // onUpdate={handleGetFeatures}
          onUpdate={handleFeatureUpdate}
        />
        {renderToolbar()}
      </MapGL>
    </div>
  );
};

export default App;
