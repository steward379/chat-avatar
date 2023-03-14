import { useState, useEffect } from "react";
import loadingGif from "./assets/loading.gif";
import lens from "./assets/lens.png";
import './App.css';


function App() {
  const [prompt, updatePrompt] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadImage, setUploadImage] = useState(false);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageUrl(reader.result);
      setUploadImage(true);
    };

    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswers([...answers]);
    }
  }, [prompt]);

  const sendPrompt = async (event) => {
    if (event.key !== "Enter") {
      return;
    }
    //composition event
    console.log('prompt', prompt)

    try {
      setLoading(true);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      };
  
      const res = await fetch("/api/ask", requestOptions);

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const { message } = await res.json();
      // setAnswer(message);
      setAnswers([...answers, message])

    } catch (err){
      console.error(err, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
          <textarea
            type="text"
            cols="5" rows="2"
            className="spotlight__input"
            placeholder="Ask me anything..."
            onChange={(e) => updatePrompt(e.target.value)}
            onKeyDown={(e) => sendPrompt(e)}
            disabled={loading}
            style={{
              display: "block",
              backgroundImage: loading ? `url(${loadingGif})` : `url(${lens})`,
            }}
          /><p>{prompt}</p>
         <hr></hr>
          <div className="spotlight__answer">
            {/* {answer && <p>{answer}</p>} */}
            {answers.map((answer, index) =>  (
            <p key={index}>
              {answer}
              <br />
            </p>
           ))}
          </div>
        </div>
        <div>
          <input type='file' onChange={handleImageUpload} /> 
          <br></br>
          {/* {imageUrl &&  */}
          <img 
              id="myImg" 
              // src={imageUrl} 
              src= {uploadImage ? imageUrl : lens }
              alt="uploaded image" 
              height="500"
          />
        </div>
      </div>
    </div>
  )
}

export default App;

          // {/* <img 
          //   id="myImg" 
          //   src={require("./assets/lens.png")} 
          //   alt="your image"
          //   height="200"
          //   width="200"
          // /> */}
