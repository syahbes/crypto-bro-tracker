"use client";

import React from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import PortfolioTableRow from "./PortfolioTableRow";
import PortfolioMobileCard from "./PortfolioMobileCard";

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  image: string;
  amount: number;
  purchasePrice: number;
  currentPrice?: number;
  purchaseDate: string;
}

interface PortfolioTableProps {
  items: PortfolioItem[];
  onRowClick: (itemId: string) => void;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (item: PortfolioItem) => void;
}

export default function PortfolioTable({
  items,
  onRowClick,
  onEdit,
  onDelete,
}: PortfolioTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(8px)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 }, pb: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Holdings
        </Typography>
      </Box>

      {isMobile ? (
        <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            {items.map((item) => (
              <PortfolioMobileCard
                key={item.id}
                item={item}
                onRowClick={onRowClick}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </Box>
        </Box>
      ) : (
        // Desktop: Table Layout
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Asset</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Holdings</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Current Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Purchase Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>P&L</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <PortfolioTableRow
                  key={item.id}
                  item={item}
                  onRowClick={onRowClick}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
