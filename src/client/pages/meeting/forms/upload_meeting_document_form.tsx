import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";
import {DepartmentData, EventData} from "../../../../interfaces";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

interface Props {
  randKey?: number;
  onFinish?: any;
  meeting?: EventData | any;
}

export const UploadingMeetingDocumentForm: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [directorates, setDirectorates] = useState<DepartmentData[]>([]);
  const [document, setDocument] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMeetingDocument = async (formData: FormData) => {
    setLoading(true);
    const {data} = await new ApiService().createMeetingDocument(formData);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-right",
        });
        props.onFinish(data.eventDocument);
      } else {
        toast.error(data.message, {
          position: "bottom-right",
        });
      }
    }
    setLoading(false);
  };

  const getDirectorates = async () => {
    const {data} = await new ApiService().getDirectorates();
    if (data) {
      setDirectorates(data.results);
    }
  };

  useEffect(() => {
    getDirectorates();
  }, []);

  return (
    <>
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      )}
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": {m: 1, width: "100%"},
        }}
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          formData.append("event_id", props.meeting.id.toString());
          //   createVenue(formData);
          // console.log(formData.get("document"));
          if (!document) {
            setErrorMessage("Please Choose a Document/Paper to upload");
          } else {
            createMeetingDocument(formData);
          }
        }}
      >
        <div>
          <TextField
            id="title-input"
            label="Document Title"
            name="title"
            required={true}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <TextField
            id="standard-multiline-flexible"
            label="Document Description"
            multiline
            name="description"
            minRows={4}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          <FormControl
            fullWidth
            sx={{
              ml: 1,
            }}
          >
            <InputLabel id="demo-simple-select-label">Directorate</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Directorate"
              name="department_id"
              onChange={(e) => {
                <CircularProgress color="secondary" />;
                console.log(e);
              }}
            >
              {directorates.map((d) => (
                <MenuItem value={d.id}>{d.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{
              mt: 3,
              ml: 1,
            }}
          >
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              href="#file-upload"
            >
              Upload a file
              <VisuallyHiddenInput
                type="file"
                name="document"
                accept=".pdf,.docx,ppsx,.pptx,.xlsx,.doc,.ppt,.xls"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    // Access the first file
                    const firstFile = files[0];

                    // Now 'firstFile' contains the first selected file
                    console.log("First file:", firstFile);
                    setDocument(firstFile.name);
                    setTitle(firstFile.name);
                  } else {
                    console.log("No files selected.");
                  }
                }}
              />
            </Button>
          </Box>
          {document && (
            <Box>
              <List dense={true}>
                <ListItem>
                  <ListItemText primary={document} />
                </ListItem>
              </List>
            </Box>
          )}
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 10,
          }}
        >
          <Button variant="contained" type="submit" disabled={loading}>
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};
