'use client'
import { Typography, Box, CircularProgress, Alert, Pagination, TextField, FormControl, InputLabel, Select, MenuItem, Button, Chip, Switch, FormControlLabel } from '@mui/material';
import LaunchCard from './LaunchCard';
import { LaunchData, fetchLaunches } from '../lib/api';
import { useState, useEffect } from 'react';

interface LaunchGridProps {
  showFavorites?: boolean;
}

export default function LaunchGrid({ showFavorites = false }: LaunchGridProps) {
  const [launches, setLaunches] = useState<LaunchData[]>([]);
  const [filteredLaunches, setFilteredLaunches] = useState<LaunchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [successfulOnly, setSuccessfulOnly] = useState(false);
  
  const itemsPerPage = 18;

  useEffect(() => {
    const loadLaunches = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all launches first to get total count
        const data = await fetchLaunches(200); // Get more data for pagination
        setLaunches(data);
        setFilteredLaunches(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch launches');
      } finally {
        setLoading(false);
      }
    };

    loadLaunches();
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (launch: LaunchData) => {
    // For now, just log the launch details to console
    // You can implement a modal, navigate to detail page, etc.
    console.log('Launch Details:', launch);
    alert(`Launch Details:\n\nName: ${launch.name}\nDate: ${new Date(launch.date_utc).toLocaleDateString()}\nRocket: ${launch.rocket}\nLaunchpad: ${launch.launchpad}\nSuccess: ${launch.success}\nUpcoming: ${launch.upcoming}`);
  };

  const handleToggleFavorite = (launch: LaunchData) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(launch.id)) {
        newFavorites.delete(launch.id);
      } else {
        newFavorites.add(launch.id);
      }
      return newFavorites;
    });
  };

  // Filter launches based on search term, year, and success status
  useEffect(() => {
    let filtered = launches;

    // Filter by search term (mission name)
    if (searchTerm) {
      filtered = filtered.filter(launch => 
        launch.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear) {
      filtered = filtered.filter(launch => 
        new Date(launch.date_utc).getFullYear().toString() === selectedYear
      );
    }

    // Filter by success status
    if (successfulOnly) {
      filtered = filtered.filter(launch => launch.success === true);
    }

    setFilteredLaunches(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [launches, searchTerm, selectedYear, successfulOnly, itemsPerPage]);

  // Get unique years from launches for dropdown
  const availableYears = Array.from(
    new Set(launches.map(launch => new Date(launch.date_utc).getFullYear().toString()))
  ).sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)

  // Calculate current page data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLaunches = filteredLaunches.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading launches: {error}
        </Alert>
      </Box>
    );
  }

  if (launches.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          {showFavorites ? 'No favorite launches yet' : 'No launches found'}
        </Typography>
      </Box>
    );
  }

  if (filteredLaunches.length === 0) {
    return (
      <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Filter Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Search by mission name"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white'
              }
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: 'black' }}>Filter by Year</InputLabel>
            <Select
              value={selectedYear}
              label="Filter by Year"
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.23)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.87)'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2'
                },
                '& .MuiSelect-select': {
                  color: 'black !important'
                }
              }}
            >
              <MenuItem value="">All Years</MenuItem>
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={successfulOnly}
                onChange={(e) => setSuccessfulOnly(e.target.checked)}
              />
            }
            label="Successful Only"
            sx={{color: 'black'}}
          />
        </Box>

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No launches match your current filters
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search criteria
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search by mission name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white'
            }
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: 'black' }}>Filter by Year</InputLabel>
          <Select
            value={selectedYear}
            label="Filter by Year"
            onChange={(e) => setSelectedYear(e.target.value)}
            sx={{
              backgroundColor: 'white',
              color: 'black',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.23)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.87)'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2'
              },
              '& .MuiSelect-select': {
                color: 'black !important'
              }
            }}
          >
            <MenuItem value="">All Years</MenuItem>
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControlLabel
          control={
            <Switch
              checked={successfulOnly}
              onChange={(e) => setSuccessfulOnly(e.target.checked)}
            />
          }
          label="Successful Only"
          sx={{ color: 'black' }}
        />

        {/* Active filters display */}
        {(searchTerm || selectedYear || successfulOnly) && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">Active filters:</Typography>
            {searchTerm && (
              <Chip 
                label={`Search: "${searchTerm}"`} 
                size="small" 
                onDelete={() => setSearchTerm('')}
              />
            )}
            {selectedYear && (
              <Chip 
                label={`Year: ${selectedYear}`} 
                size="small" 
                onDelete={() => setSelectedYear('')}
              />
            )}
            {successfulOnly && (
              <Chip 
                label="Successful Only" 
                size="small" 
                onDelete={() => setSuccessfulOnly(false)}
              />
            )}
          </Box>
        )}
      </Box>
      
      {/* Page Info */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredLaunches.length)} of {filteredLaunches.length} launches
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentLaunches.map((launch) => (
          <div key={launch.id}>
            <LaunchCard 
              launch={launch} 
              onViewDetails={handleViewDetails}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.has(launch.id)}
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                '&.Mui-selected': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
