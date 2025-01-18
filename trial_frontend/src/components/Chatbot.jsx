import { useState } from 'react';
import { useImmer } from 'use-immer';
import api from '../api';
import { parseSSEStream } from '../utils';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

function Chatbot() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useImmer([]);
  const [newMessage, setNewMessage] = useState('');

  const isLoading = messages.length && messages[messages.length - 1].loading;

  async function submitNewMessage() {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isLoading) return;

    setMessages(draft => [...draft,
    { role: 'user', content: trimmedMessage },
    { role: 'assistant', content: '', sources: [], loading: true }
    ]);
    setNewMessage('');

    let chatIdOrNew = chatId;
    try {
      if (!chatId) {
        const { session_id } = await api.createChat();
        setChatId(session_id);
        chatIdOrNew = session_id;
      }

      const response = await api.sendChatMessage(chatIdOrNew, trimmedMessage);

      setMessages(draft => {
        draft[draft.length - 1].content = response; // assuming response is the full content
        draft[draft.length - 1].loading = false;
      });
    } catch (err) {
      console.log(err);
      setMessages(draft => {
        draft[draft.length - 1].loading = false;
        draft[draft.length - 1].error = true;
      });
    }
  }

  return (
    <div className='relative grow flex flex-col gap-6 pt-6'>
      {messages.length === 0 && (
        <div className='mt-3 font-urbanist text-primary-blue text-xl  space-y-2'>
          <p>👋 Welcome!</p>
          <p>I am powered by the complete information and reports from the Maharashtra Intellectual property crime unit (MIPCU). I've been created by the Pirates Alert</p>
          <p>Ask me anything about the MIPCU.</p>
        </div>
      )}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
      />
      <ChatInput
        newMessage={newMessage}
        isLoading={isLoading}
        setNewMessage={setNewMessage}
        submitNewMessage={submitNewMessage}
      />
    </div>
  );
}

export default Chatbot;