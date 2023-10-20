import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";
import {EventAttendeeData, EventData} from "../../../../interfaces";
import {Add, Close, Delete, NotificationAdd} from "@mui/icons-material";
import {AddingMeetingAttendees} from "./adding_meeting_attendees";
import {MeetingDocumentsManagers} from "./meeting_documents_managers";
import {MeetingAgendasManagers} from "./meeting_agendas_managers";
import {MeetingMinutesManagers} from "./meeting_minutes_managers";

interface Props {
  randKey?: number;
  onFinish?: any;
  meeting?: EventData | any;
  height?: string;
}

export const MeetingAttendeesList: React.FC<Props> = (props: Props) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchKey, setSearchKey] = useState("");
  const [addAttendee, setAddAttendee] = React.useState(false);

  const [attendees, setAttendees] = useState<EventAttendeeData[]>([]);
  const [attendee, setAttendee] = useState<EventAttendeeData>();
  const [notifyModal, setNotifyModal] = useState(false);
  const [notifySingleModal, setNotifySingleModal] = useState(false);
  const [documentsMangerModal, setDocumentsMangerModal] = useState(false);
  const [agendasMangerModal, setAgendasMangerModal] = useState(false);
  const [minutesMangerModal, setMinutesMangerModal] = useState(false);

  const removeAttendee = async (attendee_id: number) => {
    const {data} = await new ApiService().removeMeetingAttendee(
      props.meeting.id,
      attendee_id
    );
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-left",
        });
        setAttendees(
          attendees.filter(
            (attendee: EventAttendeeData) => attendee.id !== attendee_id
          )
        );

        if (
          attendees.filter(
            (attendee: EventAttendeeData) => attendee.id !== attendee_id
          ).length === 0
        ) {
          getAttendees();
        }
      } else {
        toast.error(data.message, {
          position: "bottom-left",
        });
      }
    }
  };

  const getAttendees = async (page = 1, pageSize = 25, searchKey = "") => {
    const {data} = await new ApiService().getEventAttendees(
      props.meeting.id,
      page,
      pageSize,
      searchKey
    );
    if (data) {
      setTotal(data.total);
      setPage(data.page);
      setAttendees(data.results);
    }
  };

  const sendMeetingInvitationSMSAllAttendees = async () => {
    const {data} = await new ApiService().sendMeetingInvitationSMSAllAttendees(
      props.meeting.id
    );
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-left",
        });
      } else {
        toast.error(data.message, {
          position: "bottom-left",
        });
      }
    }
  };

  const sendMeetingInvitationSMSAttendee = async () => {
    const {data} = await new ApiService().sendMeetingInvitationSMSAttendee(
      props.meeting.id,
      attendee?.id ?? 0
    );
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-left",
        });
      } else {
        toast.error(data.message, {
          position: "bottom-left",
        });
      }
    }
  };

  const handleNotifyAttendee = (attendee: EventAttendeeData) => {
    setAttendee(attendee);
    setNotifySingleModal(true);
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return (
    <>
      <Grid item xs={4} sm={4} xl={4}>
        {props.meeting.canManage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => setAddAttendee(true)}
            >
              Add Attendee
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                marginLeft: 1,
              }}
              onClick={() => setNotifyModal(true)}
            >
              Notification (SMS)
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                marginLeft: 1,
              }}
              onClick={() => setDocumentsMangerModal(true)}
            >
              Documents Managers
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                marginLeft: 1,
              }}
              onClick={() => setAgendasMangerModal(true)}
              disabled
            >
              Agendas Managers
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                marginLeft: 1,
              }}
              onClick={() => setMinutesMangerModal(true)}
              disabled
            >
              Minutes Managers
            </Button>
          </Box>
        )}
      </Grid>

      <Grid item xs={8} sm={8} xl={8}>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            component={"form"}
            onSubmit={(e) => {
              e.preventDefault();
              getAttendees(1, 25, (e.target as HTMLFormElement).search.value);
            }}
            sx={{
              width: {
                xs: "100%",
                sm: "80%",
                xl: "80%",
              },
            }}
          >
            <TextField
              id="standard-search"
              label="Search Attendees ..."
              type="search"
              variant="standard"
              name="search"
              autoComplete="off"
              sx={{
                width: {
                  xs: "100%",
                  sm: "80%",
                  xl: "80%",
                },
              }}
            />
          </Box>
        </Container>
      </Grid>

      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          maxHeight: props.height ? props.height : "85vh",
          minHeight: props.height ? props.height : "85vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {attendees.length === 0 && (
          <>
            <Alert
              sx={{
                width: "100%",
              }}
            >
              <Typography>No Attendee Found ...</Typography>
            </Alert>
          </>
        )}

        {attendees.map((at: EventAttendeeData) => {
          return (
            <>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt={
                      at.attendee.firstName +
                      " " +
                      at.attendee.middleName +
                      " " +
                      at.attendee.lastName
                    }
                    src="/static/images/avatar/1.jpg"
                    sx={{
                      backgroundColor: "green",
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    at.attendee.firstName +
                    " " +
                    at.attendee.middleName +
                    " " +
                    at.attendee.lastName
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{display: "inline"}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        <Chip label={at.attendee?.email} variant="outlined" />
                        <Chip label={at.attendee?.phone} variant="outlined" />
                      </Typography>
                    </React.Fragment>
                  }
                />

                {props.meeting.canManage && (
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => removeAttendee(at.id)}>
                      <Delete />
                    </IconButton>
                    <IconButton onClick={() => handleNotifyAttendee(at)}>
                      <NotificationAdd />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          );
        })}
      </List>
      {attendees.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 3,
          }}
        >
          <Pagination
            count={parseInt((total / limit).toString())}
            color="primary"
            onChange={(e, page) => {
              setPage(page);
              getAttendees(page, limit, searchKey);
            }}
          />
        </Box>
      )}

      <Drawer
        anchor={"right"}
        open={addAttendee}
        sx={{
          "& .MuiDrawer-paper": {width: "40vw"},
          zIndex: 9999,
        }}
        onClose={() => {
          setAddAttendee(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bgcolor: "background.paper",
            border: "2px solid green",
            boxShadow: 24,
            minHeight: "100vh",
            width: "100%",
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Adding Attendees
            {/* define a close button */}
            <IconButton
              aria-label="fingerprint"
              sx={{
                position: "absolute",
                right: 10,
                top: 5,
                color: "red",
              }}
              onClick={() => setAddAttendee(false)}
            >
              <Close />
            </IconButton>
          </Typography>
          <AddingMeetingAttendees
            meeting={props.meeting}
            onFinish={(attendee: EventAttendeeData) => {
              setAttendees([attendee, ...attendees]);
            }}
          />
        </Box>
      </Drawer>

      <Dialog
        open={notifyModal}
        onClose={() => {
          setNotifyModal(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Nitifying All Attendees of this Meeting
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to notify all Attendees for this Meeting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNotifyModal(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              sendMeetingInvitationSMSAllAttendees();
              setNotifyModal(false);
            }}
            autoFocus
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={notifySingleModal}
        onClose={() => {
          setNotifySingleModal(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Nitifying Attendee of this Meeting
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to notify Attendee for this Meeting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNotifySingleModal(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              sendMeetingInvitationSMSAttendee();
              setNotifySingleModal(false);
            }}
            autoFocus
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor={"right"}
        open={documentsMangerModal}
        sx={{
          "& .MuiDrawer-paper": {width: "40vw"},
          zIndex: 9999,
        }}
        onClose={() => {
          setDocumentsMangerModal(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bgcolor: "background.paper",
            border: "2px solid green",
            boxShadow: 24,
            minHeight: "100vh",
            width: "100%",
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Documents Managers
            {/* define a close button */}
            <IconButton
              aria-label="fingerprint"
              sx={{
                position: "absolute",
                right: 10,
                top: 5,
                color: "red",
              }}
              onClick={() => setDocumentsMangerModal(false)}
            >
              <Close />
            </IconButton>
          </Typography>
          <MeetingDocumentsManagers
            meeting={props.meeting}
            onFinish={(attendee: EventAttendeeData) => {
              setAttendees([attendee, ...attendees]);
            }}
          />
        </Box>
      </Drawer>

      <Drawer
        anchor={"right"}
        open={agendasMangerModal}
        sx={{
          "& .MuiDrawer-paper": {width: "40vw"},
          zIndex: 9999,
        }}
        onClose={() => {
          setAgendasMangerModal(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bgcolor: "background.paper",
            border: "2px solid green",
            boxShadow: 24,
            minHeight: "100vh",
            width: "100%",
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Agendas Managers
            {/* define a close button */}
            <IconButton
              aria-label="fingerprint"
              sx={{
                position: "absolute",
                right: 10,
                top: 5,
                color: "red",
              }}
              onClick={() => setAgendasMangerModal(false)}
            >
              <Close />
            </IconButton>
          </Typography>
          <MeetingAgendasManagers
            meeting={props.meeting}
            onFinish={(attendee: EventAttendeeData) => {
              setAttendees([attendee, ...attendees]);
            }}
          />
        </Box>
      </Drawer>

      <Drawer
        anchor={"right"}
        open={minutesMangerModal}
        sx={{
          "& .MuiDrawer-paper": {width: "40vw"},
          zIndex: 9999,
        }}
        onClose={() => {
          setMinutesMangerModal(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bgcolor: "background.paper",
            border: "2px solid green",
            boxShadow: 24,
            minHeight: "100vh",
            width: "100%",
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Minutes Managers
            {/* define a close button */}
            <IconButton
              aria-label="fingerprint"
              sx={{
                position: "absolute",
                right: 10,
                top: 5,
                color: "red",
              }}
              onClick={() => setMinutesMangerModal(false)}
            >
              <Close />
            </IconButton>
          </Typography>
          <MeetingMinutesManagers
            meeting={props.meeting}
            onFinish={(attendee: EventAttendeeData) => {
              setAttendees([attendee, ...attendees]);
            }}
          />
        </Box>
      </Drawer>
    </>
  );
};
