import axios from 'axios';

const API = 'http://localhost:10011';

function handleResponse(response) {
  if (response.statusText === 'OK') {
    return response.data;
  } else {
    throw response;
  }
}

export function agreementOpen(agreement, state) {
  return axios.post(`${API}/v1/agreement/open`, { agreement, state })
    .then(handleResponse);
}

export function channelOpen(publicKey, channel, agreement, gameId) {
  return axios.post(`${API}/v1/chanel/open`, {
    publicKey, channel, agreement, gameId
  }).then(handleResponse);
}