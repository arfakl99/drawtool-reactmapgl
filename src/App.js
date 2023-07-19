import React, { useEffect, useState, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL from "react-map-gl";
import {
  Editor,
  DrawPolygonMode,
  DrawCircleFromCenterMode,
} from "react-map-gl-draw";

import "./styles/style.css";

import Select, { components } from "react-select";
import { PiPolygon } from 'react-icons/pi';
import { BiMinusCircle} from 'react-icons/bi';
import { TiDelete} from 'react-icons/ti';
import { AiFillDelete} from 'react-icons/ai';
const MAPBOX_TOKEN =
  "pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pwY3owbGFxMDVwNTNxcXdwMms2OWtzbiJ9.1PPVl0VLUQgqrosrI2nUhg";

const MODES = [
  {
    id: "drawPolygon",
    text: " Polygon ",
    icon: <PiPolygon size={18} />,
    handler: DrawPolygonMode,
  },
  {
    id: "drawcircle",
    text: " Radius",
    icon: <BiMinusCircle size={18} />,
    handler: DrawCircleFromCenterMode,
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
  

  

  const switchMode2 = (newValue) => {
    const newModeId = newValue.value;
    if (newModeId === "delete") {
      handleDelete(); 
      return; 
    }
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
  

  const options = [
    ...MODES.map((mode) => ({
      value: mode.id,
      label: mode.text,
      icon: mode.icon,
    })),
    {
      value: "delete",
      label: "Delete",
      icon: <AiFillDelete size={18} />, 
    },
  ];

  const IconOption = (props) => (
    <components.Option {...props}>
      <span style={{ fontSize: 15, fontWeight: 400 }}>{props.data.label}</span>
      {props.data.icon}
    </components.Option>
  );

  const MultiValueOption = (props) => (
    <components.MultiValue {...props}>
      <img src={props.data.icon} style={{ width: 18 }} alt={props.data.label} />
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#969b89" : "white",
      color: state.isSelected ? "white" : "#969b89",
      cursor: "pointer",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-around",
      padding: "0px -1px",
      marginTop:"5px"
      
      
    
     
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "#969b89", // Change the color of the placeholder text here
      fontSize: "16.5px",
      fontWeight: 600,
    }),
   
    
  };
  const renderToolbar = () => {
    const selectedOption2 = options.find((option) => option.value === modeId2);
    return (
      <>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 20,
            fontSize:16.5,
            fontWeight:600,
            color:"black",
            width:140
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
  };

  const handleFeatureUpdate = (features) => {
    console.log("All Drawn Feature Info:", features);
    if (features.data.length > 1) {
      const lastFeature = features.data[features.data.length - 1];
      editorRef.current.deleteFeatures(0);
      setTimeout(() => editorRef.current.addFeatures(lastFeature), 100);
    } else {
      setDrawnFeaturesInfo(features.data);
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
          onUpdate={handleFeatureUpdate}
        />
        {renderToolbar()}
      </MapGL>
    </div>
  );
};

export default App;
