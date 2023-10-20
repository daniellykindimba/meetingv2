import {Avatar, Typography} from "@mui/material";
import meetingLogo from "../../images/logo.png";
import configs from "../../configs";

interface Props {
  randKey?: number;
  showTitle?: boolean;
}

export const AppTitle: React.FC<Props> = (props: Props) => {
  return (
    <>
      <Avatar
        sx={{
          m: 1,
          bgcolor: "white",
          width: "75px",
          height: "75px",
        }}
        src={meetingLogo}
        variant="square"
      />

      {props.showTitle && (
        <Typography component="h3" variant="h3">
          {configs.system_name}
        </Typography>
      )}
    </>
  );
};
