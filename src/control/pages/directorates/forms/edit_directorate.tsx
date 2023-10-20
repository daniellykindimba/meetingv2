import {Box, Button, TextField} from "@mui/material";
import React from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";
import {DepartmentData} from "../../../../interfaces";

interface Props {
  randKey?: number;
  onFinish?: any;
  directorate?: DepartmentData | any;
}

export const ControlDirectorateEditForm: React.FC<Props> = (props: Props) => {
  const updateVenue = async (id: number, formData: FormData) => {
    const name = formData.get("name");
    const description = formData.get("description");
    const {data} = await new ApiService().updateDirectorate(
      id,
      name as string,
      description as string
    );
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-right",
        });
        props.onFinish(data.department);
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
          updateVenue(props.directorate.id, formData);
        }}
      >
        <div>
          <TextField
            id="outlined-error"
            label="Venue Name"
            name="name"
            defaultValue={props.directorate?.name ?? ""}
            required={true}
          />

          <TextField
            id="standard-multiline-flexible"
            label="Description"
            multiline
            name="description"
            minRows={4}
            defaultValue={props.directorate?.description ?? ""}
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
