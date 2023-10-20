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
import {DepartmentData} from "../../../interfaces";
import ApiService from "../../../utils/api_services";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import {ControlDirectorateCreateForm} from "./forms/create_directorate";
import {ControlDirectorateEditForm} from "./forms/edit_directorate";

interface Props {
  randKey?: number;
}

export const ControlDirectoratesPage: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [limit, setLimit] = useState(25);
  const [directorate, setDirectorate] = useState<DepartmentData | null>(null);
  const [directorates, setDirectorates] = useState<DepartmentData[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [blockDialog, setBlockDialog] = useState(false);
  const [unblockDialog, setUnblockDialog] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const handleEditDialog = (directorate: DepartmentData) => {
    setDirectorate(directorate);
    setEditModal(true);
  };

  const handleBlockDialog = (directorate: DepartmentData) => {
    setDirectorate(directorate);
    setBlockDialog(true);
  };

  const blockDirectorate = async (directorate: DepartmentData) => {
    const {data} = await new ApiService().blockDirectorate(directorate.id);
    if (data) {
      if (data.success) {
        setDirectorates(
          directorates.map((d) => {
            if (d.id === directorate.id) {
              d.isActive = false;
            }
            return d;
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
    setDirectorate(null);
    setBlockDialog(false);
  };

  const handleUnblockDialog = (directorate: DepartmentData) => {
    setDirectorate(directorate);
    setUnblockDialog(true);
  };

  const unblockDirectorate = async (directorate: DepartmentData) => {
    const {data} = await new ApiService().unblockDirectorate(directorate.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setDirectorates(
          directorates.map((d) => {
            if (d.id === directorate.id) {
              d.isActive = true;
            }
            return d;
          })
        );
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
    setDirectorate(null);
    setUnblockDialog(false);
  };

  const handleDeleteDialog = (directorate: DepartmentData) => {
    setDirectorate(directorate);
    setDeleteDialog(true);
  };

  const deleteDirectorate = async (directorate: DepartmentData) => {
    const {data} = await new ApiService().deleteDirectorate(directorate.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setDirectorates(directorates.filter((d) => d.id !== directorate.id));
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
    setDirectorate(null);
    setDeleteDialog(false);
  };

  const getDirecorates = async (page = 1, limit = 25, searchKey = "") => {
    setLoading(true);
    const {data} = await new ApiService().getDirectorates(
      page,
      limit,
      searchKey
    );
    if (data) {
      setTotal(data.total);
      setPage(data.page);
      setDirectorates(data.results);
    }
  };

  useEffect(() => {
    getDirecorates();
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
                  getDirecorates(
                    1,
                    limit,
                    (e.target as HTMLFormElement).search.value
                  );
                }}
              >
                <TextField
                  id="standard-search"
                  label="Search Directorates ..."
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
              {directorates.length > 0 &&
                directorates.map((directorate: DepartmentData) => (
                  <TableRow
                    key={directorate.id}
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}
                  >
                    <TableCell component="th" scope="row">
                      {directorate.name}
                    </TableCell>
                    <TableCell>
                      {moment(directorate.created).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <DirectorateMenu
                        directorate={directorate}
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
            getDirecorates(page, limit, searchKey);
          }}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value));
            getDirecorates(page, parseInt(e.target.value), searchKey);
          }}
        />
      </Box>

      <Dialog
        open={deleteDialog}
        onClose={() => {
          setDirectorate(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deleting " + directorate?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Diretorate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDirectorate(null);
              setDeleteDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              deleteDirectorate(directorate as DepartmentData);
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
          setDirectorate(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Blocking " + directorate?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Block this Directorate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDirectorate(null);
              setBlockDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              blockDirectorate(directorate as DepartmentData);
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
          setDirectorate(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Unblocking " + directorate?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Unblock this Directorate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDirectorate(null);
              setUnblockDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              unblockDirectorate(directorate as DepartmentData);
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
          <ControlDirectorateCreateForm
            onFinish={(directorate: DepartmentData) => {
              setDirectorates([directorate, ...directorates]);
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
          <ControlDirectorateEditForm
            directorate={directorate}
            onFinish={(directorate: DepartmentData) => {
              setDirectorates(
                directorates.map((d) => {
                  if (d.id === directorate.id) {
                    d = directorate;
                  }
                  return d;
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
  directorate?: DepartmentData | any;
  onDelete?: any;
  onEdit?: any;
  onActivate?: any;
  onDeactivate?: any;
}

const DirectorateMenu: React.FC<MenuProps> = (props: MenuProps) => {
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
            props.onDelete(props.directorate);
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
            props.onEdit(props.directorate);
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
            if (props.directorate.isActive) {
              props.onDeactivate(props.directorate);
            } else {
              props.onActivate(props.directorate);
            }
            handleClose();
          }}
        >
          {props.directorate.isActive ? (
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
