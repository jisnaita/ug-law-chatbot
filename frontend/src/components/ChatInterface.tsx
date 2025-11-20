'use client';

import { useState, useRef, useEffect } from 'react';
import { chatWithBot } from '@/lib/api';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Chip, 
  CircularProgress,
  IconButton,
  Stack
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: { source: string; page: number }[];
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithBot(input);
      const botMessage: Message = {
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: 600, 
        width: '100%', 
        maxWidth: 900, 
        mx: 'auto', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 4,
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.length === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.6 }}>
            <SmartToyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Ask me about Uganda Business Laws
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try "What is the corporate tax rate?"
            </Typography>
          </Box>
        )}
        
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  borderTopRightRadius: msg.role === 'user' ? 0 : 3,
                  borderTopLeftRadius: msg.role === 'assistant' ? 0 : 3,
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.100',
                  color: msg.role === 'user' ? 'white' : 'text.primary',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  {msg.role === 'assistant' && <SmartToyIcon fontSize="small" sx={{ mt: 0.5, opacity: 0.7 }} />}
                  <Box>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </Typography>
                    
                    {msg.citations && msg.citations.length > 0 && (
                      <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'rgba(0,0,0,0.1)' }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1, opacity: 0.8, fontWeight: 600 }}>
                          Sources:
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {msg.citations.map((cit, i) => (
                            <Chip 
                              key={i} 
                              label={`${cit.source} (p.${cit.page})`} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                color: 'inherit', 
                                borderColor: 'rgba(0,0,0,0.1)',
                                bgcolor: 'rgba(255,255,255,0.1)'
                              }} 
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Paper sx={{ p: 2, borderRadius: 3, borderTopLeftRadius: 0, bgcolor: 'grey.100' }}>
              <Stack direction="row" spacing={1}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Box sx={{ width: 8, height: 8, bgcolor: 'grey.500', borderRadius: '50%' }} />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                >
                  <Box sx={{ width: 8, height: 8, bgcolor: 'grey.500', borderRadius: '50%' }} />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                >
                  <Box sx={{ width: 8, height: 8, bgcolor: 'grey.500', borderRadius: '50%' }} />
                </motion.div>
              </Stack>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex',
          gap: 2
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your legal question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          variant="outlined"
          sx={{ 
            '& .MuiOutlinedInput-root': { 
              borderRadius: 3,
              bgcolor: 'grey.50'
            } 
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || !input.trim()}
          sx={{ 
            borderRadius: 3, 
            px: 4,
            boxShadow: 2
          }}
          endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
}
