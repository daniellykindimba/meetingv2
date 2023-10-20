import * as React from "react";
import {useSpring, animated} from "@react-spring/web";
import SvgIcon, {SvgIconProps} from "@mui/material/SvgIcon";
import {TransitionProps} from "@mui/material/transitions";
import Collapse from "@mui/material/Collapse";
import {alpha, styled} from "@mui/material/styles";
import {TreeView} from "@mui/x-tree-view/TreeView";
import {
  TreeItem,
  TreeItemProps,
  treeItemClasses,
} from "@mui/x-tree-view/TreeItem";
import {Box, Chip, Typography} from "@mui/material";
import ApiService from "../../../utils/api_services";
import {useEffect, useState} from "react";
import {CommitteeData, EventData} from "../../../interfaces";
import moment from "moment";
import {Link} from "react-router-dom";

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{width: 14, height: 14, color: "black"}} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{width: 14, height: 14, color: "black"}} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{width: 14, height: 14, color: "black"}}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(20px,0,0)",
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const CustomTreeItem = React.forwardRef(
  (props: TreeItemProps, ref: React.Ref<HTMLLIElement>) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} ref={ref} />
  )
);

const StyledTreeItem = styled(CustomTreeItem)(({theme}) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export default function BoardCommitteeMeetingsPage() {
  const [loading, setLoading] = useState(false);
  const [financialYears, setFinancialYears] = useState<string[]>([]);
  const [committees, setCommittees] = useState<CommitteeData[]>([]);

  const getFinancialYears = async () => {
    const {data} = await new ApiService().getFinancialYears();
    if (data) {
      setFinancialYears(data.data);
    }
  };

  const getCommittees = async () => {
    const {data} = await new ApiService().getCommittees();
    if (data) {
      setCommittees(data.results);
    }
  };

  useEffect(() => {
    getFinancialYears();
    getCommittees();
  }, []);

  return (
    <>
      <Box>
        <Typography component="h5" variant="h5">
          Board Committee Meeting
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: 2,
        }}
      >
        <TreeView
          aria-label="customized"
          defaultExpanded={["0"]}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
          onNodeSelect={(event: any, value: any) => {
            console.log(event, value);
          }}
        >
          {financialYears.map((fy, index) => (
            <StyledTreeItem nodeId={index.toString()} label={fy}>
              {committees.map((c) => (
                <StyledTreeItem nodeId={"committee-" + c.id} label={c.name}>
                  <TreeNodeComponent financialYear={fy} committee={c} />
                </StyledTreeItem>
              ))}
            </StyledTreeItem>
          ))}
        </TreeView>
      </Box>
    </>
  );
}

interface TreeNodeProps {
  randKey?: number;
  financialYear?: string;
  committee?: CommitteeData | any;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = (props: TreeNodeProps) => {
  const [meetings, setMeetings] = useState<EventData[]>([]);
  const getMeetings = async (page = 1, pageSize = 25, searchKey = "") => {
    const {data} = await new ApiService().getMyMeetings({
      page: page,
      pageSize: pageSize,
      searchKey: searchKey,
      eventType: "committee",
      financialYear: props.financialYear,
      committeeId: props.committee.id,
    });
    if (data) {
      setMeetings(data.results);
    }
  };

  useEffect(() => {
    getMeetings();
  }, []);

  return (
    <>
      {meetings.map((m: EventData) => (
        <StyledTreeItem
          sx={{mt: 1}}
          nodeId={"meeting-" + m.id}
          label={
            <>
              <Link
                to={"/meeting/" + m.id + "/" + m.title}
                style={{
                  textDecoration: "none",
                  textTransform: "none",
                  color: "inherit",
                }}
              >
                <Typography>
                  {m.title} <Chip label={moment(m.startTime).format("lll")} />
                </Typography>
              </Link>
            </>
          }
        />
      ))}
    </>
  );
};
