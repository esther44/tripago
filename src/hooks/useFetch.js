import { useState, useEffect, useRef } from "react";

export const useFetch = (url, _options) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  // use useRef to wrap an object/array argument
  // wich is a useEffect dependency
  const options = useRef(_options).current

  useEffect(() => {
      console.log(options)
    const controller = new AbortController();
    const fetchData = async () => {
      setIsPending(true);

      try {
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          // si il y a une erreur les appels aux méthodes suivantes s'arrêtent
          throw new Error(res.statusText);
        }
        const json = await res.json();

        setIsPending(false);
        setData(json);
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("The fetch was aborted");
        } else {
          setIsPending(false);
          setError("Could'nt fetch the data");
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, options]);

  return { data, isPending, error };
};
