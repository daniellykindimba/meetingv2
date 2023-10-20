import {
  Delete,
  DeleteForever,
  EditOutlined,
  ListOutlined,
  Lock,
  LockOpen,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {EventData as MeetingData, UserData} from "../../../interfaces";
import ApiService from "../../../utils/api_services";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import {ControlMeetingEditForm} from "./forms/edit_meeting";
import {MeetingAttendeesList} from "./components/meeting_attendees_list";
import {ControlMeetingCreateForm} from "./forms/create_meeting";
import {Link} from "react-router-dom";

function randomColor() {
  const hex = Math.floor(Math.random() * 0xffffff);
  const color = "#" + hex.toString(16);

  return color;
}

interface Props {
  randKey?: number;
}

export const ClientMeetingsPage: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [limit, setLimit] = useState(25);
  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [meetings, setMeetings] = useState<MeetingData[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [blockDialog, setBlockDialog] = useState(false);
  const [unblockDialog, setUnblockDialog] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [attendeesModal, setAttendeesModal] = useState(false);

  const handleMeetingAttendeeModal = (meeting: MeetingData) => {
    setMeeting(meeting);
    setAttendeesModal(true);
  };

  const handleEditDialog = (meeting: MeetingData) => {
    setMeeting(meeting);
    setEditModal(true);
  };

  const handleBlockDialog = (meeting: MeetingData) => {
    setMeeting(meeting);
    setBlockDialog(true);
  };

  const blockMeeting = async (meeting: MeetingData) => {
    const {data} = await new ApiService().blockMeeting(meeting.id);
    if (data) {
      if (data.success) {
        setMeetings(
          meetings.map((m) => {
            if (m.id === meeting.id) {
              m.isActive = false;
            }
            return m;
          })
        );
        toast.success(data.message, {
          position: "top-center",
        });
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
    setMeeting(null);
    setBlockDialog(false);
  };

  const handleUnblockDialog = (meeting: MeetingData) => {
    setMeeting(meeting);
    setUnblockDialog(true);
  };

  const unblockMeeting = async (meeting: MeetingData) => {
    const {data} = await new ApiService().unblockMeeting(meeting.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setMeetings(
          meetings.map((m) => {
            if (m.id === meeting.id) {
              m.isActive = true;
            }
            return m;
          })
        );
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
    setMeeting(null);
    setUnblockDialog(false);
  };

  const handleDeleteDialog = (meeting: MeetingData) => {
    setMeeting(meeting);
    setDeleteDialog(true);
  };

  const deleteMeeting = async (meeting: MeetingData) => {
    const {data} = await new ApiService().deleteMeeting(meeting.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setMeetings(meetings.filter((m) => m.id !== meeting.id));
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
    setMeeting(null);
    setDeleteDialog(false);
  };

  const getMeetings = async (page = 1, limit = 25, searchKey = "") => {
    setLoading(true);
    const {data} = await new ApiService().getMyTodaysEvents(
      page,
      limit,
      searchKey
    );
    if (data) {
      setTotal(data.total);
      setPage(data.page);
      setMeetings(data.results);
    }
    setLoading(false);
  };

  useEffect(() => {
    getMeetings();
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
                  getMeetings(
                    1,
                    limit,
                    (e.target as HTMLFormElement).search.value
                  );
                }}
              >
                <TextField
                  id="standard-search"
                  label="Search Meetings ..."
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
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                }}
                onClick={() => setAddModal(true)}
              >
                Create New Meeting
              </Button>
            </Container>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          mt: 2,
        }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        )}

        <List sx={{width: "100%", bgcolor: "background.paper"}}>
          {!loading && meetings.length === 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Alert
                  severity="info"
                  sx={{
                    width: {
                      xs: "100vw",
                      sm: "30vw",
                      xl: "30vw",
                    },
                  }}
                >
                  <Typography variant="h6">
                    No Meetings Found, happening Today, perhaps you may wish to
                    other meeting that will happen
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 2,
                    }}
                  >
                    View All Time Meetings
                  </Button>
                </Alert>
              </Box>
            </>
          )}
          {meetings.map((meeting: MeetingData) => (
            <>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <>
                    <Button
                      variant="outlined"
                      component={Link}
                      to={"/meeting/" + meeting.id + "/" + meeting.title}
                    >
                      Open
                    </Button>
                    {meeting.canDelete && (
                      <Button
                        variant="outlined"
                        onClick={() => handleDeleteDialog(meeting)}
                      >
                        <DeleteForever />
                      </Button>
                    )}
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt={meeting.title}
                    src="/static/images/avatar/1.jpg"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Link
                      to={"/meeting/" + meeting.id + "/" + meeting.title}
                      style={{
                        textDecoration: "none",
                        textTransform: "none",
                        color: "inherit",
                      }}
                    >
                      <Typography component="h5" variant="h5">
                        {meeting.title}
                      </Typography>
                    </Link>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{display: "block", fontSize: 18}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Time:
                        {moment(meeting.startTime).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}{" "}
                        -{" "}
                        {moment(meeting.endTime).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </Typography>
                      <Typography
                        sx={{display: "block", fontSize: 18}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Venue: {meeting.venue.name}
                      </Typography>
                      {meeting.attendees.length > 0 && (
                        <Stack
                          direction="row"
                          spacing={-0.5}
                          sx={{
                            mt: 1,
                          }}
                        >
                          <AvatarGroup max={10}>
                            {meeting.attendees.map((at: UserData) => (
                              <Tooltip
                                title={
                                  at.firstName +
                                  " " +
                                  at.middleName +
                                  " " +
                                  at.lastName
                                }
                                placement="top"
                                arrow
                              >
                                <Avatar
                                  sx={{
                                    backgroundColor: randomColor(),
                                    width: 56,
                                    height: 56,
                                  }}
                                  alt={
                                    at.firstName +
                                    " " +
                                    at.middleName +
                                    " " +
                                    at.lastName
                                  }
                                  src="/static/images/avatar/1.jpg"
                                />
                              </Tooltip>
                            ))}
                          </AvatarGroup>
                        </Stack>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          ))}
        </List>
      </Box>

      <Dialog
        open={deleteDialog}
        onClose={() => {
          setMeeting(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deleting " + meeting?.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Meeting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMeeting(null);
              setDeleteDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              deleteMeeting(meeting as MeetingData);
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={blockDialog}
        onClose={() => {
          setMeeting(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Blocking " + meeting?.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Block this Meeting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMeeting(null);
              setBlockDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              blockMeeting(meeting as MeetingData);
            }}
            autoFocus
          >
            Block
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={unblockDialog}
        onClose={() => {
          setMeeting(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Unblocking " + meeting?.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Unblock this Meeting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMeeting(null);
              setUnblockDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              unblockMeeting(meeting as MeetingData);
            }}
            autoFocus
          >
            Unblock
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "100vw",
              sm: "100vw",
              lg: "40vw",
              xl: "40vw",
            },
            bgcolor: "background.paper",
            border: "2px solid green",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create New Meeting
            {/* define a close button */}
            <IconButton
              aria-label="fingerprint"
              sx={{
                position: "absolute",
                right: 10,
                top: 5,
                color: "red",
              }}
              onClick={() => setAddModal(false)}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
          <ControlMeetingCreateForm
            onFinish={(meeting: MeetingData) => {
              console.log(meeting);
              setMeetings([meeting, ...meetings]);
              setAddModal(false);
            }}
          />
        </Box>
      </Modal>

      <Modal
        open={editModal}
        onClose={() => setAddModal(false)}
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
            Edit/Update Meeting
            {/* define a close button */}
            <IconButton
              aria-label="fingerprint"
              sx={{
                position: "absolute",
                right: 10,
                top: 5,
                color: "red",
              }}
              onClick={() => setEditModal(false)}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
          <ControlMeetingEditForm
            meeting={meeting}
            onFinish={(meeting: MeetingData) => {
              setMeetings(
                meetings.map((m) => {
                  if (m.id === meeting.id) {
                    m = meeting;
                  }
                  return m;
                })
              );
              setEditModal(false);
            }}
          />
        </Box>
      </Modal>

      <Modal
        open={attendeesModal}
        onClose={() => setAddModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50vw",
            bgcolor: "background.paper",
            border: "2px solid green",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {meeting?.title} Attendees
            {/* define a close button */}
            <IconButton
              aria-label="fingerprint"
              sx={{
                position: "absolute",
                right: 10,
                top: 5,
                color: "red",
              }}
              onClick={() => setAttendeesModal(false)}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
          <MeetingAttendeesList meeting={meeting} />
        </Box>
      </Modal>
    </>
  );
};

interface MenuProps {
  randKey?: number;
  meeting?: MeetingData | any;
  onDelete?: any;
  onEdit?: any;
  onActivate?: any;
  onDeactivate?: any;
  onAttendees?: any;
}

const MeetingMenu: React.FC<MenuProps> = (props: MenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="member-button-{props.member.id}"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <Menu
        id="member-menu-{props.member.id}"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "member-button-{props.member.id}",
        }}
      >
        <MenuItem
          onClick={() => {
            props.onAttendees(props.meeting);
            handleClose();
          }}
        >
          <ListItemIcon>
            <ListOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Attendees</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onDelete(props.meeting);
            handleClose();
          }}
        >
          <ListItemIcon>
            <ListOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Committees</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onDelete(props.meeting);
            handleClose();
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onEdit(props.meeting);
            handleClose();
          }}
        >
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (props.meeting.isActive) {
              props.onDeactivate(props.meeting);
            } else {
              props.onActivate(props.meeting);
            }
            handleClose();
          }}
        >
          {props.meeting.isActive ? (
            <>
              <ListItemIcon>
                <Lock fontSize="small" />
              </ListItemIcon>
              <ListItemText>Deactivate</ListItemText>
            </>
          ) : (
            <>
              <ListItemIcon>
                <LockOpen fontSize="small" />
              </ListItemIcon>
              <ListItemText>Activate</ListItemText>
            </>
          )}
        </MenuItem>
      </Menu>
    </div>
  );
};
