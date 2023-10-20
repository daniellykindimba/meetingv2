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
  ListItemText,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";
import {CommitteeData, EventData, UserData} from "../../../../interfaces";
import {Add} from "@mui/icons-material";
import {get} from "http";

interface Props {
  randKey?: number;
  onFinish?: any;
  meeting?: EventData | any;
}

export const AddingMeetingCommittees: React.FC<Props> = (props: Props) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchKey, setSearchKey] = useState("");
  const [committees, setCommittees] = useState<CommitteeData[]>([]);

  const addingCommittee = async (committee_id: number) => {
    const {data} = await new ApiService().addMeetingCommittee(
      props.meeting.id,
      committee_id
    );
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-left",
        });
        setCommittees(
          committees.filter((c: CommitteeData) => c.id !== committee_id)
        );
        props.onFinish(data.eventCommittee);
        if (
          committees.filter((c: CommitteeData) => c.id !== committee_id)
            .length === 0
        ) {
          getCommittees();
        }
      } else {
        toast.error(data.message, {
          position: "bottom-left",
        });
      }
    }
  };

  const getCommittees = async (searchKey = "") => {
    const {data} = await new ApiService().getMeetingCommitteesToAdd(
      props.meeting.id,
      searchKey
    );
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
      <Box
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          getCommittees((e.target as HTMLFormElement).search.value);
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
        {committees.length === 0 && (
          <>
            <ListItem>
              <Alert
                sx={{
                  width: "100%",
                }}
              >
                <Typography>Committee Found ...</Typography>
              </Alert>
            </ListItem>
          </>
        )}
        {committees.map((c: CommitteeData) => {
          return (
            <>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <IconButton
                    onClick={() => {
                      addingCommittee(c.id);
                    }}
                  >
                    <Add />
                  </IconButton>
                }
              >
                <ListItemText primary={c.name} />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          );
        })}
      </List>
      {committees.length > 0 && (
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
              getCommittees(searchKey);
            }}
          />
        </Box>
      )}
    </>
  );
};
