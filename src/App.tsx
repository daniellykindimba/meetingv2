import {Authenticated, Refine} from "@refinedev/core";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import {useTranslation} from "react-i18next";
import {BrowserRouter, Link, Outlet, Route, Routes} from "react-router-dom";
import {authProvider} from "./authProvider";
import {AppIcon} from "./components/app-icon";
import {Header} from "./components/header";
import {ColorModeContextProvider} from "./contexts/color-mode";
import {gqlDataProvider} from "./api";
import {LoginPage} from "./auth/login";
import {HomeOutlined, ListOutlined, VerifiedUser} from "@mui/icons-material";
import {createTheme, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import configs from "./configs";
import {ControlMembersPage} from "./control/pages/members";
import {ControlMeetingsPage} from "./control/pages/meetings";
import {ControlHomePage} from "./control/pages";
import {ControlVenuesPage} from "./control/pages/venues";
import {Toaster} from "react-hot-toast";
import {ControlCommitteesPage} from "./control/pages/committees";
import {ControlDirectoratesPage} from "./control/pages/directorates";
import {ClientMeetingsPage} from "./client/pages/home";
import BoardMeetingsPage from "./client/pages/board_meetings";
import BoardCommitteeMeetingsPage from "./client/pages/board_committee_meetings";
import OtherMeetingsPage from "./client/pages/other_meetings";
import TrainingsPage from "./client/pages/training";
import {MeetingPage} from "./client/pages/meeting";
import {ThemeProvider} from "@emotion/react";
import { green, orange } from "@mui/material/colors";
import ManagementMeetingsPage from "./client/pages/management_meetings";
import { ResetPasswordPage } from "./auth/reset_password";


const theme = createTheme({
  palette: {
    primary: {
      main: green[900],
    },
    secondary: {
      main: green[500],
    },
  },
  typography: {
    // You can set the text color to black here
    body1: {
      color: 'black', // This sets the text color to black
    },
    allVariants: {
      color: 'black',
    },
  },
})



function App() {
  const {t, i18n} = useTranslation();
  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{html: {WebkitFontSmoothing: "auto"}}} />
          <ThemeProvider theme={theme}>
            <RefineSnackbarProvider>
              <Refine
                authProvider={authProvider}
                dataProvider={gqlDataProvider}
                notificationProvider={notificationProvider}
                i18nProvider={i18nProvider}
                routerProvider={routerBindings}
                resources={[
                  {
                    name: "home",
                    list: "/",
                    meta: {
                      icon: <HomeOutlined />,
                    },
                  },
                  {
                    name: "board-meetings",
                    list: "/board-meetings",
                  },
                  {
                    name: "Board Committee Meeting",
                    list: "/board-committees-meetings",
                  },
                  {
                    name: "Management Meetings",
                    list: "/management-meetings",
                  },
                  {
                    name: "Other Meetings",
                    list: "/other-meetings",
                  },
                  {
                    name: "Training",
                    list: "/training",
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "8SrY4D-gvXnWh-PVAfBS",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={() => <Header sticky />}
                          Title={({collapsed}) => (
                            <ThemedTitleV2
                              collapsed={collapsed}
                              text={configs.system_name}
                            />
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route path="/">
                      <Route index element={<ClientMeetingsPage />} />
                    </Route>
                    <Route path="/home">
                      <Route index element={<ClientMeetingsPage />} />
                    </Route>
                    <Route path="/board-meetings">
                      <Route index element={<BoardMeetingsPage />} />
                    </Route>
                    <Route path="/board-committees-meetings">
                      <Route index element={<BoardCommitteeMeetingsPage />} />
                    </Route>
                    <Route path="/management-meetings">
                      <Route index element={<ManagementMeetingsPage />} />
                    </Route>
                    <Route path="/other-meetings">
                      <Route index element={<OtherMeetingsPage />} />
                    </Route>
                    <Route path="/training">
                      <Route index element={<TrainingsPage />} />
                    </Route>
                    <Route path="/meeting">
                      <Route path=":id/:title" element={<MeetingPage />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>

                  <Route
                    element={
                      <Authenticated
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={() => <Header sticky />}
                          Title={({collapsed}) => (
                            <ThemedTitleV2
                              collapsed={collapsed}
                              text="Meeting-Control"
                              icon={<AppIcon />}
                            />
                          )}
                          Sider={() => (
                            <ThemedSiderV2
                              Title={({collapsed}) => (
                                <ThemedTitleV2
                                  text={configs.system_name + " Control"}
                                  collapsed={collapsed}
                                />
                              )}
                              render={() => (
                                <>
                                  <List
                                    style={{
                                      padding: 0,
                                    }}
                                  >
                                    <Link
                                      to="/control"
                                      style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                    >
                                      <ListItemButton
                                        selected={
                                          window.location.pathname ===
                                          "/control"
                                        }
                                      >
                                        <ListItemIcon>
                                          <HomeOutlined />
                                        </ListItemIcon>
                                        <ListItemText>Home</ListItemText>
                                      </ListItemButton>
                                    </Link>
                                    <Link
                                      to="/control/meetings"
                                      style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                    >
                                      <ListItemButton
                                        selected={
                                          window.location.pathname ===
                                          "/control/meetings"
                                        }
                                      >
                                        <ListItemIcon>
                                          <ListOutlined />
                                        </ListItemIcon>
                                        <ListItemText>Meetings</ListItemText>
                                      </ListItemButton>
                                    </Link>
                                    <Link
                                      to="/control/members"
                                      style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                    >
                                      <ListItemButton
                                        selected={
                                          window.location.pathname ===
                                          "/control/members"
                                        }
                                      >
                                        <ListItemIcon>
                                          <VerifiedUser />
                                        </ListItemIcon>
                                        <ListItemText>Members</ListItemText>
                                      </ListItemButton>
                                    </Link>
                                    <Link
                                      to="/control/directorates"
                                      style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                    >
                                      <ListItemButton
                                        selected={
                                          window.location.pathname ===
                                          "/control/directorates"
                                        }
                                      >
                                        <ListItemIcon>
                                          <VerifiedUser />
                                        </ListItemIcon>
                                        <ListItemText>
                                          Directorates
                                        </ListItemText>
                                      </ListItemButton>
                                    </Link>

                                    <Link
                                      to="/control/committees"
                                      style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                    >
                                      <ListItemButton
                                        selected={
                                          window.location.pathname ===
                                          "/control/committees"
                                        }
                                      >
                                        <ListItemIcon>
                                          <ListOutlined />
                                        </ListItemIcon>
                                        <ListItemText>Committees</ListItemText>
                                      </ListItemButton>
                                    </Link>

                                    <Link
                                      to="/control/venues"
                                      style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                    >
                                      <ListItemButton
                                        selected={
                                          window.location.pathname ===
                                          "/control/venues"
                                        }
                                      >
                                        <ListItemIcon>
                                          <ListOutlined />
                                        </ListItemIcon>
                                        <ListItemText>Venues</ListItemText>
                                      </ListItemButton>
                                    </Link>
                                  </List>
                                </>
                              )}
                            />
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route path="/control">
                      <Route index element={<ControlHomePage />} />
                      <Route path="members" element={<ControlMembersPage />} />
                      <Route
                        path="directorates"
                        element={<ControlDirectoratesPage />}
                      />
                      <Route
                        path="committees"
                        element={<ControlCommitteesPage />}
                      />
                      <Route
                        path="meetings"
                        element={<ControlMeetingsPage />}
                      />
                      <Route path="venues" element={<ControlVenuesPage />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>

                  <Route
                    element={
                      <Authenticated fallback={<Outlet />}>
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/register"
                      element={<AuthPage type="register" />}
                    />
                    <Route
                      path="/forgot-password"
                      element={<ResetPasswordPage />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <Toaster />
                {/* <DocumentTitleHandler /> */}
              </Refine>
            </RefineSnackbarProvider>
          </ThemeProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
