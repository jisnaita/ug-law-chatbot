'use client';

import { useState, useRef } from 'react';
import { uploadFile } from '@/lib/api';
import { Box, Typography, CircularProgress, Paper, Alert, Fade } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { motion } from 'framer-motion';

interface AdminUploadProps {
  onUploadSuccess: () => void;
}

export default function AdminUpload({ onUploadSuccess }: AdminUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setStatus(null);
    try {
      await uploadFile(file);
      setStatus({ type: 'success', message: `Successfully uploaded ${file.name}` });
      onUploadSuccess();
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Upload failed. Please try again.' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        component={motion.div}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        elevation={0}
        sx={{
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.300',
          borderRadius: 4,
          p: 6,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragging ? 'primary.50' : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          opacity: isUploading ? 0.6 : 1,
          pointerEvents: isUploading ? 'none' : 'auto',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'grey.50'
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          style={{ display: 'none' }}
          accept=".pdf,.txt,.doc,.docx"
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: 'primary.50', 
              color: 'primary.main', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            {isUploading ? (
              <CircularProgress size={32} />
            ) : (
              <CloudUploadIcon sx={{ fontSize: 32 }} />
            )}
          </Box>
          <Box>
            <Typography variant="h6" color="text.primary" fontWeight="600">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              PDF, Word, or Text files (max 10MB)
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Fade in={!!status}>
        <Box sx={{ mt: 2 }}>
          {status && (
            <Alert 
              severity={status.type} 
              icon={status.type === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
              sx={{ borderRadius: 2 }}
            >
              {status.message}
            </Alert>
          )}
        </Box>
      </Fade>
    </Box>
  );
}
