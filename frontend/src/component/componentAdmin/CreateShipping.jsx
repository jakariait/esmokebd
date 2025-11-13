import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import useAuthAdminStore from "../../store/AuthAdminStore";

const CreateShipping = () => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useAuthAdminStore();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !value.trim()) return alert("সব তথ্য দিন");

    try {
      setLoading(true);
      await axios.post(
        `${apiUrl}/createShipping`,
        { name, value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      window.dispatchEvent(new CustomEvent("shippingMethodCreated"));
      setName("");
      setValue("");
    } catch (error) {
      console.error("Create failed", error);
      alert("কিছু একটা ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow rounded-lg p-4">
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
          Add New Delivery Charge
        </h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Charge"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            size="small"
          />
        </div>
        <div className="flex items-center justify-center gap-2 ">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ height: "100%" }}
            className="w-96"
            size="small"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateShipping;
