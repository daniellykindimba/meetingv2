import {Box, Button} from "@mui/material";
import React, {useState} from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";
import {EventData} from "../../../../interfaces";
import {CKEditorComponent} from "../../../../components/editor";
import {set} from "react-hook-form";

interface Props {
  randKey?: number;
  onFinish?: any;
  meeting?: EventData | any;
}

export const CreateMeetingAgendaForm: React.FC<Props> = (props: Props) => {
  const [data, setData] = useState<string>("");

  const createMeetingAgenda = async (content: string) => {
    const {data} = await new ApiService().createMeetingAgenda(
      props.meeting.id,
      content
    );
    console.log(data);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-right",
        });
        props.onFinish(data.eventAgenda);
        setData("");
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
          mt: 5,
        }}
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          formData.append("event_id", props.meeting.id.toString());
        }}
      >
        <div>
          <CKEditorComponent
            data={data}
            onChange={(data: any) => setData(data)}
          />
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 5,
          }}
        >
          <Button
            variant="contained"
            type="submit"
            disabled={data === ""}
            onClick={() => createMeetingAgenda(data)}
          >
            Add
          </Button>
        </Box>
      </Box>
    </>
  );
};
