import { useEffect, useRef, useState } from 'react';

export const isObjectEqual = (objA, ObjB) => {
  return JSON.stringify(objA) === JSON.stringify(ObjB);
};

export const useFetch = (url, options) => {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const urlRef = useRef(url);
  const optionsRef = useRef(options);

  useEffect(() => {
    let changed = false;

    if (!isObjectEqual(url, urlRef.current)) {
      urlRef.current = url;
      changed = true;
    }
    if (!isObjectEqual(options, optionsRef.current)) {
      optionsRef.current = options;
      changed = true;
    }

    if (changed) {
      setShouldLoad((shouldLoad) => !shouldLoad);
    }
  }, [url, options]);

  useEffect(() => {
    let wait = false;
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    console.log(optionsRef.current.headers);
    const fetchData = async () => {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const response = await fetch(urlRef.current, { signal, ...optionsRef.current });
        const jsonResult = await response.json();
        if (!wait) {
          setResult(jsonResult);
          setLoading(false);
        }
      } catch (error) {
        if (!wait) {
          setLoading(false);
        }
        console.warn(error);
      }
    };

    fetchData();

    return () => {
      wait = true;
      controller.abort();
    };
  }, [shouldLoad]);

  return [result, loading];
};
