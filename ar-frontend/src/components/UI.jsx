import { useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash,faStop } from '@fortawesome/free-solid-svg-icons';




export const UI = ({ hidden, ...props }) => {
  const { chat, loading, cameraZoomed, setCameraZoomed } = useChat();
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioRef = useRef();

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    const chunks = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      // setAudioBlob(blob);
      chat(blob, "english");
      // setAudioFile(blob);
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setRecording(false);
    };

    recorder.start();
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
    }
  };
  // const sendAudio = () => {
  //   if (audioFile) {
  //     chat(audioFile, "english"); // Assuming language is 'en' for English
  //   }
  // };

  if (hidden) return null;

  return (
    <div className="fixed bottom-5 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
      {/* Other UI elements */}
      <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
        <button
          onClick={recording ? stopRecording : startRecording}
          className="bg-transparent hover:bg-transparent text-white rounded-md px-10"
          style={{ fontSize: "90px", color: "black",  "borderRadius": "150px", opacity: "75%" }}
        >
          {/* "border": "solid 2px", */}
          <FontAwesomeIcon icon={recording ? faStop : faMicrophone} color={ recording? "red": "black" } />
        </button>
        {/* <button
          disabled={loading || !audioFile}
          onClick={sendAudio}
          className={`bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${loading || !audioFile ? "cursor-not-allowed opacity-30" : ""
            }`}
        >
          Send
        </button> */}
      </div>
    </div>
  );
};
