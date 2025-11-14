

import { 
  Container, 
  FormControl, 
  InputLabel, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  Box, 
  Button,
  CircularProgress
} from '@mui/material';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      setGeneratedEmail('');

      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
      });

      setGeneratedEmail(
        typeof response.data === 'string' 
          ? response.data 
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setError('Failed to generate reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        EMAIL REPLY GENERATOR
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField 
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select 
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value=''>None</MenuItem>
            <MenuItem value="Informal">Informal</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {generatedEmail && (
        <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Generated Reply:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={generatedEmail}
            InputProps={{ readOnly: true }}
          />
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => {
              navigator.clipboard.writeText(generatedEmail);
            }}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;
