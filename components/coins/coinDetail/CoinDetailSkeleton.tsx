'use client';

import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Box, Skeleton, Paper } from '@mui/material';

// Loading skeleton component
export default function CoinDetailSkeleton() {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
    return (
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        <Box sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton 
              variant="text" 
              width={isSmall ? 250 : 300} 
              height={isSmall ? 32 : 40} 
            />
          </Box>
        </Box>
  
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
        }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Skeleton 
                  variant="circular" 
                  width={isSmall ? 48 : 64} 
                  height={isSmall ? 48 : 64} 
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Skeleton variant="text" width="70%" height={isSmall ? 32 : 40} />
                  <Skeleton variant="text" width="40%" height={24} />
                </Box>
              </Box>
              <Skeleton variant="text" width="60%" height={isSmall ? 48 : 60} />
              <Skeleton variant="text" width="50%" height={32} />
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2 }} />
            </Paper>
            
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
              <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
              }}>
                {[...Array(4)].map((_, i) => (
                  <Box key={i}>
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="60%" height={32} />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
  
          <Box sx={{ 
            width: { xs: '100%', lg: 400 },
            flexShrink: 0,
          }}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
              <Skeleton variant="text" width={150} height={32} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={48} sx={{ mb: 3 }} />
              {[...Array(3)].map((_, i) => (
                <Box key={i} display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="text" width={80} height={20} />
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Box>
    );
  }