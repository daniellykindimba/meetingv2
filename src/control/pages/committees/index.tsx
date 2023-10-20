import {
  Delete,
  EditOutlined,
  Lock,
  LockOpen,
  PlusOneOutlined,
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
import {CommitteeData} from "../../../interfaces";
import ApiService from "../../../utils/api_services";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import {ControlCommitteeCreateForm} from "./forms/create_committee";
import {ControlCommitteeEditForm} from "./forms/edit_committee";

interface Props {
  randKey?: number;
}

export const ControlCommitteesPage: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [limit, setLimit] = useState(25);
  const [committee, setCommittee] = useState<CommitteeData | null>(null);
  const [committees, setCommittees] = useState<CommitteeData[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [blockDialog, setBlockDialog] = useState(false);
  const [unblockDialog, setUnblockDialog] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const handleEditDialog = (committee: CommitteeData) => {
    setCommittee(committee);
    setEditModal(true);
  };

  const handleBlockDialog = (committee: CommitteeData) => {
    setCommittee(committee);
    setBlockDialog(true);
  };

  const blockCommittee = async (committee: CommitteeData) => {
    const {data} = await new ApiService().blockCommittee(committee.id);
    if (data) {
      if (data.success) {
        setCommittees(
          committees.map((c) => {
            if (c.id === committee.id) {
              c.isActive = false;
            }
            return c;
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
    setCommittee(null);
    setBlockDialog(false);
  };

  const handleUnblockDialog = (committee: CommitteeData) => {
    setCommittee(committee);
    setUnblockDialog(true);
  };

  const unblockCommittee = async (committee: CommitteeData) => {
    const {data} = await new ApiService().unblockCommittee(committee.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setCommittees(
          committees.map((c) => {
            if (c.id === committee.id) {
              c.isActive = true;
            }
            return c;
          })
        );
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
    setCommittee(null);
    setUnblockDialog(false);
  };

  const handleDeleteDialog = (committee: CommitteeData) => {
    setCommittee(committee);
    setDeleteDialog(true);
  };

  const deleteCommittee = async (committee: CommitteeData) => {
    const {data} = await new ApiService().deleteCommittee(committee.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setCommittees(committees.filter((c) => c.id !== committee.id));
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
    setCommittee(null);
    setDeleteDialog(false);
  };

  const getCommittees = async (page = 1, limit = 25, searchKey = "") => {
    setLoading(true);
    const {data} = await new ApiService().getCommittees(page, limit, searchKey);
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
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Container>
              <Box
                component={"form"}
                onSubmit={(e) => {
                  e.preventDefault();
                  getCommittees(
                    1,
                    limit,
                    (e.target as HTMLFormElement).search.value
                  );
                }}
              >
                <TextField
                  id="standard-search"
                  label="Search Committees"
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
                <TableCell>Created</TableCell>
                <TableCell align="right">Action(s)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {committees.length > 0 &&
                committees.map((committee: CommitteeData) => (
                  <TableRow
                    key={committee.id}
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}
                  >
                    <TableCell component="th" scope="row">
                      {committee.name}
                    </TableCell>
                    <TableCell>
                      {moment(committee.created).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <CommitteeMenu
                        committee={committee}
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
            getCommittees(page, limit, searchKey);
          }}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value));
            getCommittees(page, parseInt(e.target.value), searchKey);
          }}
        />
      </Box>

      <Dialog
        open={deleteDialog}
        onClose={() => {
          setCommittee(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deleting " + committee?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Committee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCommittee(null);
              setDeleteDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              deleteCommittee(committee as CommitteeData);
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
          setCommittee(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Blocking " + committee?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Block this Committee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCommittee(null);
              setBlockDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              blockCommittee(committee as CommitteeData);
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
          setCommittee(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Unblocking " + committee?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Unblock this Committee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCommittee(null);
              setUnblockDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              unblockCommittee(committee as CommitteeData);
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
            Create New Committee
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
          <ControlCommitteeCreateForm
            onFinish={(committee: CommitteeData) => {
              setCommittees([committee, ...committees]);
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
            Edit/Update Committee
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
          <ControlCommitteeEditForm
            committee={committee}
            onFinish={(committee: CommitteeData) => {
              setCommittees(
                committees.map((c) => {
                  if (c.id === committee.id) {
                    c = committee;
                  }
                  return c;
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
  committee?: CommitteeData | any;
  onDelete?: any;
  onEdit?: any;
  onActivate?: any;
  onDeactivate?: any;
}

const CommitteeMenu: React.FC<MenuProps> = (props: MenuProps) => {
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
            props.onDelete(props.committee);
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
            props.onEdit(props.committee);
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
            if (props.committee.isActive) {
              props.onDeactivate(props.committee);
            } else {
              props.onActivate(props.committee);
            }
            handleClose();
          }}
        >
          {props.committee.isActive ? (
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
