'use client';

import { useEffect, useState } from 'react';
import { getDocuments } from '@/lib/api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Box, 
  Typography, 
  Skeleton 
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { motion } from 'framer-motion';

interface Document {
  id: number;
  filename: string;
  title: string;
  upload_date: string;
}

interface DocumentListProps {
  refreshTrigger: number;
}

export default function DocumentList({ refreshTrigger }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  if (documents.length === 0) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          textAlign: 'center', 
          border: '1px dashed', 
          borderColor: 'grey.300', 
          borderRadius: 4,
          bgcolor: 'grey.50'
        }}
      >
        <Typography color="text.secondary">No documents uploaded yet.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 4, overflow: 'hidden' }}>
      <Table>
        <TableHead sx={{ bgcolor: 'grey.50' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Filename</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date Uploaded</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc, index) => (
            <TableRow
              key={doc.id}
              component={motion.tr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              sx={{ '&:hover': { bgcolor: 'grey.50' } }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, bgcolor: 'primary.50', borderRadius: 2, color: 'primary.main' }}>
                    <DescriptionIcon fontSize="small" />
                  </Box>
                  <Typography variant="body2" fontWeight="500">
                    {doc.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}>
                  {doc.filename}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {new Date(doc.upload_date).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label="Active" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'success.50', 
                    color: 'success.700', 
                    fontWeight: 600,
                    height: 24
                  }} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
