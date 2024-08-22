"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid, Card, CardContent, CardActions } from "@mui/material";
import Head from "next/head";
import { styled } from '@mui/material/styles';
import getStripe from "@/utils/get-stripe";
import { Link } from "@mui/icons-material";

export default function Home() {
  const
  handlesubmit=async()=>{
const checkoutSession=await fetch('/api/checkout',{
  method:"POST",
  headers:{
    origin:'http://localhost:3000',
  },
})
const checkoutSessionJson=await checkoutSession.json()
if(checkoutSession.statuscode===500){
  console.error(checkoutSession.message)
  return
}
const stripe=await getStripe()
const {error}=await stripe.redirectToCheckout({
  sessionId:checkoutSessionJson.id
})
if(error){
  console.warn(error.message)
}
  }
  return (
    <Container maxWidth={false} style={{ padding: 0, margin: 0 }}>
      <Head>
        <title>Moody</title>
        <meta name="description" content="create flash card from your prompt" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <b>Moody</b>
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in"><b>Login</b></Button>
            <Button color="inherit" href="/sign-up"><b>Sign Up</b></Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to <b>MOODY</b> cards
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create cards that cheer you up.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Choose Your Plan
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          
          {/* Free Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h5" component="h2">
                  <b>Free</b>
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  $0/month
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                  - Basic Flashcards<br />
                  - Access to core features<br />
                  - Limited AI Generation
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" fullWidth href="/sign-up">
                  <b>Sign Up for Free</b>
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
          
          {/* $5 Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h5" component="h2">
                 <b> Pro</b>
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  $5/month
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                  - Unlimited Flashcards<br />
                  - More AI Generations<br />
                  - Priority Support
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" fullWidth onClick={handlesubmit}>
                  <b>Get Pro Plan</b>
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
          
          {/* $9 Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h5" component="h2">
                <b>Premium</b>
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  $9/month
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                  - Unlimited AI Generations<br />
                  - Custom Features<br />
                  - Dedicated Support
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" fullWidth  onClick={handlesubmit}>
                  <b>Get Premium</b>
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
          
        </Grid>
      </Box>
    </Container>
  );
}

// Styled Card Component with Hover Animation
const StyledCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  transition: 'transform 0.3s, box-shadow 0.3s',
  boxShadow: theme.shadows[3],
  height: '100%',  // Ensure all cards have the same height
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[6],
  },
}));
