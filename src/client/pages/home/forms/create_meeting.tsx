import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ApiService from "../../../../utils/api_services";
import {toast} from "react-hot-toast";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {CommitteeData, DepartmentData, VenueData} from "../../../../interfaces";

interface Props {
  randKey?: number;
  onFinish?: any;
}


export const ControlMeetingCreateForm: React.FC<Props> = (props: Props) => {
  const [venues, setVenues] = useState<VenueData[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [selectCommittees, setSelectCommittees] = useState<boolean>(false);
  const [showDirectorates, setShowDirectorates] = useState<boolean>(false);
  const [financialYears, setFinancialYears] = useState<string[]>([]);
  const [directorates, setDirectorates] = useState<DepartmentData[]>([]);
  const [committees, setCommittees] = useState<CommitteeData[]>([]);
  const [selectedDirectorates, setSelectedDirectorates] = useState<string[]>(
    []
  );
  const [selectedCommittees, setSelectedCommittees] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");

  const getDirectorates = async () => {
    const {data} = await new ApiService().getDirectorates();
    if (data) {
      setDirectorates(data.results);
    }
  };

  const getCommittees = async () => {
    const {data} = await new ApiService().getCommittees();
    if (data) {
      setCommittees(data.results);
    }
  };

  const getFinancialYears = async () => {
    const {data} = await new ApiService().getCreationFinancialYears();
    if (data) {
      console.log(data);
      setFinancialYears(data.data);
    }
  };

  const getEventTypes = async () => {
    const {data} = await new ApiService().getEventTypes();
    if (data) {
      setEventTypes(data.data);
    }
  };

  const getVenues = async () => {
    const {data} = await new ApiService().getVenues();
    if (data) {
      setVenues(data.results);
    }
  };

  const createMeeting = async (formData: FormData) => {
    const {data} = await new ApiService().createMeeting(formData);
    if (data) {
      if (data.success) {
        toast.success(data.message, {
          position: "bottom-right",
        });
        props.onFinish(data.event);
      } else {
        toast.error(data.message, {
          position: "bottom-right",
        });
      }
    }
  };

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: {value},
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangeDirectorate = (event: SelectChangeEvent<string[]>) => {
    const {
      target: {value},
    } = event;
    setSelectedDirectorates(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangeCommittee = (event: SelectChangeEvent<string[]>) => {
    const {
      target: {value},
    } = event;
    setSelectedCommittees(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    getFinancialYears();
    getVenues();
    getEventTypes();
    getDirectorates();
    getCommittees();
  }, []);

  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": {m: 1, width: "100%"},
        }}
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          formData.append("start_time", startDate);
          //convert start time to datetime object
          const startTime = new Date(startDate);
          //create end time by adding duration to start time
          const duration = parseInt(formData.get("duration") as string);
          const durationType = formData.get("duration_type") as string;
          const endTime = new Date(startDate);
          if (durationType === "minutes") {
            endTime.setMinutes(startTime.getMinutes() + duration);
          } else if (durationType === "hours") {
            endTime.setHours(startTime.getHours() + duration);
          } else if (durationType === "days") {
            endTime.setDate(startTime.getDate() + duration);
          }
          formData.append("end_time", endTime.toISOString());
          // console log all form data
          for (const [key, value] of formData.entries()) {
            console.log(key, value);
          }

          createMeeting(formData);
        }}
      >
        <div>
          <TextField
            id="outlined-error"
            label="Meeting Name/Title"
            name="title"
            required={true}
          />
          <TextField
            id="standard-multiline-flexible"
            label="Meeting Description"
            multiline
            name="description"
            minRows={4}
          />

          <Box
            sx={{
              width: "80%",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DateTimePicker"]}
                sx={{
                  overflow: "hidden",
                  paddingRight: "20px",
                }}
              >
                <DateTimePicker
                  label="Start Time"
                  onChange={(newDate: Date | null) => {
                    setStartDate(newDate?.toISOString() ?? "");
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TextField
              id="duration-input"
              label="Meeting Duration"
              name="duration"
              required={true}
            />
            <FormControl
              sx={{
                width: "48%",
                mt: 1,
              }}
            >
              <InputLabel id="demo-simple-select-label">
                Duration Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Duration Type"
                name="duration_type"
                onChange={(e) => {
                  console.log(e);
                }}
              >
                <MenuItem value={"minutes"}>Minutes</MenuItem>
                <MenuItem value={"hours"}>Hours</MenuItem>
                <MenuItem value={"days"}>Days</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControl
            sx={{
              width: "100%",
              mt: 1,
            }}
          >
            <InputLabel id="financial-year-label">Financial Year</InputLabel>
            <Select
              labelId="financial-year-label"
              id="financial-year-input"
              label="Financial Year"
              name="financial_year"
              onChange={(e) => {
                console.log(e);
              }}
              required={true}
            >
              {financialYears.map((fy) => (
                <MenuItem value={fy}>{fy}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              width: "48%",
              mt: 1,
            }}
          >
            <InputLabel id="demo-simple-select-label">Event Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Event Type"
              name="event_type"
              onChange={(e) => {
                console.log(e);
                if (e.target.value === "committee") {
                  setSelectCommittees(true);
                } else {
                  setSelectCommittees(false);
                }

                if (e.target.value === "meeting") {
                  setShowDirectorates(true);
                } else {
                  setShowDirectorates(false);
                }
              }}
              required={true}
            >
              {eventTypes.map((et) => (
                <MenuItem value={et}>
                  {et.charAt(0).toUpperCase() + et.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              width: "48%",
              mt: 1,
              ml: 3,
            }}
          >
            <InputLabel id="demo-simple-select-label">Venue</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Venue"
              name="venue"
              onChange={(e) => {
                console.log(e);
              }}
              required={true}
            >
              {venues.map((venue) => (
                <MenuItem value={venue.id}>{venue.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectCommittees && (
            <FormControl
              fullWidth
              sx={{
                mt: 3,
              }}
            >
              <InputLabel id="committees-input">Committees</InputLabel>
              <Select
                labelId="committees-input"
                id="committees-input-select"
                value={selectedCommittees}
                label="Committees"
                name="committees"
                onChange={handleChangeCommittee}
                multiple
              >
                {committees.map((c) => (
                  <MenuItem key={"committee-" + c.id} value={c.id.toString()}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {showDirectorates && (
            <FormControl
              fullWidth
              sx={{
                mt: 3,
              }}
            >
              <InputLabel id="directorate-input">Directorates</InputLabel>
              <Select
                labelId="directorate-input"
                id="directorate-input-select"
                value={selectedDirectorates}
                label="Directorates"
                name="directorates"
                onChange={handleChangeDirectorate}
                multiple
              >
                {directorates.map((directorate) => (
                  <MenuItem
                    key={"directorate-" + directorate.id}
                    value={directorate.id.toString()}
                  >
                    {directorate.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 5,
          }}
        >
          <Button
            variant="contained"
            type="submit"
            disabled={startDate.length === 0}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};
