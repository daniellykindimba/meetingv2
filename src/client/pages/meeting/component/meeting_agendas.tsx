import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {EventAgendaData, EventData} from "../../../../interfaces";
import {useEffect, useState} from "react";
import ApiService from "../../../../utils/api_services";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Button,
  Grid,
  Container,
  TextField,
  Modal,
  IconButton,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {CreateMeetingAgendaForm} from "../forms/create_meeting_agenda_form";
import toast from "react-hot-toast";

interface Props {
  randKey?: number;
  meeting?: EventData | any;
}

export const MeetingAgendasComponent: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [agenda, setAgenda] = useState<EventAgendaData>();
  const [agendas, setAgendas] = useState<EventAgendaData[]>([]);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const getAgendas = async (searchKey = "") => {
    setLoading(true);
    const {data} = await new ApiService().getMeetingAgendas(
      props.meeting?.id,
      searchKey
    );
    if (data) {
      setAgendas(data.results);
    }
    setLoading(false);
  };

  const handleAgendaDelete = (agenda: EventAgendaData) => {
    setDeleteModal(true);
    setAgenda(agenda);
  };

  const deleteAgenda = async (agenda_id: number | any) => {
    const {data} = await new ApiService().deleteMeetingAgenda(agenda_id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          duration: 4000,
          position: "top-center",
        });
        setAgendas(
          agendas.filter((agenda: EventAgendaData) => agenda.id !== agenda_id)
        );
        setDeleteModal(false);
      } else {
        toast.error(data.message, {
          duration: 4000,
          position: "top-center",
        });
      }
    }
  };

  useEffect(() => {
    getAgendas();
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
                  getAgendas((e.target as HTMLFormElement).search.value);
                }}
              >
                <TextField
                  id="standard-search"
                  label="Search Agendas ..."
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
                Add New Agenda
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
          {agendas.length === 0 && (
            <>
              <ListItem>
                <Alert
                  severity="info"
                  sx={{
                    width: "100%",
                  }}
                >
                  No Agendas Found
                </Alert>
              </ListItem>
              <Divider variant="inset" />
            </>
          )}

          {agendas.map((agenda: EventAgendaData) => (
            <ListItem alignItems="flex-start" sx={{display: "list-item"}}>
              <ListItemText
                sx={{
                  paddingRight: 5,
                }}
                primary={
                  <>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: agenda.title,
                      }}
                    />
                  </>
                }
              />
              {agenda.canDelete && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleAgendaDelete(agenda)}
                  >
                    <Close />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
              <Divider />
            </ListItem>
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
            Adding a New Agenda
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
            <CreateMeetingAgendaForm
              meeting={props.meeting}
              onFinish={(agenda: EventAgendaData) => {
                setAgendas([...agendas, agenda]);
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
          {"Agenda Deletion Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this agenda?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button onClick={() => deleteAgenda(agenda?.id)} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
