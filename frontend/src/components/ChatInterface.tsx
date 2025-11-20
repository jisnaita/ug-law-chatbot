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
  Stack,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
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

  const handleCardClick = (text: string) => {
    setInput(text);
  };

  const suggestions = [
    {
      icon: <AutoAwesomeIcon color="primary" />,
      text: "Help me understand the new tax regulations for small businesses",
      color: "#e3f2fd"
    },
    {
      icon: <DescriptionIcon color="error" />,
      text: "Summarize the NSSF Act compliance requirements",
      color: "#ffebee"
    },
    {
      icon: <EditIcon color="warning" />,
      text: "Draft a legal compliance checklist for a startup",
      color: "#fff3e0"
    }
  ];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
        <Button 
          endIcon={<KeyboardArrowDownIcon />} 
          sx={{ 
            color: 'text.primary', 
            bgcolor: 'white', 
            border: '1px solid', 
            borderColor: 'grey.200',
            textTransform: 'none',
            borderRadius: 2,
            px: 2
          }}
        >
          Uganda Laws 1.0
        </Button>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setMessages([])}
          sx={{ 
            borderRadius: 2, 
            textTransform: 'none',
            boxShadow: 'none',
            bgcolor: '#0091ff',
            '&:hover': { bgcolor: '#0081e6' }
          }}
        >
          New Chat
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 4, pb: 15, display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mt: -10 
          }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: 'black', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <SmartToyIcon sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Hi, there 👋
            </Typography>
            <Typography variant="h3" fontWeight="600" gutterBottom sx={{ mb: 6 }}>
              How can we help?
            </Typography>

            <Stack direction="row" spacing={3} sx={{ width: '100%', maxWidth: 900 }}>
              {suggestions.map((item, index) => (
                <Card 
                  key={index}
                  component={motion.div}
                  whileHover={{ y: -5 }}
                  onClick={() => handleCardClick(item.text)}
                  sx={{ 
                    flex: 1, 
                    cursor: 'pointer', 
                    borderRadius: 4,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    border: '1px solid',
                    borderColor: 'transparent',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2, 
                      bgcolor: item.color, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 2
                    }}>
                      {item.icon}
                    </Box>
                    <Typography variant="body1" fontWeight="500" color="text.secondary">
                      {item.text}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        ) : (
          <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%', pt: 4 }}>
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ mb: 4, display: 'flex', gap: 2, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: msg.role === 'user' ? 'primary.main' : 'black',
                        width: 32,
                        height: 32
                      }}
                    >
                      {msg.role === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                    </Avatar>
                    <Box sx={{ maxWidth: '80%' }}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                        {msg.role === 'user' ? 'You' : 'Assistant'}
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                          color: msg.role === 'user' ? 'white' : 'text.primary',
                          boxShadow: msg.role === 'user' ? 2 : '0 2px 12px rgba(0,0,0,0.05)'
                        }}
                      >
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                          {msg.content}
                        </Typography>
                        
                        {msg.citations && msg.citations.length > 0 && (
                          <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: msg.role === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>
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
                                    borderColor: msg.role === 'user' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)',
                                    bgcolor: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                  }} 
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Paper>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Avatar sx={{ bgcolor: 'black', width: 32, height: 32 }}>
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Paper sx={{ p: 2, borderRadius: 3, bgcolor: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <Stack direction="row" spacing={1}>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Box sx={{ width: 6, height: 6, bgcolor: 'grey.500', borderRadius: '50%' }} />
                    </motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>
                      <Box sx={{ width: 6, height: 6, bgcolor: 'grey.500', borderRadius: '50%' }} />
                    </motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>
                      <Box sx={{ width: 6, height: 6, bgcolor: 'grey.500', borderRadius: '50%' }} />
                    </motion.div>
                  </Stack>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 80, // Sidebar width
        right: 0,
        p: 3,
        bgcolor: 'rgba(248, 249, 250, 0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Paper 
            component="form" 
            onSubmit={handleSubmit}
            elevation={0}
            sx={{ 
              p: '8px 16px', 
              display: 'flex', 
              alignItems: 'center', 
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'grey.200',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              bgcolor: 'white'
            }}
          >
            <IconButton sx={{ p: '10px', color: 'text.secondary' }}>
              <AttachFileIcon />
            </IconButton>
            <TextField
              sx={{ ml: 1, flex: 1 }}
              placeholder="Ask me anything..."
              variant="standard"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              InputProps={{ disableUnderline: true }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!input.trim() || isLoading}
              sx={{ 
                borderRadius: 3,
                minWidth: 'auto',
                px: 3,
                py: 1,
                bgcolor: '#0091ff',
                '&:hover': { bgcolor: '#0081e6' }
              }}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Paper>
          <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mt: 2 }}>
            Uganda Laws Assistant may display inaccurate info, so please double check the response. <Box component="span" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>Your Privacy & Uganda Laws AI</Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
