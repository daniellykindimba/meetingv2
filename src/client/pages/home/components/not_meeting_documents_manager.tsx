import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
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
import {EventAttendeeData, EventData, UserData} from "../../../../interfaces";
import {Add} from "@mui/icons-material";
import {get} from "http";

interface Props {
  randKey?: number;
  onFinish?: any;
  meeting?: EventData | any;
}

export const NotMeetingDocumentsManagers: React.FC<Props> = (props: Props) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchKey, setSearchKey] = useState("");
  const [members, setMembers] = useState<EventAttendeeData[]>([]);
  const [member, setMember] = useState<EventAttendeeData | null>(null);
  const [addManager, setAddManager] = React.useState(false);

  const addDocumentManager = async (attendee: EventAttendeeData) => {
    const {data} = await new ApiService().addDocumentManager(attendee.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-left",
        });
        setMembers(
          members.filter(
            (member: EventAttendeeData) => member.id !== attendee.id
          )
        );
        props.onFinish(attendee);
        if (
          members.filter(
            (member: EventAttendeeData) => member.id !== attendee.id
          ).length === 0
        ) {
          getMembers();
        }
      } else {
        toast.error(data.message, {
          position: "bottom-left",
        });
      }
    }
  };

  const getMembers = async (page = 1, limit = 25, searchKey = "") => {
    const {data} = await new ApiService().getNotMeetingDocumentsManagers(
      props.meeting.id,
      page,
      limit,
      searchKey
    );
    if (data) {
      setTotal(data.total);
      setPage(data.page);
      setMembers(data.results);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="outlined">Add All</Button>
      </Box> */}
      <Box
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          getMembers(1, 25, (e.target as HTMLFormElement).search.value);
        }}
        sx={{
          width: "100%",
        }}
      >
        <TextField
          id="standard-search"
          label="Search ..."
          type="search"
          variant="standard"
          name="search"
          autoComplete="off"
          sx={{
            width: "100%",
          }}
        />
      </Box>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          maxHeight: "80vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {members.length === 0 && (
          <>
            <ListItem>
              <Alert
                sx={{
                  width: "100%",
                }}
              >
                <Typography>User Not Found ...</Typography>
              </Alert>
            </ListItem>
          </>
        )}
        {members.map((member: EventAttendeeData) => {
          return (
            <>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt={
                      member?.attendee.firstName +
                      " " +
                      member?.attendee.middleName +
                      " " +
                      member?.attendee.lastName
                    }
                    src="/static/images/avatar/1.jpg"
                    sx={{
                      backgroundColor: "green",
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    member?.attendee.firstName +
                    " " +
                    member?.attendee.middleName +
                    " " +
                    member?.attendee.lastName
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{display: "inline"}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        <Chip
                          label={member?.attendee.email}
                          variant="outlined"
                        />
                        <Chip
                          label={member?.attendee.phone}
                          variant="outlined"
                        />
                      </Typography>
                    </React.Fragment>
                  }
                />
                {props.meeting?.canManage && (
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => {
                        addDocumentManager(member);
                      }}
                    >
                      <Add />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          );
        })}
      </List>
      {members.length > 0 && (
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
              getMembers(page, limit, searchKey);
            }}
          />
        </Box>
      )}

      <Drawer
        anchor={"right"}
        open={addManager}
        sx={{
          "& .MuiDrawer-paper": {width: "100%", maxWidth: "500px"},
          zIndex: 9999,
        }}
        onClose={() => {
          setAddManager(false);
        }}
      >
        <h1>Adding Attendees</h1>
      </Drawer>
    </>
  );
};
