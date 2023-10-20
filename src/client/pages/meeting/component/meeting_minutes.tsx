import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  DepartmentData,
  EventAgendaData,
  EventData,
  EventDocumentData,
  EventMinuteData,
} from "../../../../interfaces";
import {useEffect, useState} from "react";
import ApiService from "../../../../utils/api_services";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Alert,
  ListItemSecondaryAction,
} from "@mui/material";
import {toast} from "react-hot-toast";
import {Close} from "@mui/icons-material";
import {CreateMeetingAgendaForm} from "../forms/create_meeting_agenda_form";
import {CreateMeetingMinuteForm} from "../forms/create_meeting_minute_form";

interface Props {
  randKey?: number;
  meeting?: EventData | any;
}

export const MeetingMinutesComponent: React.FC<Props> = (props: Props) => {
  const [value, setValue] = useState(0);
  const [minutes, setMinutes] = useState<EventMinuteData[]>([]);
  const [minute, setMinute] = useState<EventMinuteData>();
  const [addModal, setAddModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const handleMinuteDelete = (minute: EventMinuteData) => {
    setMinute(minute);
    setDeleteModal(true);
  };

  const deleteMinute = async (minute_id: number | any) => {
    const {data} = await new ApiService().deleteMeetingMinute(minute_id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          duration: 4000,
          position: "top-center",
        });
        setMinutes(
          minutes.filter((minute: EventMinuteData) => minute.id !== minute_id)
        );
      } else {
        toast.error(data.message, {
          duration: 4000,
          position: "top-center",
        });
      }
    } else {
      toast.error("Something went wrong", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const getMinutes = async () => {
    const {data} = await new ApiService().getMeetingMinutes(props.meeting?.id);
    if (data) {
      setMinutes(data.results);
    }
  };

  useEffect(() => {
    getMinutes();
  }, []);

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Container>
              <Box
                component={"form"}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <TextField
                  id="standard-search"
                  label="Search Minutes ..."
                  type="search"
                  variant="standard"
                  name="search"
                  autoComplete="off"
                  sx={{
                    width: "100%",
                  }}
                />
              </Box>
            </Container>
          </Grid>
          <Grid item xs={4}>
            <Container
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="outlined" onClick={() => setAddModal(true)}>
                Add New Minute
              </Button>
            </Container>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          maxHeight: "73vh",
          overflowY: "auto",
          overflowX: "hidden",
          padding: 2,
        }}
      >
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            listStyle: "decimal",
          }}
        >
          {minutes.length === 0 && (
            <>
              <ListItem>
                <Alert
                  severity="info"
                  sx={{
                    width: "100%",
                  }}
                >
                  No Minutes Found
                </Alert>
              </ListItem>
              <Divider variant="inset" />
            </>
          )}

          {minutes.map((minute: EventMinuteData) => (
            <>
              <ListItem alignItems="flex-start" sx={{display: "list-item"}}>
                <ListItemText
                  sx={{
                    paddingRight: 5,
                  }}
                  primary={
                    <>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: minute?.content,
                        }}
                      />
                    </>
                  }
                />
                {minute.canDelete && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleMinuteDelete(minute)}
                    >
                      <Close />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
                <Divider variant="inset" />
              </ListItem>
            </>
          ))}
        </List>
      </Box>

      <Modal
        open={addModal}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setAddModal(false);
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40vw",
            bgcolor: "background.paper",
            border: "2px solid green",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Adding a New Minute
            <IconButton
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
              }}
              onClick={() => setAddModal(false)}
            >
              <Close />
            </IconButton>
          </Typography>
          <Box>
            <CreateMeetingMinuteForm
              meeting={props.meeting}
              onFinish={(minute: EventMinuteData) => {
                setMinutes([...minutes, minute]);
              }}
            />
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={deleteModal}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setDeleteModal(false);
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Minute Deletion Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this minute?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button onClick={() => deleteMinute(minute?.id)} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
