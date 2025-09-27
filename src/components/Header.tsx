'use client'
import { Switch, FormControlLabel, Box } from '@mui/material';
import { useState } from 'react';

export default function Header() {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnabled(event.target.checked);
  };

  return (
    <div className="flex flex-row justify-between items-center bg-white p-6 shadow-md">
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold text-black'>Atmosly - SpaceX mission Explorer</h1>
        <h3 className='text-sm text-gray-800'>
          fetch real data from the SpaceX public API.Filter, Explore and
          favorite launches
        </h3>
      </div>
      <div>
        <Box sx={{ mt: 2 }}>
           <FormControlLabel
             control={
               <Switch
                 checked={isEnabled}
                 onChange={handleToggleChange}
                 color="primary"
               />
             }
             label={isEnabled ? "Show Favorites" : "Show All Launches"}
             sx={{ color: 'black' }}
           />
        </Box>
      </div>
    </div>
  );
}
