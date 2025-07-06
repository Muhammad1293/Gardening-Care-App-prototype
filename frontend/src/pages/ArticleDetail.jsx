import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error("Error fetching article:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (notFound || !article) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5"> Article not found</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {article.title}
        </Typography>

        <img
  src={`http://localhost:5000${article.image_url}`}
  alt={article.title}
  style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
/>



        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          {article.content}
        </Typography>
      </Paper>
    </Container>
  );
};

export default ArticleDetail;
