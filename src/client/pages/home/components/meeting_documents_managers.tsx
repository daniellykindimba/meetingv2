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
import {EventAttendeeData, EventData} from "../../../../interfaces";
import {Close} from "@mui/icons-material";
import {NotMeetingDocumentsManagers} from "./not_meeting_documents_manager";
import toast from "react-hot-toast";

interface Props {
  randKey?: number;
  onFinish?: any;
  meeting?: EventData | any;
}

export const MeetingDocumentsManagers: React.FC<Props> = (props: Props) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchKey, setSearchKey] = useState("");
  const [members, setMembers] = useState<EventAttendeeData[]>([]);
  const [member, setMember] = useState<EventAttendeeData | null>(null);
  const [addManager, setAddManager] = React.useState(false);

  const removeDocumentManager = async (attendee: EventAttendeeData) => {
    const {data} = await new ApiService().removeDocumentManager(attendee.id);
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
    const {data} = await new ApiService().getEventDocumentsManagers(
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="outlined" onClick={() => setAddManager(true)}>
          Add Manager
        </Button>
      </Box>
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
          label="Search Users ..."
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
                    <IconButton onClick={() => removeDocumentManager(member)}>
                      <Close />
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
            Adding Documents Managers
            {/* define a close button */}
            <IconButton
              aria-label="fingerprint"
              sx={{
                position: "absolute",
                right: 10,
                top: 5,
                color: "red",
              }}
              onClick={() => setAddManager(false)}
            >
              <Close />
            </IconButton>
          </Typography>
          <NotMeetingDocumentsManagers
            meeting={props.meeting}
            onFinish={(manager: EventAttendeeData) =>
              setMembers([manager, ...members])
            }
          />
        </Box>
      </Drawer>
    </>
  );
};
