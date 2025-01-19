import { useRef, useState } from "react";
import { useChat } from "../hooks/useChat";

export const UI = ({ hidden, ...props }) => {
  const { chat, loading, cameraZoomed, setCameraZoomed } = useChat();
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      console.log("File selected:", file.name);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("https://your-server-endpoint.com/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("File uploaded successfully:", result);
          alert(`File "${selectedFile.name}" uploaded successfully!`);
        } else {
          console.error("Failed to upload file:", response.statusText);
          alert("Failed to upload file. Please try again.");
        }
      } catch (error) {
        console.error("Error during file upload:", error);
        alert("An error occurred while uploading the file.");
      }
    }
  };

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
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
      {/* Other UI elements */}
      <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
        <button
          onClick={recording ? stopRecording : startRecording}
          className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
        >
          {recording ? "Stop" : "Start"} Recording
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
      {/* <div className="fixed bottom-4 right-4 pointer-events-auto">
        <button
          onClick={() => alert("Button Clicked!")}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          Action
        </button>
      </div> */}
        <div className="fixed bottom-4 right-4 pointer-events-auto">
    <label
      htmlFor="file-upload"
      className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg cursor-pointer flex items-center justify-center"
    >
      Upload File
    </label>
    <input
      id="file-upload"
      type="file"
      onChange={handleUploadClick()}
      className="hidden"
    />
  </div>
    </div>
  );
};
