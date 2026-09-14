const parseMovieArrays = ({genre, language, cast,crew})=>{
    return{
        genre: JSON.parse(genre),
        language: JSON.parse(language),
        cast: JSON.parse(cast),
        crew: JSON.parse(crew)
    };
};

export { parseMovieArrays };