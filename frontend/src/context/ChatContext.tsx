'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatSession } from '@/components/Sidebar';
import { Message } from '@/components/ChatInterface';
import { chatWithBot } from '@/lib/api';

interface ChatContextType {
  chats: ChatSession[];
  messagesMap: Record<string, Message[]>;
  currentChatId: string | null;
  isLoading: boolean;
  handleNewChat: () => void;
  handleSelectChat: (id: string) => void;
  handleDeleteChat: (id: string) => void;
  handleRenameChat: (id: string, newTitle: string) => void;
  handleSendMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with a new chat if none exist
  useEffect(() => {
    if (chats.length === 0 && !currentChatId) {
      handleNewChat();
    }
  }, []);

  const handleNewChat = () => {
    // If current chat is empty, don't create a new one
    if (currentChatId && (!messagesMap[currentChatId] || messagesMap[currentChatId].length === 0)) {
      return;
    }

    const newId = Date.now().toString();
    const newChat: ChatSession = {
      id: newId,
      title: 'New Chat',
      date: new Date(),
    };
    setChats(prev => [newChat, ...prev]);
    setMessagesMap(prev => ({ ...prev, [newId]: [] }));
    setCurrentChatId(newId);
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
  };

  const handleDeleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    setMessagesMap(prev => {
      const newMap = { ...prev };
      delete newMap[id];
      return newMap;
    });
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  const handleSendMessage = async (text: string) => {
    if (!currentChatId) return;

    const userMessage: Message = { role: 'user', content: text };
    
    // Optimistically update UI
    setMessagesMap(prev => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), userMessage]
    }));

    // Update chat title if it's the first message and title is generic
    const currentChat = chats.find(c => c.id === currentChatId);
    if (currentChat && currentChat.title === 'New Chat' && (messagesMap[currentChatId]?.length || 0) === 0) {
      const newTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
      handleRenameChat(currentChatId, newTitle);
    }

    setIsLoading(true);

    try {
      const response = await chatWithBot(text);
      const botMessage: Message = {
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
      };

      setMessagesMap(prev => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), botMessage]
      }));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessagesMap(prev => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), errorMessage]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      messagesMap,
      currentChatId,
      isLoading,
      handleNewChat,
      handleSelectChat,
      handleDeleteChat,
      handleRenameChat,
      handleSendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
