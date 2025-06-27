import React, { useState, useEffect, useRef } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
// Using React Transition Group with refs for React 18+ compatibility
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TransferProvider } from '../../contexts/customer/TransferContext';
import { TRANSFER_STEPS } from '../../utils/transferConstants';
import TransferFormStep from './Transfer/TransferFormStep';
import ConfirmationStep from './Transfer/ConfirmationStep';
import OtpVerificationStep from './Transfer/OtpVerificationStep';
import ResultStep from './Transfer/ResultStep';
import { useTransfer } from '../../contexts/customer/TransferContext';

const TransferSteps = () => {
  const { step, loading, error, success } = useTransfer();
  const [direction, setDirection] = useState('right');
  const [prevStep, setPrevStep] = useState(step);
  useEffect(() => {
    if (step > prevStep) {
      setDirection('right');
    } else if (step < prevStep) {
      setDirection('left');
    }
    setPrevStep(step);
  }, [step, prevStep]);
  // Create refs for React 18+ compatibility with CSSTransition
  // These refs replace the deprecated findDOMNode functionality
  const confirmStepRef = useRef(null);
  const otpStepRef = useRef(null);
  const resultStepRef = useRef(null);
  const formStepRef = useRef(null);


  // Track direction of transition based on step changes


  // Define the steps
  const steps = [
    { label: 'Details', completed: step > TRANSFER_STEPS.FORM },
    { label: 'Confirm', completed: step > TRANSFER_STEPS.CONFIRM },
    { label: 'Verify', completed: step > TRANSFER_STEPS.OTP },
    { label: 'Complete', completed: step >= TRANSFER_STEPS.COMPLETE },
  ];
  return (
    <>
      <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
        <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((stepObj, index) => (
            <Step key={index} completed={stepObj.completed}>
              <StepLabel>{stepObj.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>{' '}
      {loading && step !== TRANSFER_STEPS.FORM && (
        <Box
          display="flex"
          justifyContent="center"
          my={3}
          sx={{ maxWidth: '700px', mx: 'auto' }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && step !== TRANSFER_STEPS.FORM && step !== TRANSFER_STEPS.OTP && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: '700px', mx: 'auto' }}>
          {error}
        </Alert>
      )}{' '}
      {success && (
        <Alert severity="success" sx={{ mb: 3, maxWidth: '700px', mx: 'auto' }}>
          {success}
        </Alert>
      )}{' '}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          maxWidth: '700px',
          mx: 'auto',
          overflow: 'hidden',
          '& .fade-enter': {
            opacity: 0,
            transform:
              direction === 'right' ? 'translateX(100%)' : 'translateX(-100%)',
          },
          '& .fade-enter-active': {
            opacity: 1,
            transform: 'translateX(0)',
            transition: 'opacity 300ms, transform 300ms ease',
          },
          '& .fade-exit': {
            opacity: 1,
            transform: 'translateX(0)',
          },
          '& .fade-exit-active': {
            opacity: 0,
            transform:
              direction === 'right' ? 'translateX(-100%)' : 'translateX(100%)',
            transition: 'opacity 300ms, transform 300ms ease',
          },
          '& > div > div': {
            width: '100%', // Ensure the content inside the refs fills the container
          },
        }}
      >
        <TransitionGroup>
          {step === TRANSFER_STEPS.FORM && (
            <CSSTransition
              in={step === TRANSFER_STEPS.FORM}
              timeout={300}
              classNames="fade"
              unmountOnExit
              nodeRef={formStepRef}
              onEnter={() => setDirection('right')}
              onExited={() => setDirection('right')}
            >
              <div ref={formStepRef}>
                <TransferFormStep />
              </div>
            </CSSTransition>
          )}
          {step === TRANSFER_STEPS.CONFIRM && (
            <CSSTransition
              in={step === TRANSFER_STEPS.CONFIRM}
              timeout={300}
              classNames="fade"
              unmountOnExit
              nodeRef={confirmStepRef}
              onEnter={() => setDirection('right')}
              onExited={() => setDirection('right')}
            >
              <div ref={confirmStepRef}>
                <ConfirmationStep />
              </div>
            </CSSTransition>
          )}
          {step === TRANSFER_STEPS.OTP && (
            <CSSTransition
              in={step === TRANSFER_STEPS.OTP}
              timeout={300}
              classNames="fade"
              unmountOnExit
              nodeRef={otpStepRef}
              onEnter={() => setDirection('right')}
              onExited={() => setDirection('right')}
            >
              <div ref={otpStepRef}>
                <OtpVerificationStep />
              </div>
            </CSSTransition>
          )}
          {step === TRANSFER_STEPS.COMPLETE && (
            <CSSTransition
              in={step === TRANSFER_STEPS.COMPLETE}
              timeout={300}
              classNames="fade"
              unmountOnExit
              nodeRef={resultStepRef}
              onEnter={() => setDirection('right')}
              onExited={() => setDirection('right')}
            >
              <div ref={resultStepRef}>
                <ResultStep />
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </Paper>
    </>
  );
};

export default function TransferPage() {
  const { state } = useLocation();
  return (
    <CustomerLayout>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
          py: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="md" sx={{ mx: 'auto', flex: '1 0 auto' }}>
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <TransferProvider
              initialAccountNumber={state?.accountNumberReceiver}
            >
              <TransferSteps />
            </TransferProvider>
          </Box>
        </Container>
      </Box>
    </CustomerLayout>
  );
}
