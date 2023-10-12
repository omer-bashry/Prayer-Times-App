/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";

export default function Prayer({ name, time, image }) {
  const isLoading = useSelector((state) => state.prayersApi.isLoading);
  return (
    <Card sx={{ maxWidth: "100%" }}>
      <CardMedia sx={{ height: 140 }} image={image} title="green iguana" />
      <CardContent>
        <h4>{name}</h4>
        <Typography
          variant="h2"
          color="text.secondary"
          style={{
            fontWeight: "normal",
            position: "relative",
            height: isLoading ? "110%" : "100%",
          }}
        >
          <div
            style={{
              background: "white",
              width: "110%",
              height: "110%",
              position: "absolute",
              display: isLoading ? "block" : "none",
            }}
          >
            <CircularProgress />
          </div>
          <span>{time}</span>
        </Typography>
      </CardContent>
    </Card>
  );
}
