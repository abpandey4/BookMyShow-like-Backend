## 🔎 Semantic Movie Search

The projects supports semantic movie search using Gemini embeddings & MongoDB Atlas Vector Search.

### How it works 

1. User enters a natural-language movie query.
2. The query is converted into a vector embedding using Gemini.
3. MongoDB Vector Search compares the query embedding with movie embeddings.
4. Movies are ranked according to semantic similarity.
5. Optional filters can be applied for genre and language.
6. Pagination is supported for search results.

### Embedding Generation

Movie Information is converted into embedding text using:

- Title
- Description
- Genre
- Language
- Cast
- Crew

Gemini generates a **768-dimensional embedding** for this text.

### MongoDB Vector Search

Vector Search Index:
```text
movie_vector_index



