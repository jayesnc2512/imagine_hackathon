const BASE_URL = "http://127.0.0.1:8000/api";

async function createChat() {
  const res = await fetch(BASE_URL + '/create_session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  if (!res.ok) {

    return Promise.reject({ status: res.status, data });
  }
  console.log(data);
  return data;
}

async function sendChatMessage(chatId, message) {
  const res = await fetch(BASE_URL + `/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id:chatId,reqChat:message })
  });
  if (!res.ok) {
    return Promise.reject({ status: res.status, data: await res.json() });
  }
  let data = await res.json(); 
  console.log("resp", data.result);
  return data.result;  // Return only the "result" value
}

export default {  
  createChat, sendChatMessage
};