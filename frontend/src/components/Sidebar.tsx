'use client';

import { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  TextField, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  InputAdornment
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Link from 'next/link';

export interface ChatSession {
  id: string;
  title: string;
  date: Date;
}

interface SidebarProps {
  chats: ChatSession[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  onDeleteChat, 
  onRenameChat,
  isOpen,
  onToggle
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, chatId: string) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedChatId(chatId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedChatId(null);
  };

  const handleDelete = () => {
    if (selectedChatId) {
      onDeleteChat(selectedChatId);
      handleMenuClose();
    }
  };

  const handleRenameStart = () => {
    if (selectedChatId) {
      const chat = chats.find(c => c.id === selectedChatId);
      if (chat) {
        setEditingChatId(selectedChatId);
        setEditTitle(chat.title);
      }
      handleMenuClose();
    }
  };

  const handleRenameSubmit = () => {
    if (editingChatId && editTitle.trim()) {
      onRenameChat(editingChatId, editTitle.trim());
      setEditingChatId(null);
      setEditTitle('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setEditingChatId(null);
    }
  };

  if (!isOpen) {
    return (
      <Box
        sx={{
          width: 60,
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
          transition: 'width 0.3s ease'
        }}
      >
        <IconButton onClick={onToggle} sx={{ mb: 2 }}>
          <ChevronRightIcon />
        </IconButton>
        <Tooltip title="Expand Sidebar" placement="right">
          <Box 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'black', 
              borderRadius: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={onToggle}
          >
            <GavelIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        bgcolor: 'white',
        borderRight: '1px solid',
        borderColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
        transition: 'width 0.3s ease'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: 'black', 
              borderRadius: 1.5, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <GavelIcon sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography variant="subtitle1" fontWeight="600">
            Uganda Laws
          </Typography>
        </Box>
        <IconButton onClick={onToggle} size="small">
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, bgcolor: 'grey.50' }
          }}
        />
      </Box>

      {/* Chat List */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', px: 1 }}>
          Recent
        </Typography>
        <List disablePadding>
          {filteredChats.map((chat) => (
            <ListItem 
              key={chat.id} 
              disablePadding 
              sx={{ mb: 0.5 }}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  size="small" 
                  onClick={(e) => handleMenuOpen(e, chat.id)}
                  sx={{ opacity: 0, transition: 'opacity 0.2s', '.MuiListItem-root:hover &': { opacity: 1 } }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemButton
                selected={currentChatId === chat.id}
                onClick={() => onSelectChat(chat.id)}
                sx={{ 
                  borderRadius: 2,
                  '&.Mui-selected': { bgcolor: 'primary.50', color: 'primary.main' },
                  '&.Mui-selected:hover': { bgcolor: 'primary.100' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: currentChatId === chat.id ? 'primary.main' : 'text.secondary' }}>
                  <ChatBubbleOutlineIcon fontSize="small" />
                </ListItemIcon>
                {editingChatId === chat.id ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleRenameSubmit}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    variant="standard"
                  />
                ) : (
                  <ListItemText 
                    primary={chat.title} 
                    primaryTypographyProps={{ 
                      variant: 'body2', 
                      noWrap: true,
                      fontWeight: currentChatId === chat.id ? 500 : 400
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Admin Link */}
      <Box sx={{ p: 2 }}>
        <Link href="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemButton sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <AdminPanelSettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Admin Panel" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
          </ListItemButton>
        </Link>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleRenameStart}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
