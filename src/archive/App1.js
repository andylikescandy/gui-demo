import React, { useState } from 'react';
import { Button, Grid, MenuItem, Select, TextField, IconButton } from '@mui/material';
import { AddCircle, Delete } from '@mui/icons-material';

function App() {
  const [sequences, setSequences] = useState([
    { name: 'Full tray test - MEM', steps: ['SFR Inf', 'Grid Flare', 'LCB'], speed: 15, step: 2 },
    { name: 'Single DUT test - MEM', steps: ['SFR macro', 'SFR Inf lens tilt scan'], row: 1, col: 1 },
  ]);

  const handleAddSequence = () => {
    setSequences([...sequences, { name: '', steps: [], speed: '', step: '', row: '', col: '' }]);
  };

  const handleDeleteSequence = (index) => {
    const newSequences = [...sequences];
    newSequences.splice(index, 1);
    setSequences(newSequences);
  };

  const handleAddStep = (index) => {
    const newSequences = [...sequences];
    newSequences[index].steps.push('');
    setSequences(newSequences);
  };

  const handleDeleteStep = (seqIndex, stepIndex) => {
    const newSequences = [...sequences];
    newSequences[seqIndex].steps.splice(stepIndex, 1);
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
    setSequences(newSequences);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        RUN
      </Button>
      <Button variant="contained" color="secondary" style={{ marginBottom: '20px', marginLeft: '10px' }}>
        STOP
      </Button>
      <Button variant="contained" style={{ marginBottom: '20px', marginLeft: '10px' }}>
        LOAD
      </Button>
      <Button variant="contained" style={{ marginBottom: '20px', marginLeft: '10px' }}>
        SAVE
      </Button>

      {sequences.map((seq, seqIndex) => (
        <Grid container spacing={2} key={seqIndex} alignItems="center" style={{ marginBottom: '10px' }}>
          <Grid item xs={4}>
            <Select
              value={seq.name}
              name="name"
              onChange={(e) => handleChange(seqIndex, e)}
              fullWidth
            >
              <MenuItem value="Full tray test - MEM">Full tray test - MEM</MenuItem>
              <MenuItem value="Single DUT test - MEM">Single DUT test - MEM</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Speed"
              name="speed"
              value={seq.speed}
              onChange={(e) => handleChange(seqIndex, e)}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Step"
              name="step"
              value={seq.step}
              onChange={(e) => handleChange(seqIndex, e)}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton color="primary" onClick={() => handleAddStep(seqIndex)}>
              <AddCircle />
            </IconButton>
            <IconButton color="secondary" onClick={() => handleDeleteSequence(seqIndex)}>
              <Delete />
            </IconButton>
          </Grid>

          {seq.steps.map((step, stepIndex) => (
            <Grid container spacing={2} key={stepIndex} style={{ marginLeft: '20px', marginTop: '10px' }}>
              <Grid item xs={8}>
                <TextField
                  label="Step"
                  value={step}
                  onChange={(e) => handleStepChange(seqIndex, stepIndex, e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton color="secondary" onClick={() => handleDeleteStep(seqIndex, stepIndex)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Grid>
      ))}
      <Button variant="outlined" color="primary" onClick={handleAddSequence}>
        Add Sequence
      </Button>
    </div>
  );
}

export default App;
