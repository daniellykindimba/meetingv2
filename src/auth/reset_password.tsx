import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {Card, CardContent} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {AppTitle} from "../components/title";
import {Link} from "react-router-dom";
import ApiService from "../utils/api_services";
import {useState} from "react";

export const ResetPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const handleSubmit = async (email: string) => {
    setEmail(email);
    const {data} = await new ApiService().forgotPassword(email);
    if (data.success) {
      setStep(2);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setOtp(otp);
    const {data} = await new ApiService().verifyOtp(email, otp);
    if (data.success) {
      setStep(3);
    }
  };

  const resetPassword = async (password: string, confirm_password: string) => {
    const {data} = await new ApiService().changePassword(
      email,
      otp,
      password,
      confirm_password
    );
    if (data.success) {
      setStep(4);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        minWidth: {
          xs: "100vw",
          sm: "50vw",
          md: "25vw",
          xl: "25vw",
        },
      }}
    >
      <Card>
        <CardContent sx={{p: "15px", "&:last-child": {pb: "32px"}}}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <AppTitle showTitle={true} />

            {step === 1 && (
              <>
                <Typography
                  component="h4"
                  variant="h6"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Welcome please Enter Your Email Address to continue
                </Typography>
                <Box
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // get form data
                    const formData = new FormData(e.target as HTMLFormElement);
                    handleSubmit(formData.get("email") as string);
                  }}
                  noValidate
                  sx={{mt: 1}}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="text"
                    autoFocus
                  />
                  <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                  >
                    Submit
                  </LoadingButton>
                  <Grid container>
                    {/* <Grid item xs>
                  <Button
                    onClick={() => {
                      push("/forgot-password");
                    }}
                  >
                    Forgot password?
                  </Button>
                </Grid> */}
                    <Grid item>
                      <Link
                        to="/login"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        {"Have an account? Sign In"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}

            {step === 2 && (
              <>
                <Typography
                  component="h4"
                  variant="h6"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Please Enter the Verification Code sent to your Mobile Phone
                  Number via SMS
                </Typography>
                <Box
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // get form data
                    const formData = new FormData(e.target as HTMLFormElement);
                    verifyOtp(email, formData.get("otp") as string);
                  }}
                  noValidate
                  sx={{mt: 1}}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="otp"
                    label="Verification Code"
                    name="otp"
                    autoComplete="text"
                    autoFocus
                  />
                  <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                  >
                    Verify
                  </LoadingButton>
                  <Grid container>
                    {/* <Grid item xs>
                  <Button
                    onClick={() => {
                      push("/forgot-password");
                    }}
                  >
                    Forgot password?
                  </Button>
                </Grid> */}
                    <Grid item>
                      <Link
                        to="/login"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        {"Have an account? Sign In"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}

            {step === 3 && (
              <>
                <Typography
                  component="h4"
                  variant="h6"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Please provide details below to reset your password
                </Typography>
                <Box
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // get form data
                    const formData = new FormData(e.target as HTMLFormElement);
                    resetPassword(
                      formData.get("password") as string,
                      formData.get("confirm_password") as string
                    );
                  }}
                  noValidate
                  sx={{mt: 1}}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="New Password"
                    name="password"
                    autoComplete="text"
                    type="password"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="confirm-password"
                    label="Confirm Password"
                    name="confirm_password"
                    autoComplete="text"
                    type="password"
                    autoFocus
                  />
                  <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                  >
                    Reset
                  </LoadingButton>
                  <Grid container>
                    {/* <Grid item xs>
                  <Button
                    onClick={() => {
                      push("/forgot-password");
                    }}
                  >
                    Forgot password?
                  </Button>
                </Grid> */}
                    <Grid item>
                      <Link
                        to="/login"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        {"Have an account? Sign In"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}

            {step === 4 && (
              <>
                <Typography
                  component="h4"
                  variant="h6"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Password Reset Successful, Please Login to continue
                </Typography>
                <Grid container>
                  <Grid item>
                    <Link
                      to="/login"
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      {"Click here to Login"}
                    </Link>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
