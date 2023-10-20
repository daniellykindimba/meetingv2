import {Box, Button, TextField} from "@mui/material";
import React, {} from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";
import {CommitteeData} from "../../../../interfaces";

interface Props {
  randKey?: number;
  onFinish?: any;
  committee?: CommitteeData | any;
}

export const ControlCommitteeEditForm: React.FC<Props> = (props: Props) => {
  const updateVenue = async (id: number, formData: FormData) => {
    const name = formData.get("name");
    const description = formData.get("description");
    const {data} = await new ApiService().updateCommittee(
      id,
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
          updateVenue(props.committee.id, formData);
        }}
      >
        <div>
          <TextField
            id="outlined-error"
            label="Venue Name"
            name="name"
            defaultValue={props.committee?.name ?? ""}
            required={true}
          />

          <TextField
            id="standard-multiline-flexible"
            label="Description"
            multiline
            name="description"
            minRows={4}
            defaultValue={props.committee?.description ?? ""}
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
