'use client';

import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';
import { Box } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, ml: '80px' }}>
        <ChatInterface />
      </Box>
    </Box>
  );
}
