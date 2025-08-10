import { Card, CardContent, Box, Skeleton } from "@mui/material";

export default function CoinCardSkeleton() {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box>
                <Skeleton variant="text" width={100} height={24} />
                <Skeleton variant="text" width={50} height={20} />
              </Box>
            </Box>
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
  
          <Skeleton variant="text" width={120} height={32} sx={{ mb: 1 }} />
  
          <Box display="flex" alignItems="center" gap={0.5} mb={2}>
            <Skeleton variant="text" width={80} height={20} />
          </Box>
  
          <Box display="flex" flexDirection="column" gap={1}>
            {[...Array(3)].map((_, i) => (
              <Box
                key={i}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Skeleton variant="text" width={80} height={16} />
                <Skeleton variant="text" width={60} height={16} />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }
  