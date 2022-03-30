import "./App.scss";
import React, { useEffect, useRef, useState } from "react";

import SVG from "react-inlinesvg";

let to = false;

const SearchResults = (props) => {
  const { usedTerm, movies, path, langConfiguration } = props;

  const arrLength = movies.length;
  const [elRefs, setElRefs] = useState([]);

  // React.useLayoutEffect(() => {
  //   for (let i = 0; i < elRefs.length; i++) {
  //     setTimeout(() => {
  //       elRefs[i].className = elRefs[i].className + " visible";
  //     }, 300);
  //   }
  // }, [elRefs]);

  React.useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(arrLength)
        .fill()
        .map((_, i) => elRefs[i] || React.createRef())
    );
  }, [arrLength]);

  return (
    <div>
      {movies.length > 0 ? (
        <div className="search-term">
          {langConfiguration.documents_found}: "{usedTerm}"
        </div>
      ) : null}
      {movies.length > 0 ? (
        Array.from(movies).map((file, i) => {
          return (
            <div ref={elRefs[i]} className="file-item">
              <i className="fa fa-file-pdf-o" />
              <a
                href={path + "/" + file.srl_document_uri.toUpperCase()}
                target="_blank">
                <div className="file-name">{file.srl_document_uri}</div>
              </a>
            </div>
          );
        })
      ) : (
        <div className="not-found">{langConfiguration.not_found}</div>
      )}
    </div>
  );
};

const MoviesList = (props) => {
  const { usedTerm, movies, path, langConfiguration } = props;

  const arrLength = movies.length;
  const [elRefs, setElRefs] = useState([]);

  React.useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(arrLength)
        .fill()
        .map((_, i) => elRefs[i] || React.createRef())
    );
  }, [arrLength]);

  return (
    <div>
      {movies.length > 0 ? (
        <div className="search-term">{langConfiguration.movies}</div>
      ) : null}
      {movies.length > 0 ? (
        Array.from(movies).map((movie, i) => {
          return (
            <div ref={elRefs[i]} className="movie-item">
              <i className="fa fa-video-o" />
              <a href={movie.homepage} target="_blank">
                <div className="movie-title">{movie.title}</div>
              </a>
              <div className="movie-review">{movie.overview}</div>
            </div>
          );
        })
      ) : (
        <div className="not-found">{langConfiguration.not_found}</div>
      )}
    </div>
  );
};

function App() {
  const userLanguage =
    window.navigator.userLanguage || window.navigator.language;
  console.log("language: ", userLanguage);
  const [langConfiguration, setLangConfiguration] = useState();
  const [isLoaded, setLoaded] = useState(false);
  const [movies, setMovies] = useState([]);
  const [usedTerm, setUsedTerm] = useState();
  const [path, setPath] = useState('');
  const [doSearch, setDoSearch] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  const search = (term) => {
    console.log("search for: ", term);
    setLoadingResults(true);
    setDoSearch(true);

    fetch("/moviesapi/serach?term=" + term + "&lng=" + userLanguage, {
      method: "GET",
      mode: "no-cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
    }).then(function (res) {
      res.json().then((result) => {
        console.log("result", result);
        if (result.movies) {
          setMovies(result.movies);
          setUsedTerm(result.sn);
          setPath(result.url);
          setLoadingResults(false);
        }
      });
    });
  };

  const searchTermChange = (evnt) => {
    if (to) {
      clearTimeout(to);
    }
    to = setTimeout(function () {
      let v = evnt.target.value;

      if (v.length > 2) search(v);
      if (v.length === 0) {
        setLoadingResults(false);
        setDoSearch(false);
      }
    }, 500);
  };

  useEffect(() => {
    fetch("/languages-config.json", {
      method: "GET",
      mode: "no-cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
    }).then(function (res) {
      res.json().then((result) => {
        const _allLangsConfigJson = result;
        const fallbackLanguage = _allLangsConfigJson["fallback"];
        let selectedLangConf = _allLangsConfigJson[userLanguage];
        selectedLangConf
          ? setLangConfiguration(selectedLangConf)
          : setLangConfiguration(_allLangsConfigJson[fallbackLanguage]);
      });
    });

    fetch("/moviesapi/list", {
      method: "GET",
      mode: "cors", // ''no-cors''' no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "omit", // 'same-origin' include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
    }).then(function (res) {
      res.json().then((result) => {
        console.log("result", result);
        if (result.movies) {
          setMovies(result.movies);
          setLoaded(true);
        }
      });
    });
  }, []);

  return (
    <div className="App">
      {isLoaded ? (
        <div>
          <div className="app-header-widebox">
            <div className="header-inner-box">
              <div className="banksone-logo">
                <SVG
                  className="svg-logo"
                  src={`logo.svg`}
                  width="300px"
                  height="69px"
                  title="banksone"
                />
              </div>
              <div className="serials-title">
                {langConfiguration.header_title}
              </div>
            </div>
          </div>
          <div className="info-image">
            <img
              src={langConfiguration.info_image_1}
              class="img-fluid ${3|rounded-top,rounded-right,rounded-bottom,rounded-left,rounded-circle,|}"
              alt=""
            />
          </div>
          <div className="search-results">
            <MoviesList
              movies={movies}
              langConfiguration={langConfiguration}
              usedTerm={usedTerm}
              path={path}
            />
          </div>
          {/* <div className="simple-form">
            <div className="field">
              <input
                type="text"
                name="search"
                id="search"
                aria-describedby="helpId"
                onKeyUp={searchTermChange}
                placeholder={langConfiguration.placeholder_text}
              />
            </div>
          </div> */}
          {/* {doSearch ? (
            <div className="search-results-wrapper">
              <div className="search-results">
                {loadingResults ? (
                  <div classNeme="loading-data">
                    <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                  </div>
                ) : (

                )}
              </div>
            </div>
          ) : null} */}
        </div>
      ) : (
        <div className="loading-screen">
          <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        </div>
      )}
    </div>
  );
}

export default App;
