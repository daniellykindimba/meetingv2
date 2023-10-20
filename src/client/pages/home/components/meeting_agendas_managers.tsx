import {
    Alert,
    Avatar,
    Box,
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
  import {EventData, UserData} from "../../../../interfaces";
  import {Add} from "@mui/icons-material";
  import {get} from "http";
  
  interface Props {
    randKey?: number;
    onFinish?: any;
    meeting?: EventData | any;
  }
  
  export const MeetingAgendasManagers: React.FC<Props> = (props: Props) => {
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [searchKey, setSearchKey] = useState("");
    const [members, setMembers] = useState<UserData[]>([]);
    const [member, setMember] = useState<UserData | null>(null);
    const [addAttendee, setAddAttendee] = React.useState(false);
  
    const addingAttendee = async (attendee_id: number) => {
      const {data} = await new ApiService().addMeetingAttendee(
        props.meeting.id,
        attendee_id
      );
      if (data) {
        if (data.success) {
          toast.success(data.message, {
            position: "bottom-left",
          });
          setMembers(
            members.filter((member: UserData) => member.id !== attendee_id)
          );
          props.onFinish(data.eventAttendee);
          if (
            members.filter((member: UserData) => member.id !== attendee_id)
              .length === 0
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
      const {data} = await new ApiService().getEventAttendeesToAdd(
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
            label="Search Users To Add ..."
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
          {members.map((member: UserData) => {
            return (
              <>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt={
                        member?.firstName +
                        " " +
                        member?.middleName +
                        " " +
                        member?.lastName
                      }
                      src="/static/images/avatar/1.jpg"
                      sx={{
                        backgroundColor: "green",
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      member?.firstName +
                      " " +
                      member?.middleName +
                      " " +
                      member?.lastName
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{display: "inline"}}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          <Chip label={member?.email} variant="outlined" />
                          <Chip label={member?.phone} variant="outlined" />
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  {props.meeting?.canManage && (
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => {
                          addingAttendee(member.id);
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
          open={addAttendee}
          sx={{
            "& .MuiDrawer-paper": {width: "100%", maxWidth: "500px"},
            zIndex: 9999,
          }}
          onClose={() => {
            setAddAttendee(false);
          }}
        >
          <h1>Adding Attendees</h1>
        </Drawer>
      </>
    );
  };
  