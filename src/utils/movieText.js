const createMovieEmbeddingText = (movie) =>{
    return `
        Title: ${movie.title}
        Description: ${movie.description}
        Genre: ${movie.genre.join(", ")}
        Language: ${movie.language.join(", ")}
        Cast: ${movie.cast.join(", ")}
        Crew: ${movie.crew.join(", ")}`;
    
};

export { createMovieEmbeddingText };