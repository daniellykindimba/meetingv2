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
import {
  EventAttendeeData,
  EventComitteeData,
  EventData,
} from "../../../../interfaces";
import {Close, Delete} from "@mui/icons-material";
import {AddingMeetingAttendees} from "./adding_meeting_attendees";
import {AddingMeetingCommittees} from "./adding_meeting_committees";

interface Props {
  randKey?: number;
  onFinish?: any;
  meeting?: EventData | any;
}

export const MeetingCommitteesList: React.FC<Props> = (props: Props) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchKey, setSearchKey] = useState("");
  const [addCommittee, setAddCommittee] = React.useState(false);

  const [committees, setCommittees] = useState<EventComitteeData[]>([]);
  const [committee, setCommittee] = useState<EventComitteeData | null>(null);

  const removeCommittee = async (committee_id: number) => {
    const {data} = await new ApiService().removeMeetingCommittee(
      props.meeting.id,
      committee_id
    );
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-left",
        });
        setCommittees(
          committees.filter(
            (c: EventComitteeData) => c.committee.id !== committee_id
          )
        );

        if (
          committees.filter(
            (c: EventComitteeData) => c.committee.id !== committee_id
          ).length === 0
        ) {
          getCommittees();
        }
      } else {
        toast.error(data.message, {
          position: "bottom-left",
        });
      }
    }
  };

  const getCommittees = async (searchKey = "") => {
    const {data} = await new ApiService().getMeetingCommittees(
      props.meeting.id,
      searchKey
    );
    if (data) {
      setTotal(data.total);
      setPage(data.page);
      setCommittees(data.results);
    }
  };

  useEffect(() => {
    getCommittees();
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
              getCommittees((e.target as HTMLFormElement).search.value);
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
              onClick={() => setAddCommittee(true)}
            >
              Add Committee
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
        {committees.length === 0 && (
          <>
            <Alert
              sx={{
                width: "100%",
              }}
            >
              <Typography>No Committee Found ...</Typography>
            </Alert>
          </>
        )}

        {committees.map((c: EventComitteeData) => {
          return (
            <>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <IconButton onClick={() => removeCommittee(c.committee.id)}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText primary={c.committee.name} />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          );
        })}
      </List>
      {committees.length > 0 && (
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
              getCommittees(searchKey);
            }}
          />
        </Box>
      )}

      <Drawer
        anchor={"right"}
        open={addCommittee}
        sx={{
          "& .MuiDrawer-paper": {width: "40vw"},
          zIndex: 9999,
        }}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") setAddCommittee(false);
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
            Adding Committee
            {/* define a close button */}
            <IconButton
              aria-label="fingerprint"
              sx={{
                position: "absolute",
                right: 10,
                top: 5,
                color: "red",
              }}
              onClick={() => setAddCommittee(false)}
            >
              <Close />
            </IconButton>
          </Typography>
          <AddingMeetingCommittees
            meeting={props.meeting}
            onFinish={(c: EventComitteeData) => {
              setCommittees([c, ...committees]);
            }}
          />
        </Box>
      </Drawer>
    </>
  );
};
