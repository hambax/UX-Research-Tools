import React from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Card Sort',
      description: 'Conduct card sorting exercises to understand how users organize and categorize information.',
      path: '/card-sort',
    },
    {
      title: 'Coming Soon: Tree Test',
      description: "Evaluate the findability of topics in a website's navigation structure.",
      path: '/tree-test',
      disabled: true,
    },
    {
      title: 'Coming Soon: First Click Test',
      description: 'Analyze where users first click when attempting to complete a task.',
      path: '/first-click',
      disabled: true,
    },
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome to UX Research Tools
      </Typography>
      <Typography variant="body1" paragraph>
        Select a tool below to begin your UX research:
      </Typography>
      <Grid container spacing={3}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.title}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tool.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => navigate(tool.path)}
                  disabled={tool.disabled}
                >
                  {tool.disabled ? 'Coming Soon' : 'Start'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;
