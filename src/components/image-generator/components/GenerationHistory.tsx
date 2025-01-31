import React from 'react';
import { useGenerationHistory, GenerationHistoryItem } from '../hooks/useGenerationHistory';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
  CardMedia,
  CardActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

export const GenerationHistory: React.FC = () => {
  const { history, removeFromHistory, clearHistory, isLoading, error } = useGenerationHistory();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  if (history.length === 0) {
    return (
      <Box m={2}>
        <Typography variant="body1" color="textSecondary" align="center">
          No generations yet. Start creating some images!
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Generation History</Typography>
        {history.length > 0 && (
          <Tooltip title="Clear all history">
            <IconButton onClick={clearHistory} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Grid container spacing={2}>
        {history.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.imageUrl}
                alt={item.prompt}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ pt: 1, pb: 1 }}>
                <Typography variant="body2" noWrap title={item.prompt}>
                  {item.prompt}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  {format(item.timestamp, 'MMM d, yyyy HH:mm')}
                </Typography>
                {item.parameters && (
                  <Typography variant="caption" color="textSecondary" component="div">
                    {`${item.parameters.width}x${item.parameters.height} • Steps: ${item.parameters.steps} • CFG: ${item.parameters.cfgScale}`}
                    {item.parameters.seed !== undefined && ` • Seed: ${item.parameters.seed}`}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => removeFromHistory(item.id)}
                    aria-label="delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};