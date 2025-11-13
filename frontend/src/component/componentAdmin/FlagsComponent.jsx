import React, { useEffect, useState } from "react";
import useFlagStore from "../../store/useFlagStore";
import {
  Button,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { DragIndicator as DragIndicatorIcon } from "@mui/icons-material";

const SortableFlag = ({ flag }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: flag._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { updateFlag, deleteFlag, fetchFlags } = useFlagStore();

  const [updateFlagName, setUpdateFlagName] = useState("");
  const [updateIsActive, setUpdateIsActive] = useState(true);
  const [selectedFlagId, setSelectedFlagId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [flagToDelete, setFlagToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSelectFlagForUpdate = (id, name, isActive) => {
    setSelectedFlagId(id);
    setUpdateFlagName(name);
    setUpdateIsActive(isActive);
  };

  const handleUpdateFlag = async () => {
    if (!selectedFlagId || !updateFlagName) return;
    try {
      await updateFlag(selectedFlagId, {
        name: updateFlagName,
        isActive: updateIsActive,
      });
      setUpdateFlagName("");
      setUpdateIsActive(true);
      setSelectedFlagId(null);
      fetchFlags();
      showSnackbar("Flag updated successfully!", "success");
    } catch (err) {
      showSnackbar("Failed to update flag", "error");
    }
  };

  const openDeleteConfirmation = (id) => {
    setFlagToDelete(id);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteDialog(false);
    setFlagToDelete(null);
  };

  const handleDeleteFlag = async () => {
    try {
      await deleteFlag(flagToDelete);
      setOpenDeleteDialog(false);
      setFlagToDelete(null);
      fetchFlags();
      showSnackbar("Flag deleted successfully!", "success");
    } catch (err) {
      showSnackbar("Failed to delete flag", "error");
      setOpenDeleteDialog(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Box className="flex justify-between bg-gray-100 items-center p-4 rounded-md">
        <Box className="flex items-center">
          <div
            {...attributes}
            {...listeners}
            style={{ cursor: "grab", touchAction: "none" }}
          >
            <DragIndicatorIcon />
          </div>
          <Typography variant="body1" className="font-medium ml-2">
            {flag.name} ({flag.isActive ? "Active" : "Inactive"})
          </Typography>
        </Box>
        <Box className="flex items-center justify-center lg:gap-10">
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              handleSelectFlagForUpdate(flag._id, flag.name, flag.isActive)
            }
            className="mr-2"
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => openDeleteConfirmation(flag._id)}
          >
            Delete
          </Button>
        </Box>
      </Box>
      {selectedFlagId === flag._id && (
        <Box className="my-4">
          <TextField
            label="Update Flag Name"
            variant="outlined"
            value={updateFlagName}
            onChange={(e) => setUpdateFlagName(e.target.value)}
            fullWidth
            className="rounded-md"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={updateIsActive}
                onChange={(e) => setUpdateIsActive(e.target.checked)}
                color="primary"
              />
            }
            label="Active"
            className="mt-2"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpdateFlag}
            className="mt-2"
          >
            Update Flag
          </Button>
        </Box>
      )}
      <Dialog open={openDeleteDialog} onClose={closeDeleteConfirmation}>
        <DialogTitle>Delete Flag</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this flag?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteFlag}
            color="secondary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ zIndex: 9999 }}
      />
    </div>
  );
};

const FlagsComponent = () => {
  const { flags, loading, error, fetchFlags, createFlag, updateFlagPositions } =
    useFlagStore();

  const [newFlagName, setNewFlagName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  useEffect(() => {
    setItems(flags);
  }, [flags]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCreateFlag = async () => {
    if (!newFlagName) return;
    try {
      await createFlag({ name: newFlagName, isActive: true });
      setNewFlagName("");
      fetchFlags();
      showSnackbar("Flag created successfully!", "success");
    } catch (err) {
      showSnackbar("Failed to create flag", "error");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const flagIds = items.map((item) => item._id);
      await updateFlagPositions(flagIds);
      fetchFlags(); // Re-fetch flags to update the UI with the new order
      showSnackbar("Flag order updated successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to update flag order.", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  return (
    <Box className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Flags Management
      </h1>
      {loading && items.length === 0 ? (
        <>
          <div className={"grid grid-cols-2 gap-10"}>
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
          </div>
          <div className={"grid grid-cols-2 gap-10 mt-4 mb-4"}>
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
          </div>
          <Skeleton height={100} width={"100%"} className={"mb-4"} />
          <Skeleton height={100} width={"100%"} className={"mb-4"} />
          <Skeleton height={100} width={"100%"} className={"mb-4"} />
          <Skeleton height={100} width={"100%"} className={"mb-4"} />
        </>
      ) : (
        <>
          {error && <Typography color="error">Error: {error}</Typography>}

          <Box className="my-4 grid grid-cols-2 gap-20 space-x-2">
            <TextField
              label="Enter Flag Name"
              variant="outlined"
              value={newFlagName}
              onChange={(e) => setNewFlagName(e.target.value)}
              fullWidth
              className="rounded-md"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateFlag}
              className="ml-2"
            >
              Create Flag
            </Button>
          </Box>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i._id)}
              strategy={verticalListSortingStrategy}
            >
              <Box className="space-y-4">
                {items.map((flag) => (
                  <SortableFlag key={flag._id} flag={flag} />
                ))}
              </Box>
            </SortableContext>
          </DndContext>

          <div className={"mt-4 flex items-center justify-center gap-10"}>
            {items.length > 0 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveChanges}
              >
                Save Order
              </Button>
            )}
          </div>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message={snackbarMessage}
            severity={snackbarSeverity}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{ zIndex: 9999 }}
          />
        </>
      )}
    </Box>
  );
};

export default FlagsComponent;