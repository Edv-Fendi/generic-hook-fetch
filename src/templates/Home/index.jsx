import { useCallback, useEffect, useState } from 'react';
import './App.css';

const useAsync = (asyncFunction, shouldRun) => {
  const [state, setState] = useState({
    result: null,
    error: null,
    status: 'iddle',
  });

  const run = useCallback(() => {
    setState({
      result: null,
      error: null,
      status: 'pending',
    });

    return asyncFunction()
      .then((response) => {
        setState({
          result: response,
          error: null,
          status: 'settled',
        });
      })
      .catch((error) => {
        setState({
          result: null,
          error: error,
          status: 'error',
        });
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (shouldRun) {
      run();
    }
  }, [run, shouldRun]);

  return [run, state.result, state.error, state.status];
};

const fetchData = async () => {
  await new Promise((r) => setTimeout(r, 2000));
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  return data;
};

export const Home = () => {
  const [reFectchData, result, error, status] = useAsync(fetchData, true);

  function handleClick() {
    reFectchData();
  }

  if (status === 'idle') {
    return <pre>idle: Parado</pre>;
  }

  if (status === 'pending') {
    return <pre>pending: Loading...</pre>;
  }

  if (status === 'error') {
    return <pre>error: {error.message}</pre>;
  }

  if (status === 'settled') {
    return <pre onClick={handleClick}>settled: {JSON.stringify(result, null, 2)}</pre>;
  }

  return 'F';
};

export default Home;
