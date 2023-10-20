import {Box, Button, MenuItem, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";

interface Props {
  randKey?: number;
  onFinish?: any;
}

export const ControlCommitteeCreateForm: React.FC<Props> = (props: Props) => {
  const createVenue = async (formData: FormData) => {
    const name = formData.get("name");
    const description = formData.get("description");
    const {data} = await new ApiService().createCommittee(
      name as string,
      description as string
    );
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-right",
        });
        props.onFinish(data.committee);
      } else {
        toast.error(data.message, {
          position: "bottom-right",
        });
      }
    }
  };

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
          createVenue(formData);
        }}
      >
        <div>
          <TextField
            id="outlined-error"
            label="Venue Name"
            name="name"
            required={true}
          />
          <TextField
            id="standard-multiline-flexible"
            label="Description"
            multiline
            name="description"
            minRows={4}
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
