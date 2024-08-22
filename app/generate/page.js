"use client";
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Alert } from "@mui/material";
import { doc, collection, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase"; // Import your Firebase configuration
import Link from "next/link";
import "./flashcard.css"; 

export default function Generate() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [flipped, setFlipped] = useState([]);

  const handleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const saveFlashcards = async () => {
    if (!name.trim()) {
      alert("Please enter a name for the flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), "user-id"); // Replace "user-id" with actual user ID
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [...(userData.flashcardSets || []), { name }];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), name);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleClose();
      setName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please enter some text to generate flashcards.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");
    setFlipped([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: text, difficulty: "medium" }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data.flashcards);
      setFlipped(new Array(data.flashcards.length).fill(false)); // Initialize flip states
      setSuccessMessage("Flashcards generated successfully!");
    } catch (error) {
      setError("An error occurred while generating flashcards. Please try again.");
      console.error("Error generating flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Link href="/">
          <Button
            variant="text"
            color="inherit"
            sx={{ position: "absolute", top: 16, left: 16 }}
          >
            Moody
          </Button>
        </Link>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Flashcards"}
        </Button>
      </Box>

      {/* Display Generated Flashcards */}
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div
                  className={`flashcard ${flipped[index] ? "flipped" : ""}`}
                  onClick={() => handleFlip(index)}
                >
                  <div className="flashcard-inner">
                    <Card className="front">
                      <CardContent>
                        <Typography>{flashcard.front}</Typography>
                      </CardContent>
                    </Card>
                    <Card className="back">
                      <CardContent>
                        <Typography>{flashcard.back}</Typography>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Save Flashcards
            </Button>
          </Box>
        </Box>
      )}

      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      {successMessage && (
        <Snackbar
          open={Boolean(successMessage)}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
        >
          <Alert onClose={() => setSuccessMessage("")} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
