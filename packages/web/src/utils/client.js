const baseUrl = 'http://localhost:3000/api/'

const client = async ({url, ...rest}) => {
  const response = await fetch(baseUrl + url, {
    mode: 'cors',
    ...rest,
  });
  if (!response.ok) {
    console.log(response);
    throw response;
  }
  return response.json();
}

export default client;
