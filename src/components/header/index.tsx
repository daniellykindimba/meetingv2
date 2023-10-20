import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {useGetIdentity, useLogout, useNavigation} from "@refinedev/core";
import {HamburgerMenu, RefineThemedLayoutV2HeaderProps} from "@refinedev/mui";
import React, {useContext, useEffect} from "react";
import {ColorModeContext} from "../../contexts/color-mode";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import {LogoutOutlined} from "@mui/icons-material";
import GridViewIcon from "@mui/icons-material/GridView";

type IUser = {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  middleName: string;
  lastName: string;
  isStaff: string;
  isAdmin: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const {push} = useNavigation();
  const {mode, setMode} = useContext(ColorModeContext);
  const {data: user} = useGetIdentity<IUser>();
  const {mutate: logout} = useLogout();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <AppBar position={sticky ? "sticky" : "relative"}>
      <Toolbar>
        <Stack direction="row" width="100%" alignItems="center">
          <HamburgerMenu />
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
            gap="16px"
          >
            {user?.id && (
              <Stack
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
              >
                {user?.id && (
                  <Typography
                    sx={{
                      display: {
                        xs: "none",
                        sm: "inline-block",
                      },
                    }}
                    variant="subtitle2"
                  >
                    {user?.firstName +
                      " " +
                      user?.middleName +
                      " " +
                      user?.lastName}
                  </Typography>
                )}
                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                  <Avatar
                    src={user?.avatar}
                    alt={
                      user?.firstName +
                      " " +
                      user?.middleName +
                      " " +
                      user?.lastName
                    }
                  />
                </IconButton>
              </Stack>
            )}

            <Menu
              sx={{mt: "45px"}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                key={"profile"}
                onClick={() => {
                  push("/profile");
                }}
                dense={true}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              {user?.isAdmin && (
                <MenuItem
                  key={"controlPanel"}
                  onClick={() => {
                    push("/control");
                  }}
                >
                  <ListItemIcon>
                    <GridViewIcon />
                  </ListItemIcon>
                  <ListItemText>Control Panel</ListItemText>
                </MenuItem>
              )}
              <MenuItem
                key={"settings"}
                onClick={() => {
                  push("/settings");
                }}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem key={"logout"} onClick={() => logout()}>
                <ListItemIcon>
                  <LogoutOutlined />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
