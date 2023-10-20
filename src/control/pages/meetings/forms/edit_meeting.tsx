import {Box, Button, TextField} from "@mui/material";
import React from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";
import {EventData as MeetingData} from "../../../../interfaces";

interface Props {
  randKey?: number;
  onFinish?: any;
  meeting?: MeetingData | any;
}

export const ControlMeetingEditForm: React.FC<Props> = (props: Props) => {
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
          updateVenue(props.meeting.id, formData);
        }}
      >
        <div>
          <TextField
            id="outlined-error"
            label="Meeting Title"
            name="title"
            defaultValue={props.meeting?.title ?? ""}
            required={true}
          />

          <TextField
            id="standard-multiline-flexible"
            label="Description"
            multiline
            name="description"
            minRows={4}
            defaultValue={props.meeting?.description ?? ""}
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
