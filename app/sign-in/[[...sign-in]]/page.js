import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return(
    <Container maxWidth={false} style={{ padding: 0, margin: 0 }}>
    <AppBar position="static" sx={{backgroundColor: '#3f51b5'}}>
      <Toolbar>
        <Typography variant="h6" sx={{flexGrow: 1}}>
          Moody Cards
        </Typography>
        <Button color="inherit">
          <Link href="/sign-in" passHref>
        Login
          </Link>
        </Button>
        <Button color='inherit'>
            <Link href="/sign-up" passHref>signUp</Link>
        </Button>
      </Toolbar>
    </AppBar>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{textAlign: 'center', my: 4}}
    >
       <Typography 
  variant="h4" 
  component="h1" 
  gutterBottom 
  align="center"
  style={{ color: '#333', fontWeight: 'bold' }}
>
    Login to your account
</Typography>
      <SignIn/>
    </Box>
  </Container>
  )
}