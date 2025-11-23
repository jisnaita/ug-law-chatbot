'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import { useChat } from '@/context/ChatContext';

export default function Home() {
  const { 
    chats, 
    messagesMap, 
    currentChatId, 
    isLoading,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleRenameChat,
    handleSendMessage
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentMessages = currentChatId ? (messagesMap[currentChatId] || []) : [];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Sidebar 
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          ml: sidebarOpen ? '280px' : '60px', 
          transition: 'margin-left 0.3s ease',
          width: '100%'
        }}
      >
        <ChatInterface 
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onNewChat={handleNewChat}
        />
      </Box>
    </Box>
  );
}
