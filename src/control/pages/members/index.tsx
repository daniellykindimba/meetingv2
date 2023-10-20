import {
  Delete,
  EditOutlined,
  KeySharp,
  Lock,
  LockOpen,
  PlusOneOutlined,
  SyncAltOutlined,
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
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {UserData} from "../../../interfaces";
import ApiService from "../../../utils/api_services";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {toast} from "react-hot-toast";

interface Props {
  randKey?: number;
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return {name, calories, fat, carbs, protein};
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export const ControlMembersPage: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [limit, setLimit] = useState(25);
  const [member, setMember] = useState<UserData | null>(null);
  const [members, setMembers] = useState<UserData[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [createUserCredentialsDialog, setCreateUserCredentialsDialog] =
    useState<boolean>(false);

  const [blockUserDialog, setBlockUserDialog] = useState<boolean>(false);
  const [unblockUserDialog, setUnblockUserDialog] = useState<boolean>(false);

  const handleBlockDialog = (member: UserData) => {
    setMember(member);
    setBlockUserDialog(true);
  };

  const handleUnblockDialog = (member: UserData) => {
    setMember(member);
    setUnblockUserDialog(true);
  };

  const handleDeleteDialog = (member: UserData) => {
    setMember(member);
    setDeleteDialog(true);
  };

  const blockUser = async (member: UserData) => {
    const {data} = await new ApiService().blockUser(member.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setMembers(
          members.map((m) => {
            if (m.id === member.id) {
              m.isActive = false;
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
  };

  const unblockUser = async (member: UserData) => {
    const {data} = await new ApiService().UnblockUser(member.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setMembers(
          members.map((m) => {
            if (m.id === member.id) {
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
  };

  const deleteUser = async (member: UserData) => {
    const {data} = await new ApiService().deleteUser(member.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
        setMembers(members.filter((m) => m.id !== member.id));
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
    setMember(null);
    setDeleteDialog(false);
  };

  const getUsers = async (page = 1, limit = 25, searchKey = "") => {
    setLoading(true);
    const {data} = await new ApiService().getUsers(page, limit, searchKey);
    if (data) {
      setTotal(data.total);
      setPage(data.page);
      setMembers(data.results);
    }
  };

  const handleCreateUserCredentialsDialog = (member: UserData) => {
    setMember(member);
    setCreateUserCredentialsDialog(true);
  };

  const createUserCredentials = async (member: UserData) => {
    const {data} = await new ApiService().createUserCredentials(member.id);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
        });
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    }
  };

  useEffect(() => {
    getUsers();
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
                  getUsers(
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
              startIcon={<SyncAltOutlined />}
              size="small"
            >
              Sync
            </Button>
            <Button
              variant="outlined"
              startIcon={<PlusOneOutlined />}
              size="small"
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
                <TableCell>First Name</TableCell>
                <TableCell>Middle Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action(s)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.length > 0 &&
                members.map((member: UserData) => (
                  <TableRow
                    key={member.id}
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}
                  >
                    <TableCell component="th" scope="row">
                      {member.firstName}
                    </TableCell>
                    <TableCell>{member.middleName}</TableCell>
                    <TableCell>{member.lastName}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>
                      {member.isActive ? (
                        <Chip
                          label="Active"
                          variant="outlined"
                          color="success"
                        />
                      ) : (
                        <Chip
                          label="Inactive"
                          variant="outlined"
                          color="error"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <UserMenu
                        member={member}
                        onDelete={handleDeleteDialog}
                        onResetPassword={(m: UserData) =>
                          handleCreateUserCredentialsDialog(m)
                        }
                        onActivate={(m: UserData) => handleUnblockDialog(m)}
                        onDeactivate={(m: UserData) => handleBlockDialog(m)}
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
            getUsers(page, limit, searchKey);
          }}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value));
            getUsers(page, parseInt(e.target.value), searchKey);
          }}
        />
      </Box>

      <Dialog
        open={deleteDialog}
        onClose={() => {
          setMember(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deleting " +
            member?.firstName +
            " " +
            member?.middleName +
            " " +
            member?.lastName +
            " ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this member/user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMember(null);
              setDeleteDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              deleteUser(member as UserData);
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={createUserCredentialsDialog}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setCreateUserCredentialsDialog(false);
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Creating Credentials for " +
            member?.firstName +
            " " +
            member?.middleName +
            " " +
            member?.lastName +
            " ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to create credentials for this member/user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateUserCredentialsDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              createUserCredentials(member as UserData);
              setCreateUserCredentialsDialog(false);
            }}
            autoFocus
          >
            Create/Reset
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={blockUserDialog}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setBlockUserDialog(false);
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Blocking " +
            member?.firstName +
            " " +
            member?.middleName +
            " " +
            member?.lastName +
            " ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to create Block this member/user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockUserDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              blockUser(member as UserData);
              setBlockUserDialog(false);
            }}
            autoFocus
          >
            Block
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={unblockUserDialog}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setUnblockUserDialog(false);
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Unblocking " +
            member?.firstName +
            " " +
            member?.middleName +
            " " +
            member?.lastName +
            " ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to create Unblocking this member/user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnblockUserDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              unblockUser(member as UserData);
              setUnblockUserDialog(false);
            }}
            autoFocus
          >
            Unblock
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface MenuProps {
  randKey?: number;
  member?: UserData | any;
  onDelete?: any;
  onEdit?: any;
  onActivate?: any;
  onDeactivate?: any;
  onResetPassword?: any;
}

const UserMenu: React.FC<MenuProps> = (props: MenuProps) => {
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
            props.onDelete(props.member);
            handleClose();
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {props.member.isActive ? (
          <MenuItem
            onClick={() => {
              props.onDeactivate(props.member);
              handleClose();
            }}
          >
            <ListItemIcon>
              <Lock fontSize="small" />
            </ListItemIcon>
            <ListItemText>Deactivate</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              props.onActivate(props.member);
              handleClose();
            }}
          >
            <ListItemIcon>
              <LockOpen fontSize="small" />
            </ListItemIcon>
            <ListItemText>Activate</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            props.onResetPassword(props.member);
            handleClose();
          }}
        >
          <ListItemIcon>
            <KeySharp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reset Password</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
