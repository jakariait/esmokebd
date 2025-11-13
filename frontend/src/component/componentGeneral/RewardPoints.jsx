import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Button,
} from "@mui/material";
import { Add, Remove, CheckCircle } from "@mui/icons-material";

const RewardPoints = ({ availablePoints, points, onPointsChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [useMax, setUseMax] = useState(true);
  const [inputPoints, setInputPoints] = useState(availablePoints); // local input state

  useEffect(() => {
    // When availablePoints change, reset input
    setInputPoints(availablePoints);
  }, [availablePoints]);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setUseMax(checked);
    const newPoints = checked ? availablePoints : 0;
    setInputPoints(newPoints); // update local input
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    const clampedValue = Math.max(0, Math.min(value, availablePoints)); // between 0 and availablePoints
    setInputPoints(clampedValue);
    if (clampedValue !== availablePoints) {
      setUseMax(false);
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    onPointsChange(inputPoints); // only update parent on Apply
  };

  return (
    <div className="rounded-md shadow ">
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary
          expandIcon={expanded ? <Remove /> : <Add />}
          sx={{
            backgroundColor: "transparent",
            fontWeight: "bold",
          }}
        >
          <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2  font-semibold">
            Use Reward Points
          </h1>
        </AccordionSummary>
        <AccordionDetails className="bg-white px-4 py-4 space-y-4">
          <p className="text-gray-800">
            You have{" "}
            <span className="text-blue-900 font-medium">
              {availablePoints} Reward Points
            </span>{" "}
            available
          </p>

          <input
            type="number"
            value={inputPoints}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={useMax}
              onChange={handleCheckboxChange}
              icon={<CheckCircle className="text-gray-400" />}
              checkedIcon={<CheckCircle className="text-blue-900" />}
            />
            <span className="text-gray-800">
              Use maximum{" "}
              <span className="text-blue-900 font-medium">
                {availablePoints} Reward Points
              </span>
            </span>
          </div>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleApply}
            sx={{
              textTransform: "none",
              backgroundColor: "black",
              "&:hover": { backgroundColor: "#222" },
            }}
          >
            Apply
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default RewardPoints;
