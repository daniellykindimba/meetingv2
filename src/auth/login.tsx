import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {useLogin, useNavigation} from "@refinedev/core";
import {Button, Card, CardContent} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {AppTitle} from "../components/title";

interface ILoginForm {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const {mutate: login, isLoading} = useLogin<ILoginForm>();
  const {push} = useNavigation();

  const handleSubmit = (values: ILoginForm) => {
    console.log(values);
    login(values);
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

            <Typography component="h4" variant="h6">
              Welcome please login to continue
            </Typography>

            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                // get form data
                const formData = new FormData(e.target as HTMLFormElement);
                handleSubmit({
                  email: formData.get("username") as string,
                  password: formData.get("password") as string,
                });
              }}
              noValidate
              sx={{mt: 1}}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="text"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                loading={isLoading}
              >
                Sign In
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  <Button
                    onClick={() => {
                      push("/forgot-password");
                    }}
                  >
                    Forgot password?
                  </Button>
                </Grid>
                 {/* <Grid item>
                  <Link
                    to="/register"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid> */}
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
