const customFetch = async (url, params) => {
  const res = await fetch(url, params);

  if (res.status < 200 || res.status >= 300) {
    const err = new Error(res.statusText);
    err.response = res;
    throw err;
  }

  return res.json();
};

export default customFetch;
