import { Card, CardContent, Typography, Chip, Box, Button, IconButton, Tooltip } from "@mui/material";
import { Rocket, CalendarToday, LocationOn, Visibility, Star, StarBorder } from "@mui/icons-material";
import { LaunchData } from "../lib/api";

interface LaunchCardProps {
  launch: LaunchData;
  onViewDetails?: (launch: LaunchData) => void;
  onToggleFavorite?: (launch: LaunchData) => void;
  isFavorite?: boolean;
}

export default function LaunchCard({ launch, onViewDetails, onToggleFavorite, isFavorite = false }: LaunchCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
       <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
           <Typography
             variant="h6"
             component="h3"
             sx={{ fontWeight: "bold", flex: 1 }}
           >
             {launch.name}
           </Typography>
           {onToggleFavorite && (
             <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
               <Button
                 size="small"
                 variant="outlined"
                 startIcon={isFavorite ? <Star /> : <StarBorder />}
                 onClick={() => onToggleFavorite(launch)}
                 sx={{ 
                   color: isFavorite ? "#ffa726" : "#666",
                   borderColor: isFavorite ? "#ffa726" : "#ddd",
                   minWidth: "auto",
                   px: 1,
                   '&:hover': {
                     color: isFavorite ? "#ff9800" : "#333",
                     borderColor: isFavorite ? "#ff9800" : "#999",
                     backgroundColor: isFavorite ? "rgba(255, 167, 38, 0.04)" : "rgba(0, 0, 0, 0.04)"
                   }
                 }}
               >
                 {isFavorite ? "Favorited" : "Add to Favorites"}
               </Button>
             </Tooltip>
           )}
         </Box>
         <div className="flex flex-row gap-1">
           <CalendarToday color="action" fontSize="small" />
           <Typography variant="body2" color="text.secondary">
             {formatDate(launch.date_utc)}
           </Typography>
         </div>

         <div className="flex flex-row gap-1">
           {!launch.tbd && (
             <Chip
               label="TBD"
               size="small"
               sx={{
                 backgroundColor: "#f5f5f5",
                 color: "#666",
                 fontWeight: "bold",
               }}
             />
           )}
           <Chip
             label={getYear(launch.date_utc)}
             size="small"
             sx={{
               backgroundColor: "#1976d2",
               color: "white",
               fontWeight: "bold",
             }}
           />
         </div>

         {onViewDetails && (
           <Button
             variant="outlined"
             size="small"
             startIcon={<Visibility />}
             onClick={() => onViewDetails(launch)}
             sx={{
               alignSelf: "flex-start",
               mt: 1,
             }}
           >
             View Details
           </Button>
         )}
       </Box>
    </Card>
  );
}
