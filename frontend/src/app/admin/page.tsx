'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminUpload from '@/components/AdminUpload';
import DocumentList from '@/components/DocumentList';
import { Box, Container, Typography, Button, Grid, Paper, Stack, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Box 
      component="main" 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ mb: 6 }}
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Knowledge Base Admin
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage legal documents and resources
            </Typography>
          </Box>
          <Button 
            component={Link} 
            href="/" 
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}
          >
            Back to Chat
          </Button>
        </Stack>

        <Grid container spacing={4}>
          {/* Upload Section */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box 
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              sx={{ position: 'sticky', top: 32 }}
            >
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Upload New Law
                </Typography>
                <AdminUpload onUploadSuccess={handleUploadSuccess} />
              </Paper>
            </Box>
          </Grid>

          {/* Document List Section */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Active Documents
                  </Typography>
                  <Button 
                    startIcon={<RefreshIcon />}
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    Refresh
                  </Button>
                </Stack>
                <DocumentList refreshTrigger={refreshTrigger} />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
