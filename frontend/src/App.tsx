import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Button, Card, CardContent, Grid, AppBar, Toolbar, Modal, Box, TextField } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const fetchedPosts = await backend.getPosts();
    setPosts(fetchedPosts);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: { title: string; body: string; author: string }) => {
    await backend.addPost(data.title, data.body, data.author);
    handleClose();
    fetchPosts();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Crypto Blog
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundImage: 'url(https://loremflickr.com/g/1200/400/cryptocurrency?lock=123)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
            marginTop: 4,
          }}
        >
          <Typography variant="h2" component="h1" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Welcome to Crypto Blog
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ marginBottom: 2 }}
        >
          Add New Post
        </Button>

        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={Number(post.id)}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {post.title}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    By {post.author}
                  </Typography>
                  <Typography variant="body2">{post.body}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Post
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: 'Title is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="body"
                control={control}
                defaultValue=""
                rules={{ required: 'Body is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Body"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="author"
                control={control}
                defaultValue=""
                rules={{ required: 'Author is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Author"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Submit
              </Button>
            </form>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default App;
