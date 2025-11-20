'use client';

import { Box, IconButton, Stack, Avatar, Tooltip } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import GridViewIcon from '@mui/icons-material/GridView';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: <ChatBubbleOutlineIcon />, label: 'Chat', path: '/' },
    { icon: <GridViewIcon />, label: 'Dashboard', path: '/dashboard' }, // Placeholder
    { icon: <FolderOpenIcon />, label: 'Documents', path: '/documents' }, // Placeholder
    { icon: <SettingsOutlinedIcon />, label: 'Settings', path: '/admin' }, // Using Admin as settings for now
  ];

  return (
    <Box
      sx={{
        width: 80,
        height: '100vh',
        bgcolor: 'white',
        borderRight: '1px solid',
        borderColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 3,
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      {/* Logo */}
      <Box 
        sx={{ 
          width: 40, 
          height: 40, 
          bgcolor: 'black', 
          borderRadius: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 6,
          cursor: 'pointer'
        }}
      >
        <GavelIcon sx={{ color: 'white', fontSize: 20 }} />
      </Box>

      {/* Menu Items */}
      <Stack spacing={3} sx={{ flex: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <Tooltip key={index} title={item.label} placement="right">
              <IconButton
                component={Link}
                href={item.path}
                sx={{
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive ? 'primary.50' : 'transparent',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: isActive ? 'primary.50' : 'grey.100',
                    color: isActive ? 'primary.main' : 'text.primary',
                  },
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          );
        })}
      </Stack>

      {/* User Profile */}
      <Avatar 
        src="/placeholder-avatar.jpg" 
        sx={{ 
          width: 40, 
          height: 40, 
          cursor: 'pointer',
          border: '2px solid',
          borderColor: 'grey.200'
        }} 
      />
    </Box>
  );
}
