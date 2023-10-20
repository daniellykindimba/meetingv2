import {Box, Button, MenuItem, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";
import {VenueData} from "../../../../interfaces";

interface Props {
  randKey?: number;
  onFinish?: any;
  venue?: VenueData | any;
}

export const ControlVenueEditForm: React.FC<Props> = (props: Props) => {
  const [venueTypes, setVenueTypes] = useState<string[]>([]);

  const getVenueTypes = async () => {
    const {data} = await new ApiService().getVenueTypes();
    if (data.data) {
      setVenueTypes(data.data);
    }
  };

  const updateVenue = async (id: number, formData: FormData) => {
    const name = formData.get("name");
    const capacity = formData.get("capacity");
    const venue_type = formData.get("venue_type");
    const description = formData.get("description");
    const {data} = await new ApiService().updateVenue(
      id,
      name as string,
      parseInt((capacity as string) ?? "0"),
      venue_type as string,
      description as string
    );
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-right",
        });
        props.onFinish(data.venue);
      } else {
        toast.error(data.message, {
          position: "bottom-right",
        });
      }
    }
  };

  useEffect(() => {
    getVenueTypes();
    console.log("get venue types");
  }, []);
  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": {m: 1, width: "100%"},
        }}
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          updateVenue(props.venue.id, formData);
        }}
      >
        <div>
          <TextField
            id="outlined-error"
            label="Venue Name"
            name="name"
            defaultValue={props.venue?.name ?? ""}
            required={true}
          />
          <TextField
            id="outlined-error-helper-text"
            label="Capacity"
            name="capacity"
            defaultValue={props.venue?.capacity ?? ""}
          />

          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            name="venue_type"
            defaultValue={(props.venue?.venueType ?? "")
              .toString()
              .toLowerCase()}
            required
          >
            {venueTypes.map((vt) => (
              <MenuItem key={vt} value={vt}>
                {vt.charAt(0).toUpperCase() + vt.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="standard-multiline-flexible"
            label="Description"
            multiline
            name="description"
            minRows={4}
            defaultValue={props.venue?.description ?? ""}
          />
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};
