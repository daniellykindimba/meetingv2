import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Breadcrumbs, Tab} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {EventData} from "../../../interfaces";
import ApiService from "../../../utils/api_services";
import {MeetingAttendeesList} from "../home/components/meeting_attendees_list";
import {MeetingDocumentsComponent} from "./component/meeting_documents";
import {MeetingAgendasComponent} from "./component/meeting_agendas";
import {MeetingMinutesComponent} from "./component/meeting_minutes";

interface Props {
  randKey?: number;
}

export const MeetingPage: React.FC<Props> = (props: Props) => {
  const {id} = useParams<{id: string}>();
  const [value, setValue] = useState("2");
  const [meeting, setMeeting] = useState<EventData>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
  };

  const getMeeting = async () => {
    setLoading(true);
    const {data} = await new ApiService().getMeeting(parseInt(id as string));
    if (data) {
      setMeeting(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getMeeting();
  }, []);
  return (
    <>
      {loading ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <h1>Loading...</h1>
          </Box>
        </>
      ) : (
        <>
          <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                style={{
                  textDecoration: "none",
                  textTransform: "none",
                }}
                color="inherit"
                to="/"
              >
                Home
              </Link>
              <Link
                style={{
                  textDecoration: "none",
                  textTransform: "none",
                }}
                color="text.primary"
                to={"/meeting/" + meeting?.id + "/" + meeting?.title}
                aria-current="page"
              >
                {meeting?.title}
              </Link>
            </Breadcrumbs>
          </div>
          <TabContext value={value}>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
              <TabList
                onChange={handleChange}
                aria-label="Meeting Session Window"
              >
                {/* <Tab label="Meeting Feeds" value="1" /> */}
                <Tab label="Documents/Papers" value="2" />
                <Tab label="Agendas" value="3" />
                <Tab label="Minutes" value="4" />
                <Tab label="Attendees" value="5" />
              </TabList>
            </Box>
            {/* <TabPanel value="1">Item One</TabPanel> */}
            <TabPanel value="2">
              <MeetingDocumentsComponent meeting={meeting} />
            </TabPanel>
            <TabPanel value="3">
              <MeetingAgendasComponent meeting={meeting} />
            </TabPanel>
            <TabPanel value="4">
              <MeetingMinutesComponent meeting={meeting} />
            </TabPanel>
            <TabPanel value="5">
              <MeetingAttendeesList meeting={meeting} height="67vh" />
            </TabPanel>
          </TabContext>
        </>
      )}
    </>
  );
};
