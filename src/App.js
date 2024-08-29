import React, { useState } from 'react';
import { Button, Grid, MenuItem, TextField, IconButton, Box, Popover } from '@mui/material';
import { PlayArrow, Stop, Save, FolderOpen, Pause, AddCircle, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';

function App() {
  const [sequences, setSequences] = useState([
    { name: 'None', steps: ['None'], parameters: {} },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  const stepOptions = [
    { value: 'None', label: 'None' },
    { value: '1D Flare scan', label: '1D Flare scan', params: ['Max Angle', 'Min Angle', 'Azimuth', '# images'], img: '/flare_scan_1d.png' },
    { value: '2D Flare scan', label: '2D Flare scan', params: ['Max Angle', 'Min Angle', 'Max Azimuth', 'Min Azimuth', 'Step Size'], img: '/flare_scan_2d.png' },
    { value: 'SFR Inf', label: 'SFR Inf', params: ['Range', 'Speed', '# images'], img: '/sfr_inf.png' },
    { value: 'SFR Macro', label: 'SFR Macro', params: ['Range', 'Speed', '# images'], img: '/sfr_macro.png' },
    { value: 'Grid Flare', label: 'Grid Flare', img: '/grid_flare.png' },
    { value: 'LCB', label: 'LCB', img: '/lcb.png' }
  ];

  const dutOptions = [
    { value: 'None', label: 'None' },
    { value: 'Full tray test - MEM', label: 'Full tray test - MEM', params: [], img: '' },
    { value: 'Full tray test - CHS', label: 'Full tray test - CHS', params: [], img: '' },
    { value: 'Single DUT - MEM', label: 'Single DUT - MEM', params: ['Row', 'Column'], img: '/single_dut_mem.png' },
    { value: 'Single DUT - CHS', label: 'Single DUT - CHS', params: ['Row', 'Column'], img: '/single_dut_chs.png' }
  ];

  const handleAddSequence = () => {
    setSequences([...sequences, { name: 'None', steps: ['None'], parameters: {} }]);
  };

  const handleDeleteSequence = (index) => {
    const newSequences = sequences.filter((_, i) => i !== index);
    setSequences(newSequences);
  };

  const handleAddStep = (seqIndex, stepIndex) => {
    const newSequences = [...sequences];
    newSequences[seqIndex].steps.splice(stepIndex + 1, 0, 'None');
    newSequences[seqIndex].parameters[stepIndex + 1] = {}; // Add default empty parameters for the new step
    setSequences(newSequences);
  };

  const handleDeleteStep = (seqIndex, stepIndex) => {
    const newSequences = [...sequences];
    newSequences[seqIndex].steps.splice(stepIndex, 1);
    delete newSequences[seqIndex].parameters[stepIndex];
    setSequences(newSequences);
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newSequences = [...sequences];
    newSequences[index][name] = value;
    setSequences(newSequences);
  };

  const handleStepChange = (seqIndex, stepIndex, event) => {
    const { value } = event.target;
    const newSequences = [...sequences];
    newSequences[seqIndex].steps[stepIndex] = value;

    // If the selected step has parameters, add empty fields for those parameters
    const selectedOption = stepOptions.find(option => option.value === value);
    if (selectedOption && selectedOption.params) {
      newSequences[seqIndex].parameters[stepIndex] = selectedOption.params.reduce((acc, param) => {
        acc[param] = ''; // Initialize each parameter with an empty string
        return acc;
      }, {});
    } else {
      newSequences[seqIndex].parameters[stepIndex] = {};
    }

    setSequences(newSequences);
  };

  const handleParameterChange = (seqIndex, stepIndex, param, event) => {
    const { value } = event.target;
    const newSequences = [...sequences];
    newSequences[seqIndex].parameters[stepIndex][param] = value;
    setSequences(newSequences);
  };

  const moveStep = (seqIndex, stepIndex, direction) => {
    const newSequences = [...sequences];
    const steps = newSequences[seqIndex].steps;
    const params = newSequences[seqIndex].parameters;

    // Move step up or down
    const [movedStep] = steps.splice(stepIndex, 1);
    const movedParams = params[stepIndex];

    steps.splice(stepIndex + direction, 0, movedStep);
    Object.keys(params).forEach(key => {
      params[key + direction] = params[key];
    });
    params[stepIndex + direction] = movedParams;

    setSequences(newSequences);
  };

  const moveSequence = (seqIndex, direction) => {
    const newSequences = [...sequences];

    // Move sequence up or down
    const [movedSequence] = newSequences.splice(seqIndex, 1);
    newSequences.splice(seqIndex + direction, 0, movedSequence);

    setSequences(newSequences);
  };

  const handleClickParameter = (event, seqIndex, stepIndex, type, param) => {
    let selectedOption;
    if (type === 'step') {
      selectedOption = stepOptions.find(option => option.value === sequences[seqIndex].steps[stepIndex]);
    } else if (type === 'dut') {
      selectedOption = dutOptions.find(option => option.value === sequences[seqIndex].name);
    }

    if (selectedOption && selectedOption.img) {
      setCurrentImage(selectedOption.img);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={2} style={{ marginBottom: '20px' }}>
        <Grid item>
          <Button variant="contained" color="success" startIcon={<PlayArrow />}>
            RUN
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="error" startIcon={<Stop />}>
            STOP
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="warning" startIcon={<Pause />}>
            PAUSE
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" startIcon={<FolderOpen />}>
            LOAD
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" startIcon={<Save />}>
            SAVE
          </Button>
        </Grid>
      </Grid>

      {sequences.map((seq, seqIndex) => (
        <Box key={seqIndex} border={1} padding={2} marginBottom={2}>
          <Grid container spacing={2} alignItems="center" style={{ marginBottom: '10px' }}>
            <Grid item xs={3.2}>
              <TextField
                select
                label="DUT handling"
                value={seq.name}
                name="name"
                onChange={(e) => handleChange(seqIndex, e)}
                fullWidth
                variant="outlined"
              >
                {dutOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {seq.name && seq.name !== 'None' && dutOptions.find(option => option.value === seq.name)?.params?.map(param => (
              <Grid item xs={1.6} key={param}>
                <TextField
                  label={param}
                  name={param}
                  value={seq[param] || '\u00A0'}  // Use a non-breaking space to ensure the placeholder shows immediately
                  placeholder="Enter value..."
                  onChange={(e) => handleChange(seqIndex, e)}
                  onClick={(event) => handleClickParameter(event, seqIndex, null, 'dut', param)}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            ))}
            <Grid item xs={2}>
              <IconButton color="primary" onClick={handleAddSequence}>
                <AddCircle />
              </IconButton>
              <IconButton color="secondary" onClick={() => handleDeleteSequence(seqIndex)}>
                <Delete />
              </IconButton>
              <IconButton color="default" onClick={() => moveSequence(seqIndex, -1)} disabled={seqIndex === 0}>
                <ArrowUpward />
              </IconButton>
              <IconButton color="default" onClick={() => moveSequence(seqIndex, 1)} disabled={seqIndex === sequences.length - 1}>
                <ArrowDownward />
              </IconButton>
            </Grid>
          </Grid>

          {seq.steps.map((step, stepIndex) => (
            <Grid container spacing={2} key={stepIndex} style={{ marginLeft: '20px', marginTop: '10px' }}>
              <Grid item xs={3.2}>
                <TextField
                  select
                  label="Step"
                  value={step}
                  onChange={(e) => handleStepChange(seqIndex, stepIndex, e)}
                  fullWidth
                  variant="outlined"
                >
                  {stepOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {step && step !== 'None' && stepOptions.find(option => option.value === step)?.params?.map(param => (
                <Grid item xs={1.6} key={param}>
                  <TextField
                    label={param}
                    value={seq.parameters[stepIndex]?.[param] || '\u00A0'}  // Use a non-breaking space to ensure the placeholder shows immediately
                    placeholder="Enter value..."
                    onChange={(e) => handleParameterChange(seqIndex, stepIndex, param, e)}
                    onClick={(event) => handleClickParameter(event, seqIndex, stepIndex, 'step', param)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              ))}
              <Grid item xs={2}>
                <IconButton color="primary" onClick={() => handleAddStep(seqIndex, stepIndex)}>
                  <AddCircle />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteStep(seqIndex, stepIndex)}>
                  <Delete />
                </IconButton>
                <IconButton color="default" onClick={() => moveStep(seqIndex, stepIndex, -1)} disabled={stepIndex === 0}>
                  <ArrowUpward />
                </IconButton>
                <IconButton color="default" onClick={() => moveStep(seqIndex, stepIndex, 1)} disabled={stepIndex === seq.steps.length - 1}>
                  <ArrowDownward />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Box>
      ))}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <img src={currentImage} alt="Parameter diagram" style={{ maxWidth: '300px', padding: '10px' }} />
      </Popover>
    </div>
  );
}

export default App;
