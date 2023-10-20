import {
  Delete,
  EditOutlined,
  Fingerprint,
  Lock,
  LockOpen,
  PlusOneOutlined,
  SyncAltOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
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
import {VenueData} from "../../../interfaces";
import ApiService from "../../../utils/api_services";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import {ControlVenueCreateForm} from "./forms/create_venue";
import {ControlVenueEditForm} from "./forms/edit_venue";

interface Props {
  randKey?: number;
}

export const ControlVenuesPage: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [limit, setLimit] = useState(25);
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [venues, setVenues] = useState<VenueData[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [blockDialog, setBlockDialog] = useState(false);
  const [unblockDialog, setUnblockDialog] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const handleEditDialog = (venue: VenueData) => {
    setVenue(venue);
    setEditModal(true);
  };

  const handleBlockDialog = (vanue: VenueData) => {
    setVenue(vanue);
    setBlockDialog(true);
  };

  const blockVenue = async (venue: VenueData) => {
    const {data} = await new ApiService().blockVenue(venue.id);
    if (data) {
      if (data.success) {
        setVenues(
          venues.map((v) => {
            if (v.id === venue.id) {
              v.isActive = false;
            }
            return v;
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
    setVenue(null);
    setBlockDialog(false);
  };

  const handleUnblockDialog = (vanue: VenueData) => {
    setVenue(vanue);
    setUnblockDialog(true);
  };

  const unblockVenue = async (venue: VenueData) => {
    const {data} = await new ApiService().unblockVenue(venue.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setVenues(
          venues.map((v) => {
            if (v.id === venue.id) {
              v.isActive = true;
            }
            return v;
          })
        );
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
    setVenue(null);
    setUnblockDialog(false);
  };

  const handleDeleteDialog = (venue: VenueData) => {
    setVenue(venue);
    setDeleteDialog(true);
  };

  const deleteVenue = async (venue: VenueData) => {
    const {data} = await new ApiService().deleteVenue(venue.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setVenues(venues.filter((v) => v.id !== venue.id));
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
    setVenue(null);
    setDeleteDialog(false);
  };

  const getVenues = async (page = 1, limit = 25, searchKey = "") => {
    setLoading(true);
    const {data} = await new ApiService().getVenues(page, limit, searchKey);
    if (data) {
      setTotal(data.total);
      setPage(data.page);
      setVenues(data.results);
    }
  };

  useEffect(() => {
    getVenues();
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
                  getVenues(
                    1,
                    limit,
                    (e.target as HTMLFormElement).search.value
                  );
                }}
              >
                <TextField
                  id="standard-search"
                  label="Search Members/Users"
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
                <TableCell>Capacity</TableCell>
                <TableCell>Venue Type</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Action(s)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {venues.length > 0 &&
                venues.map((venue: VenueData) => (
                  <TableRow
                    key={venue.id}
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}
                  >
                    <TableCell component="th" scope="row">
                      {venue.name}
                    </TableCell>
                    <TableCell>{venue.capacity}</TableCell>
                    <TableCell>{venue.venueType}</TableCell>
                    <TableCell>
                      {moment(venue.created).format("MMMM Do YYYY, h:mm:ss a")}
                    </TableCell>
                    <TableCell align="right">
                      <VenueMenu
                        venue={venue}
                        onDelete={handleDeleteDialog}
                        onActivate={handleUnblockDialog}
                        onDeactivate={handleBlockDialog}
                        onEdit={handleEditDialog}
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
            getVenues(page, limit, searchKey);
          }}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value));
            getVenues(page, parseInt(e.target.value), searchKey);
          }}
        />
      </Box>

      <Dialog
        open={deleteDialog}
        onClose={() => {
          setVenue(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deleting " + venue?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Venue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setVenue(null);
              setDeleteDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              deleteVenue(venue as VenueData);
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
          setVenue(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Blocking " + venue?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Block this Venue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setVenue(null);
              setBlockDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              blockVenue(venue as VenueData);
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
          setVenue(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Unblocking " + venue?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Unblock this Venue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setVenue(null);
              setUnblockDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              unblockVenue(venue as VenueData);
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
            width: "40vw",
            bgcolor: "background.paper",
            border: "2px solid green",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create New Venue
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
          <ControlVenueCreateForm
            onFinish={(venue: VenueData) => {
              setVenues([venue, ...venues]);
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
            Edit/Update Venue
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
          <ControlVenueEditForm
            venue={venue}
            onFinish={(venue: VenueData) => {
              setVenues(
                venues.map((v) => {
                  if (v.id === venue.id) {
                    v = venue;
                  }
                  return v;
                })
              );
              setEditModal(false);
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

interface MenuProps {
  randKey?: number;
  venue?: VenueData | any;
  onDelete?: any;
  onEdit?: any;
  onActivate?: any;
  onDeactivate?: any;
}

const VenueMenu: React.FC<MenuProps> = (props: MenuProps) => {
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
            props.onDelete(props.venue);
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
            props.onEdit(props.venue);
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
            if (props.venue.isActive) {
              props.onDeactivate(props.venue);
            } else {
              props.onActivate(props.venue);
            }
            handleClose();
          }}
        >
          {props.venue.isActive ? (
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
