import {
  Delete,
  EditOutlined,
  ListOutlined,
  Lock,
  LockOpen,
  PlusOneOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {EventData as MeetingData} from "../../../interfaces";
import ApiService from "../../../utils/api_services";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import {ControlDirectorateCreateForm} from "../directorates/forms/create_directorate";
import {ControlMeetingEditForm} from "./forms/edit_meeting";
import {MeetingAttendeesList} from "./components/meeting_attendees_list";
import {MeetingCommitteesList} from "./components/meeting_committees_list";

interface Props {
  randKey?: number;
}

export const ControlMeetingsPage: React.FC<Props> = (props: Props) => {
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
  const [committeesModal, setCommitteesModal] = useState(false);

  const handleCommitteesModal = (meeting: MeetingData) => {
    setMeeting(meeting);
    setCommitteesModal(true);
  };

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
    const {data} = await new ApiService().getMeetings(page, limit, searchKey);
    if (data) {
      setTotal(data.total);
      setPage(data.page);
      setMeetings(data.results);
    }
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
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<PlusOneOutlined />}
              size="small"
              onClick={() => setAddModal(true)}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <TableContainer component={Paper} sx={{maxHeight: "78vh"}}>
          <Table stickyHeader sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Venue Name</TableCell>
                <TableCell>Start Time - End Time</TableCell>
                <TableCell>Venue</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Action(s)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meetings.length > 0 &&
                meetings.map((meeting: MeetingData) => (
                  <TableRow
                    key={meeting.id}
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}
                  >
                    <TableCell component="th" scope="row">
                      {meeting.title}
                    </TableCell>
                    <TableCell>
                      {moment(meeting.startTime).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}{" "}
                      -{" "}
                      {moment(meeting.endTime).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </TableCell>
                    <TableCell>{meeting.venue.name}</TableCell>
                    <TableCell>
                      {meeting.author?.firstName} {meeting.author?.middleName}{" "}
                      {meeting.author?.lastName}
                    </TableCell>
                    <TableCell>
                      {meeting.isActive ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : (
                        <Chip label="Inactive" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {moment(meeting.created).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <MeetingMenu
                        meeting={meeting}
                        onDelete={handleDeleteDialog}
                        onActivate={handleUnblockDialog}
                        onDeactivate={handleBlockDialog}
                        onEdit={handleEditDialog}
                        onAttendees={handleMeetingAttendeeModal}
                        onCommittees={handleCommitteesModal}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={limit}
          page={page}
          onPageChange={(e, page) => {
            getMeetings(page, limit, searchKey);
          }}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value));
            getMeetings(page, parseInt(e.target.value), searchKey);
          }}
        />
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
          <ControlDirectorateCreateForm
            onFinish={(meeting: MeetingData) => {
              setMeetings([meeting, ...meetings]);
              setAddModal(false);
            }}
          />
        </Box>
      </Modal>

      <Modal
        open={editModal}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setEditModal(false);
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
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setAttendeesModal(false);
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

      <Modal
        open={committeesModal}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setCommitteesModal(false);
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
            width: "50vw",
            bgcolor: "background.paper",
            border: "2px solid green",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {meeting?.title} Committees
            {/* define a close button */}
            <IconButton
              aria-label="fingerprint"
              sx={{
                position: "absolute",
                right: 10,
                top: 5,
                color: "red",
              }}
              onClick={() => setCommitteesModal(false)}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
          <MeetingCommitteesList meeting={meeting} />
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
  onCommittees?: any;
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
            props.onCommittees(props.meeting);
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
