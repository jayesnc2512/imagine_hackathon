from elevenlabs import ElevenLabs

client = ElevenLabs(api_key="sk_b10b12b7dc29b43192de6c9261a54ade4e3ffd8ee77fdec4")

# Convert the text to speech
def text_to_audio(text):
    response = client.text_to_speech.convert(
        voice_id="1qEiC6qsybMkmnNdVMbK",
        # language_code="hi",
        model_id="eleven_multilingual_v2",
        text=text
    )

    temp_audio_file = "output_audio.mp3"
    with open(temp_audio_file, "wb") as audio_file:
        for chunk in response:
            audio_file.write(chunk)
    return temp_audio_file
