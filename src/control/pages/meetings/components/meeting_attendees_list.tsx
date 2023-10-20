import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";
import {EventAttendeeData, EventData} from "../../../../interfaces";
import {Close, Delete} from "@mui/icons-material";
import {AddingMeetingAttendees} from "./adding_meeting_attendees";

interface Props {
  randKey?: number;
  onFinish?: any;
  meeting?: EventData | any;
}

export const MeetingAttendeesList: React.FC<Props> = (props: Props) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchKey, setSearchKey] = useState("");
  const [addAttendee, setAddAttendee] = React.useState(false);

  const [attendees, setAttendees] = useState<EventAttendeeData[]>([]);
  const [attendee, setAttendee] = useState<EventAttendeeData | null>(null);

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

  useEffect(() => {
    getAttendees();
  }, []);

  return (
    <>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: {
                xs: "100%",
                sm: "20%",
                xl: "20%",
              },
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => setAddAttendee(true)}
            >
              Add Attendee
            </Button>
          </Box>
        </Container>
      </Grid>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          maxHeight: "80vh",
          minHeight: "80vh",
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
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <IconButton onClick={() => removeAttendee(at.id)}>
                    <Delete />
                  </IconButton>
                }
              >
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
    </>
  );
};
