import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  DepartmentData,
  EventData,
  EventDocumentData,
} from "../../../../interfaces";
import {useEffect, useState} from "react";
import ApiService from "../../../../utils/api_services";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Button,
  Modal,
  IconButton,
  Drawer,
  Grid,
  Card,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Badge,
  BadgeProps,
  styled,
} from "@mui/material";
import {Close, Delete, Save, UploadFileOutlined} from "@mui/icons-material";
import {UploadingMeetingDocumentForm} from "../forms/upload_meeting_document_form";
import {CKEditorComponent} from "../../../../components/editor";
import {toast} from "react-hot-toast";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{
        width: "100%",
      }}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface Props {
  randKey?: number;
  meeting?: EventData | any;
}

export const MeetingDocumentsComponent: React.FC<Props> = (props: Props) => {
  const [value, setValue] = useState(0);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [documents, setDocuments] = useState<EventDocumentData[]>([]);
  const [document, setDocument] = useState<EventDocumentData>();
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const [readDocumentModal, setReadDocumentModal] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const handleDocumentReaderModal = (document: EventDocumentData) => {
    setDocument(document);
    setReadDocumentModal(true);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue);
    setValue(newValue);
  };

  const getDepartments = async () => {
    const {data} = await new ApiService().getDirectorates();
    if (data) {
      setDepartments(data.results);
    }
  };

  const getDocuments = async () => {
    const {data} = await new ApiService().getMeeteingDocuments(
      props.meeting?.id
    );
    if (data) {
      setDocuments(data.results);
    }
  };

  const createDocumentNote = async () => {
    const {data} = await new ApiService().createDocumentUserNote(
      document?.id ?? 0,
      note
    );
    if (data) {
      if (data.success) {
        toast.success("Note saved successfully", {
          duration: 4000,
          position: "top-center",
        });
        setDocuments(
          documents.map((d) => {
            if (d.id === data.eventDocumentNote.eventDocument.id) {
              return data.eventDocumentNote.eventDocument;
            }
            return d;
          })
        );
      } else {
        toast.error("Failed to save note", {
          duration: 4000,
          position: "top-center",
        });
      }
    }
  };

  useEffect(() => {
    getDepartments();
    getDocuments();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          zIndex: 1,
          right: 50,
        }}
      >
        {props.meeting?.manageDocuments && (
          <Button
            variant="outlined"
            startIcon={<UploadFileOutlined />}
            onClick={() => setUploadModal(true)}
          >
            Upload Document
          </Button>
        )}
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          position: "relative",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Documents"
          sx={{borderRight: 1, borderColor: "divider"}}
        >
          <Tab
            label={
              <>
                <Badge
                  badgeContent={
                    documents.filter((doc) => doc.departments.length <= 0)
                      .length
                  }
                  color="success"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  variant="dot"
                >
                  General Papers
                </Badge>
              </>
            }
            {...a11yProps(0)}
            sx={{
              display: "flex",
              alignItems: "start",
            }}
          />
          {departments.map((d, index) => (
            <Tab
              label={
                <>
                  <Badge
                    badgeContent={
                      documents.filter(
                        (doc) =>
                          doc.departments.filter((dep) => dep.id === d.id)
                            .length > 0
                      ).length
                    }
                    color="success"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    variant="dot"
                  >
                    {d.name}
                  </Badge>
                </>
              }
              {...a11yProps(index + 1)}
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                textDecoration: "none",
                textTransform: "none",
                textAlign: "left",
              }}
            />
          ))}
        </Tabs>
        <TabPanel value={value} index={0}>
          <Box sx={{height: 30}}></Box>
          <DocumentsComponent
            meeting={props.meeting}
            documents={documents.filter((doc) => doc.departments.length <= 0)}
            handleReader={handleDocumentReaderModal}
            onDelete={(doc: EventDocumentData) => {
              setDocuments(documents.filter((d) => d.id !== doc.id));
            }}
          />
        </TabPanel>
        {departments.map((d, index) => (
          <TabPanel value={value} index={index + 1}>
            <Box sx={{height: 30}}></Box>
            <DocumentsComponent
              meeting={props.meeting}
              department={d}
              documents={documents.filter(
                (doc) =>
                  doc.departments.filter((dep) => dep.id === d.id).length > 0
              )}
              handleReader={handleDocumentReaderModal}
              onDelete={(doc: EventDocumentData) => {
                setDocuments(documents.filter((d) => d.id !== doc.id));
              }}
            />
          </TabPanel>
        ))}
      </Box>

      <Modal
        open={uploadModal}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setUploadModal(false);
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
            Upload Document/Paper
            <IconButton
              sx={{
                position: "absolute",
                right: 10,
                top: 10,
              }}
              onClick={() => setUploadModal(false)}
            >
              <Close />
            </IconButton>
          </Typography>
          <Box>
            <UploadingMeetingDocumentForm
              meeting={props.meeting}
              onFinish={(doc: EventDocumentData) => {
                setDocuments([doc, ...documents]);
                setUploadModal(false);
              }}
            />
          </Box>
        </Box>
      </Modal>

      <Drawer
        anchor={"right"}
        open={readDocumentModal}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setReadDocumentModal(false);
          }
        }}
        sx={{
          overflowY: "none",
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            width: "95vw",
            overflowY: "none",
            overflowX: "hidden",
          }}
        >
          <Box
            sx={{
              mb: 2,
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{
                mt: 2,
                ml: 5,
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  left: 10,
                  top: 15,
                }}
                onClick={() => setReadDocumentModal(false)}
              >
                <Close />
              </IconButton>
              <Box component={"span"} sx={{ml: 3}}>
                {document?.title}
              </Box>
              <IconButton
                sx={{
                  position: "absolute",
                  right: 10,
                  top: 15,
                }}
                onClick={() => setReadDocumentModal(false)}
              >
                <Close />
              </IconButton>
            </Typography>
          </Box>
          <Divider />
          <Grid container>
            <Grid md={4}>
              <Card
                sx={{
                  padding: 2,
                }}
              >
                <CKEditorComponent
                  height={"70vh"}
                  data={document?.note?.note ?? ""}
                  onChange={(data: any) => {
                    setNote(data);
                  }}
                />
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    startIcon={<Save />}
                    variant="outlined"
                    onClick={() => createDocumentNote()}
                  >
                    Save
                  </Button>
                </Box>
              </Card>
            </Grid>
            <Grid md={8}>
              <Card>
                <iframe
                  src={document?.file}
                  width="100%"
                  style={{
                    height: "92vh",
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  );
};

interface DocProps {
  randKey?: number;
  meeting?: EventData | any;
  department?: DepartmentData | any;
  documents?: EventDocumentData[] | any;
  handleReader?: any;
  onDelete?: any;
}

const DocumentsComponent: React.FC<DocProps> = (props: DocProps) => {
  const [open, setOpen] = useState(false);
  const [document, setDocument] = useState<EventDocumentData>();

  const handleDeleteModal = (document: EventDocumentData) => {
    setDocument(document);
    setOpen(true);
  };

  const deleteDocument = async () => {
    const {data} = await new ApiService().deleteEventDocument(
      document?.id ?? 0
    );
    if (data) {
      console.log(data);
      if (data.success) {
        toast.success(data.message, {
          duration: 4000,
          position: "top-center",
        });
        props.onDelete(document);
        setOpen(false);
      } else {
        toast.error(data.message, {
          duration: 4000,
          position: "top-center",
        });
      }
    } else {
      toast.error("Failed to delete document", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
        }}
      >
        {props.documents.length === 0 && (
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Alert
              severity="info"
              sx={{
                width: "100%",
              }}
            >
              No documents found
            </Alert>
          </Box>
        )}

        <Box
          sx={{
            width: "100%",
          }}
        >
          {props.documents.length > 0 && (
            <List>
              {props.documents?.map((d: EventDocumentData) => (
                <>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      sx={{
                        cursor: "pointer",
                      }}
                      primary={d.title}
                      onClick={() => {
                        if (d.file.split(".").pop() === "pdf") {
                          props.handleReader(d);
                        } else {
                          window.open(d.file);
                        }
                      }}
                    />
                    {d.canDelete && (
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteModal(d)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              ))}
            </List>
          )}
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") {
            setOpen(false);
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deleting " + document?.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this document/Paper?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              deleteDocument();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
