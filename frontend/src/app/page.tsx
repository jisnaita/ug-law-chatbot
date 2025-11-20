'use client';

import ChatInterface from '@/components/ChatInterface';
import Link from 'next/link';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <Box 
      component="main" 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ mb: 8 }}
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box 
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: 'primary.main', 
                borderRadius: 3, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: 3
              }}
            >
              <GavelIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Uganda Laws <Box component="span" color="primary.main">Assistant</Box>
            </Typography>
          </Stack>
          
          <Button 
            component={Link} 
            href="/admin" 
            variant="outlined" 
            startIcon={<AdminPanelSettingsIcon />}
            sx={{ 
              bgcolor: 'white',
              border: '1px solid',
              borderColor: 'grey.200',
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'grey.50',
                borderColor: 'primary.main',
                color: 'primary.main'
              }
            }}
          >
            Admin Portal
          </Button>
        </Stack>

        <Box 
          sx={{ textAlign: 'center', mb: 6 }}
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h2" fontWeight="800" gutterBottom sx={{ background: 'linear-gradient(45deg, #1e40af, #3b82f6)', backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Your AI Legal Companion
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
            Get instant answers about Uganda's business laws, tax regulations, and NSSF compliance. 
            Powered by official legal documents.
          </Typography>
        </Box>

        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ChatInterface />
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 6, opacity: 0.6 }}>
          © 2024 Uganda Laws Assistant. Not legal advice.
        </Typography>
      </Container>
    </Box>
  );
}
