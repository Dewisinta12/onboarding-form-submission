import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Button,
  FormControl,
  Paper,
  Typography,
} from "@mui/material";
import Toggle from "./Inputs/Toggle";
import TextInput from "./Inputs/TextInput";

const Onboarding = () => {
  const navigate = useNavigate();

  // STATE
  const [steps, setSteps] = useState([]); // data step dari backend
  const [currentStep, setCurrentStep] = useState(0); // posisi step sekarang
  const [onboardingData, setOnboardingData] = useState({}); // input user dari berbagi step
  const [loading, setLoading] = useState(true); // loading fetch
  const [error, setError] = useState(null); // error handling

  // FETCH data dari backend (/api/onboarding)
  useEffect(() => {
  const fetchOnboardingFormData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/onboarding");
      console.log("Fetched data:", data); 
      setSteps(data.steps); // 
    } catch (error) {
      console.error(error);
    } finally {
     setLoading(false);
    }
  };

  fetchOnboardingFormData();
}, []);

  // HANDLER untuk ubah input
  const onInputChange = (event, type = "text") => {
    setOnboardingData((prevData) => ({
      ...prevData,
      [event.target.name]:
        type === "checkbox" ? event.target.checked : event.target.value,
    }));
  };

  // HANDLER untuk pindah antar step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // HANDLER finish (redirect)
  const handleFinish = () => {
    // tidak kirim data ke backend 
    navigate("/home", { state: { onboarding: true } });
  };

  // Kalau loading
  if (loading) return <div>Loading...</div>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (steps.length === 0) return <Typography>No onboarding data found</Typography>;

  // Ambil step saat ini
  const currentFields = steps[currentStep] || [];

  // Cek apakah semua field di step ini sudah diisi
  const allFilled = currentFields.every((field) => {
    const value = onboardingData[field.name];
    return (
      value !== undefined &&
      value !== "" &&
      value !== null &&
      (field.type !== "toggle" || typeof value === "boolean")
    );
  });

  // Render field berdasarkan tipe input
  const renderField = (field, index) => {
  const type = field.type;

  return (
    <FormControl key={index} fullWidth sx={{ p: 2 }}>
      {/* text & multiline-text */}
      {(type === "text" || type === "multiline-text") && (
        <TextInput
          label={field.label || field.name}
          name={field.name}
          required={field.required}
          onboardingData={onboardingData}
          onChange={onInputChange}
          textarea={type === "multiline-text"}
        />
      )}

      {/* yes-no toggle */}
      {type === "yes-no" && (
        <Toggle
          label={field.label || field.name}
          name={field.name}
          onboardingData={onboardingData}
          onChange={(e) => onInputChange(e, "checkbox")}
        />
      )}
    </FormControl>
  );
};


  
  // Render tombol dengan style MUI 
  const renderButton = (text, onClick, disabled = false) => (
    <Button
      sx={{
        mt: 4,
        bgcolor: "#3A8DFF",
        px: 3.75,
        py: 0.625,
        color: "white",
        fontSize: "15px",
        "&:disabled": {
          color: "white",
          fontSize: "15px",
          bgcolor: "lightgrey",
        },
        "&:hover": {
          bgcolor: "#3A8DFF",
        },
      }}
      variant="contained"
      size="large"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
  console.log("Current Step:", currentStep);
  console.log("Current Fields:", currentFields);
  console.log("Onboarding Data:", onboardingData);
  console.log("All Filled:", allFilled);


  return (
    <Grid container justifyContent="center">
      <Paper
        sx={{
          padding: 5,
          backgroundColor: "#F7F9FD",
          width: "30%",
        }}
      >
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold", mb: 3 }}
        >
          Step {currentStep + 1} of {steps.length}
        </Typography>

        {/* render semua field di step ini */}
        {currentFields.map((field, i) => renderField(field, i))}

        {/* Pesan validasi */}
        {!allFilled && (
          <Typography sx={{ color: "red", textAlign: "center" }}>
            Please fill all the required fields before proceeding.
          </Typography>
        )}

        {/* Tombol navigasi */}
        <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
          {currentStep > 0 && (
            <Grid item>{renderButton("Back", handleBack)}</Grid>
          )}

          {currentStep < steps.length - 1 && (
            <Grid item>
              {renderButton("Next", handleNext, !allFilled)}
            </Grid>
          )}

          {currentStep === steps.length - 1 && (
            <Grid item>
              {renderButton("Finish", handleFinish, !allFilled)}
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Onboarding;
