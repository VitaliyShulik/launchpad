import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useStoreContext } from "../../../context/store";
import * as s from "../../../styles/global";
import IDOInfo from "./Step/idoInformation";
import Preview from "./Step/preview";
import ProjectInfo from "./Step/projectInfo";
import TokenVerify from "./Step/tokenVerify";

//สำหรับใส่ชื่อ Step
function getSteps() {
  return ["Token verify", "IDO information", "Project information", "Submit"];
}

export default function StepprtForm() {
  const blockchain = useSelector((state) => state.blockchain);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const form = useForm();
  const context = useStoreContext();

  if (!blockchain.account) {
    return null;
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const onSubmit = (data) => {
    console.log(data);
    if (activeStep == 0) {
      if (!context.tokenFormValidate()) {
        return false;
      }
    } else if (activeStep == 1) {
      if (!context.idoFormValidate()) {
        return false;
      }
    }
    handleNext();
  };

  //สำหรับ get Step ตาม index
  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <TokenVerify formProps={form} blockchain={blockchain} />;
      case 1:
        return <IDOInfo formProps={form} blockchain={blockchain} />;
      case 2:
        return <ProjectInfo formProps={form} blockchain={blockchain} />;
      case 3:
        return <Preview formProps={form} blockchain={blockchain} />;
      default:
        return "Unknown stepIndex";
    }
  }

  return (
    <s.Card>
      <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          style={{
            width: "100%",
            color: "white",
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <s.SpacerMedium />
        <s.Container flex={1}>
          {activeStep === steps.length ? (
            <s.Container ai="center">
              <s.TextDescription>All steps completed</s.TextDescription>
              <s.button type={"button"} onClick={handleReset}>
                Do again
              </s.button>
            </s.Container>
          ) : (
            <s.Container>
              {getStepContent(activeStep)}
              <s.SpacerSmall />
              <s.TextID fullWidth style={{ color: "red" }}>
                {context.error[0]}
              </s.TextID>
              <s.SpacerMedium />
              <s.Container fd="row" jc="flex-end">
                <s.button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  type="button"
                  style={{ margin: 5 }}
                >
                  Back
                </s.button>
                {activeStep !== steps.length - 1 ? (
                  <s.button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ margin: 5 }}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </s.button>
                ) : null}
              </s.Container>
            </s.Container>
          )}
        </s.Container>
      </form>
    </s.Card>
  );
}
